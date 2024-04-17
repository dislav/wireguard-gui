import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as qrcode from 'qrcode';
import * as dayjs from 'dayjs';

import { ServersService } from '../servers';
import { Config } from './entities/config.entity';
import { Server } from './entities/server.entity';
import { Client } from './entities/client.entity';
import { Dump } from './entities/dump.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class WireguardService {
  private readonly logger = new Logger(WireguardService.name);
  private readonly databasePath = path.resolve(process.cwd(), '../../_db');

  constructor(private readonly serversService: ServersService) {}

  private get configPath(): string {
    const configName = `config-${this.serversService.serverName.toLowerCase()}.json`;

    return path.join(this.databasePath, configName);
  }

  private get ratesPath(): string {
    const rateName = `rates-${this.serversService.serverName.toLowerCase()}.json`;

    return path.join(this.databasePath, rateName);
  }

  async getConfig(serverName: string): Promise<Config> {
    this.serversService.serverName = serverName;

    try {
      const wgConfig = await fs.readFile(this.configPath, 'utf-8');

      return JSON.parse(wgConfig);
    } catch {
      return this.createConfig();
    }
  }

  async getClients(serverName: string): Promise<Client[]> {
    const configPromise = this.getConfig(serverName);
    const dumpPromise = this.getDump();

    const [config, dumps] = await Promise.all([configPromise, dumpPromise]);

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

  async getClient(id: string, serverName: string): Promise<Client> {
    const config = await this.getConfig(serverName);
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async getDump(): Promise<Dump[]> {
    const dump = await this.serversService.exec('wg show wg0 dump');

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

  async getClientConfig(id: string, serverName: string): Promise<string> {
    const config = await this.getConfig(serverName);
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return `[Interface]
PrivateKey = ${client.privateKey}
Address = ${client.address}/24
${this.serversService.wireguardConfig.dns ? `DNS = ${this.serversService.wireguardConfig.dns}\n` : ''}\
${this.serversService.wireguardConfig.mtu ? `MTU = ${this.serversService.wireguardConfig.mtu}\n` : ''}\

[Peer]
PublicKey = ${config.server.publicKey}
PresharedKey = ${client.preSharedKey}
AllowedIPs = ${this.serversService.wireguardConfig.allowedIps}
PersistentKeepalive = ${this.serversService.wireguardConfig.persistentKeepalive}
Endpoint = ${this.serversService.wireguardConfig.host}:${this.serversService.wireguardConfig.port}`;
  }

  async getClientQRCode(id: string, serverName: string): Promise<string> {
    const clientConfig = await this.getClientConfig(id, serverName);

    return qrcode.toString(clientConfig, { type: 'svg', width: 512 });
  }

  async createClient(
    createClientDto: CreateClientDto,
    serverName: string,
  ): Promise<Client> {
    const config = await this.getConfig(serverName);
    const clientsLength = Object.keys(config.clients ?? {}).length + 1;

    const privateKey = await this.serversService.wgPrivateKey();
    const publicKey = await this.serversService.wgPublicKey(privateKey);
    const preSharedKey = await this.serversService.wgPreSharedKey();

    let address: string;
    if (clientsLength < 255) {
      address = this.serversService.wireguardConfig.address.replace(
        'x',
        `${clientsLength + 1}`,
      );
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
    serverName: string,
  ): Promise<Client> {
    const config = await this.getConfig(serverName);
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.name = updateClientDto.name ?? client.name;
    client.telegramId = updateClientDto.telegramId ?? client.telegramId;
    client.expiryDate = updateClientDto.expiryDate
      ? new Date(updateClientDto.expiryDate)
      : client.expiryDate;

    client.updatedAt = new Date();

    await this.saveConfig(config);

    return client;
  }

  async enableClient(id: string, serverName: string): Promise<Client> {
    const config = await this.getConfig(serverName);
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.enabled = true;
    client.updatedAt = new Date();

    await this.saveConfig(config);

    return client;
  }

  async disableClient(id: string, serverName: string): Promise<Client> {
    const config = await this.getConfig(serverName);
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    client.enabled = false;
    client.updatedAt = new Date();

    await this.saveConfig(config);

    return client;
  }

  async extendClient(
    id: string,
    rateId: string,
    serverName: string,
  ): Promise<Client> {
    const config = await this.getConfig(serverName);
    const client = config.clients[id];

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    try {
      const rates = JSON.parse(await fs.readFile(this.ratesPath, 'utf-8'));
      const rateById = rates.find((rate) => rate.id === +rateId);

      if (!rateById) {
        throw new NotFoundException('Rate not found');
      }

      client.expiryDate = dayjs(client.expiryDate ?? new Date())
        .add(rateById.months, 'month')
        .endOf('day')
        .subtract(1, 'minute')
        .toDate();

      client.updatedAt = new Date();

      await this.saveConfig(config);

      return client;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async removeClient(id: string, serverName: string): Promise<Client> {
    const config = await this.getConfig(serverName);
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
      const wgConfig = await this.serversService.exec('cat wg0.conf');
      const wgConfigPeers = wgConfig.split('[Peer]');

      const serverConfig = wgConfigPeers?.[0];

      if (!serverConfig?.includes('[Interface]')) {
        throw new Error('Wireguard server configuration does not exist');
      }

      const server = new Server();
      const privateKey = serverConfig.match(/PrivateKey\s=\s(.*)/)[1];
      const publicKey = await this.serversService.wgPublicKey(privateKey);
      const address = serverConfig.match(/Address\s=\s(.*)/)[1];

      server.privateKey = privateKey;
      server.publicKey = publicKey;
      server.address = address.split('/')[0];

      config.server = server;

      const clientsConfig = wgConfigPeers.slice(1);

      if (clientsConfig.length) {
        clientsConfig.forEach((clientConfig, index) => {
          const publicKey = clientConfig.match(/PublicKey\s=\s(.*)/)[1];
          const preSharedKey = clientConfig.match(/PresharedKey\s=\s(.*)/)[1];
          const allowedIps = clientConfig.match(/AllowedIPs\s=\s(.*)/)[1];

          if (publicKey && preSharedKey && allowedIps) {
            const id = uuidv4();
            const isEnabled = !clientConfig.includes('disabled');
            const name =
              clientConfig.match(/(?<=### end ).*(?= ###)/)[0] ||
              `client${index + 1}`;

            const client = new Client();
            client.id = id;
            client.telegramId = null;
            client.name = name;
            client.privateKey = privateKey;
            client.publicKey = publicKey;
            client.preSharedKey = preSharedKey;
            client.address = allowedIps.split('/')[0];
            client.enabled = isEnabled;
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
      const privateKey = await this.serversService.wgPrivateKey();
      const publicKey = await this.serversService.wgPublicKey(privateKey);
      const address = this.serversService.wireguardConfig.address.replace(
        'x',
        '1',
      );

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
MTU = ${this.serversService.wireguardConfig.mtu}
ListenPort = ${this.serversService.wireguardConfig.port}`;

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

    const saveLocalWgConfigPromise = fs.writeFile(
      this.configPath,
      JSON.stringify(config, null, 2),
      'utf-8',
    );

    const saveServerWgConfigPromise = this.serversService.saveWgConfig(result);

    await Promise.all([saveLocalWgConfigPromise, saveServerWgConfigPromise]);

    this.logger.log('Config saved successfully');

    await this.reload();
  }

  private async reload(): Promise<void> {
    await this.serversService.exec('wg-quick down wg0').catch(() => {});
    await this.serversService.exec('wg-quick up wg0').catch(() => {});

    this.logger.log('Reload wireguard successfully');
  }

  // @Cron(CronExpression.EVERY_HOUR)
  // async checkExpiryDate() {
  //   const config = await this.getConfig();
  //
  //   let needSave = false;
  //
  //   Object.values(config?.clients ?? {}).forEach((client) => {
  //     if (client.enabled && client.expiryDate) {
  //       const diffMinutes = -dayjs().diff(client.expiryDate, 'minute');
  //       const diffHours = Math.round(diffMinutes / 60);
  //
  //       if ([1, 12, 24, 36].includes(diffHours)) {
  //         console.log('bot notification');
  //       }
  //
  //       if (diffMinutes < 0) {
  //         client.enabled = false;
  //         client.updatedAt = new Date();
  //
  //         needSave = true;
  //       }
  //     }
  //   });
  //
  //   if (needSave) {
  //     await this.saveConfig(config);
  //   }
  // }
}
