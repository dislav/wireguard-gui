import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeSSH, SSHExecOptions } from 'node-ssh';
import { v4 as uuidv4 } from 'uuid';
import * as qrcode from 'qrcode';

import { InjectConnect } from '@wireguard-vpn/common';
import { Config } from './entities/config.entity';
import { Server } from './entities/server.entity';
import { Client } from './entities/client.entity';
import { Dump } from './entities/dump.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class WireguardService {
  private readonly logger = new Logger(WireguardService.name);

  private readonly WG_HOST = this.configService.get<string>('WG_HOST');
  private readonly WG_PORT = this.configService.get<string>('WG_PORT');
  private readonly WG_CWD = this.configService.get<string>(
    'WG_CWD',
    '/etc/wireguard',
  );
  private readonly WG_DNS = this.configService.get<string>('WG_DNS');
  private readonly WG_MTU = this.configService.get<string>('WG_MTU');
  private readonly WG_ADDRESS = this.configService.get<string>('WG_ADDRESS');
  private readonly WG_ALLOWED_IPS =
    this.configService.get<string>('WG_ALLOWED_IPS');
  private readonly WG_PERSISTENT_KEEPALIVE = this.configService.get<string>(
    'WG_PERSISTENT_KEEPALIVE',
    '0',
  );

  constructor(
    @InjectConnect() private readonly connect: NodeSSH,
    private readonly configService: ConfigService,
  ) {}

  async getConfig(): Promise<Config> {
    try {
      const wg0Json = await this.exec('cat wg0.json');

      return JSON.parse(wg0Json);
    } catch {
      return this.createConfig();
    }
  }

  async getClients(): Promise<Client[]> {
    const config = await this.getConfig();
    const dumps = await this.getDump();

    return Object.values(config.clients).map((client) => {
      const clientDump = dumps.find(
        (dump) => dump.publicKey === client.publicKey,
      );

      return {
        ...client,
        latestHandshakeAt: clientDump?.latestHandshakeAt ?? null,
        transferRx: clientDump?.transferRx ?? null,
        transferTx: clientDump?.transferTx ?? null,
        persistentKeepalive: clientDump?.persistentKeepalive ?? '',
      };
    });
  }

  async getClient(id: string): Promise<Client> {
    const config = await this.getConfig();
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async getDump(): Promise<Dump[]> {
    const dump = await this.exec('wg show wg0 dump');

    return dump
      .trim()
      .split('\n')
      .slice(1)
      .map((line) => {
        const [
          publicKey,
          preSharedKey,
          endpoint,
          allowedIps,
          latestHandshakeAt,
          transferRx,
          transferTx,
          persistentKeepalive,
        ] = line.split('\t');

        const dump = new Dump();
        dump.publicKey = publicKey;
        dump.preSharedKey = preSharedKey;
        dump.endpoint = endpoint;
        dump.allowedIps = allowedIps;
        dump.latestHandshakeAt =
          latestHandshakeAt !== '0'
            ? new Date(Number(`${latestHandshakeAt}000`))
            : null;
        dump.transferRx = Number(transferRx);
        dump.transferTx = Number(transferTx);
        dump.persistentKeepalive = persistentKeepalive;

        return dump;
      });
  }

  async getClientConfig(id: string): Promise<string> {
    const config = await this.getConfig();
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return `[Interface]
PrivateKey = ${client.privateKey}
Address = ${client.address}/24
${this.WG_DNS ? `DNS = ${this.WG_DNS}\n` : ''}\
${this.WG_MTU ? `MTU = ${this.WG_MTU}\n` : ''}\

[Peer]
PublicKey = ${config.server.publicKey}
PresharedKey = ${client.preSharedKey}
AllowedIPs = ${this.WG_ALLOWED_IPS}
PersistentKeepalive = ${this.WG_PERSISTENT_KEEPALIVE}
Endpoint = ${this.WG_HOST}:${this.WG_PORT}`;
  }

  async getClientQRCode(id: string): Promise<string> {
    const clientConfig = await this.getClientConfig(id);

    return qrcode.toString(clientConfig, { type: 'svg', width: 512 });
  }

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    const config = await this.getConfig();
    const clientsLength = Object.keys(config.clients ?? {}).length + 1;

    const privateKey = await this.exec('wg genkey');
    const publicKey = await this.exec(`echo ${privateKey} | wg pubkey`);
    const preSharedKey = await this.exec('wg genpsk');

    let address: string;
    if (clientsLength < 255) {
      address = this.WG_ADDRESS.replace('x', `${clientsLength + 1}`);
    } else {
      throw new BadRequestException('Maximum number of clients reached');
    }

    const id = uuidv4();

    const client = new Client();
    client.id = id;
    client.telegramId = createClientDto.telegramId ?? null;
    client.name = createClientDto.name;
    client.privateKey = privateKey;
    client.publicKey = publicKey;
    client.preSharedKey = preSharedKey;
    client.address = address;
    client.enabled = true;
    client.expiryDate = createClientDto.expiryDate
      ? new Date(createClientDto.expiryDate)
      : null;
    client.createdAt = new Date();
    client.updatedAt = new Date();

    config.clients[id] = client;

    await this.saveConfig(config);

    return client;
  }

  async updateClient(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    const config = await this.getConfig();
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.name = updateClientDto.name;
    client.updatedAt = new Date();

    await this.saveConfig(config);

    return client;
  }

  async enableClient(id: string): Promise<Client> {
    const config = await this.getConfig();
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.enabled = true;
    client.updatedAt = new Date();

    await this.saveConfig(config);

    return client;
  }

  async disableClient(id: string): Promise<Client> {
    const config = await this.getConfig();
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.enabled = false;
    client.updatedAt = new Date();

    await this.saveConfig(config);

    return client;
  }

  async removeClient(id: string): Promise<Client> {
    const config = await this.getConfig();
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    delete config.clients[id];
    await this.saveConfig(config);

    return client;
  }

  private async createConfig(): Promise<Config> {
    const config = new Config();

    try {
      const wgConfig = await this.exec('cat wg0.conf');
      const wgConfigPeers = wgConfig.split('[Peer]');

      const serverConfig = wgConfigPeers?.[0];

      if (!serverConfig?.includes('[Interface]')) {
        throw new Error('Wireguard server configuration does not exist');
      }

      const server = new Server();
      const privateKey = serverConfig.match(/PrivateKey\s=\s(.*)/)[1];
      const publicKey = await this.exec(`echo ${privateKey} | wg pubkey`);
      const address = serverConfig.match(/Address\s=\s(.*)/)[1];

      server.privateKey = privateKey;
      server.publicKey = publicKey;
      server.address = address;

      config.server = server;

      const clientsConfig = wgConfigPeers.slice(1);

      if (clientsConfig.length) {
        clientsConfig.forEach((clientConfig, index) => {
          const publicKey = clientConfig.match(/PublicKey\s=\s(.*)/)[1];
          const preSharedKey = clientConfig.match(/PresharedKey\s=\s(.*)/)[1];
          const allowedIps = clientConfig.match(/AllowedIPs\s=\s(.*)/)[1];

          if (publicKey && preSharedKey && allowedIps) {
            const id = uuidv4();

            const client = new Client();
            client.id = id;
            client.telegramId = null;
            client.name = `client${index + 1}`;
            client.privateKey = privateKey;
            client.publicKey = publicKey;
            client.preSharedKey = preSharedKey;
            client.address = allowedIps.split('/')[0];
            client.enabled = true;
            client.expiryDate = null;
            client.createdAt = new Date();
            client.updatedAt = new Date();

            config.clients = {
              ...config.clients,
              [id]: client,
            };
          }
        });
      }
    } catch {
      const privateKey = await this.exec('wg genkey');
      const publicKey = await this.exec(`echo ${privateKey} | wg pubkey`);
      const address = this.WG_ADDRESS.replace('x', '1');

      const server = new Server();
      server.privateKey = privateKey;
      server.publicKey = publicKey;
      server.address = address;

      config.server = server;
      config.clients = {};
    }

    await this.saveConfig(config);

    return config;
  }

  private async saveConfig(config: Config): Promise<void> {
    let result = `# Note: Do not edit this file directly.
# Your changes will be overwritten!

# Server
[Interface]
PrivateKey = ${config.server.privateKey}
Address = ${config.server.address}/24
MTU = ${this.WG_MTU}
ListenPort = ${this.WG_PORT}`;

    Object.entries(config.clients ?? {}).forEach(([id, client]) => {
      if (client.enabled) {
        result += `

# Client ${client.name} (${id})
[Peer]
PublicKey = ${client.publicKey}
PresharedKey = ${client.preSharedKey}
AllowedIPs = ${client.address}/32`;
      }
    });

    await this.exec(`echo '${JSON.stringify(config, null, 2)}' > wg0.json`);
    await this.exec(`echo '${result}' > wg0.test.conf`);

    this.logger.log('Config saved successfully');
  }

  private async reloadWireguard(): Promise<void> {
    try {
      await this.exec('wg-quick down wg0');
      await this.exec('wg-quick up wg0');

      this.logger.log('Reload wireguard successfully');
    } catch (err) {
      this.logger.error('Reload wireguard error', err);
    }
  }

  private exec(
    command: string,
    parameters: string[] = [],
    options: SSHExecOptions & {
      stream?: 'stdout' | 'stderr';
    } = { cwd: this.WG_CWD },
  ): Promise<string> {
    return this.connect.exec(command, parameters, options);
  }
}
