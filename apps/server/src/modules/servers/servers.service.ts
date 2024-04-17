import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeSSH, SSHExecOptions } from 'node-ssh';

import { InjectConnect } from '@wireguard-vpn/ssh';

@Injectable()
export class ServersService {
  public serverName = 'DE';
  public readonly servers = ['NL', 'DE'];

  constructor(
    private readonly configService: ConfigService,
    @InjectConnect('NL') private readonly connectNL: NodeSSH,
    @InjectConnect('DE') private readonly connectDE: NodeSSH,
  ) {}

  public get connect() {
    if (!this.serverName) {
      throw new BadRequestException('Current server name is not defined');
    }

    if (this.serverName === 'NL') {
      return this.connectNL;
    } else if (this.serverName === 'DE') {
      return this.connectDE;
    }

    throw new BadRequestException('Unknown current server name');
  }

  public get wireguardConfig() {
    return {
      cwd: this.configService.get(
        `WG_CWD_${this.serverName}`,
        '/etc/wireguard',
      ),
      host: this.configService.get(`WG_HOST_${this.serverName}`),
      port: this.configService.get(`WG_PORT_${this.serverName}`, 51820),
      dns: this.configService.get(`WG_DNS_${this.serverName}`),
      mtu: this.configService.get(`WG_MTU_${this.serverName}`),
      address: this.configService.get(`WG_ADDRESS_${this.serverName}`),
      allowedIps: this.configService.get(`WG_ALLOWED_IPS_${this.serverName}`),
      persistentKeepalive: this.configService.get(
        `WG_PERSISTENT_KEEPALIVE_${this.serverName}`,
      ),
    };
  }

  public async exec(
    command: string,
    parameters: string[] = [],
    options: SSHExecOptions & {
      stream?: 'stdout' | 'stderr';
    } = { cwd: this.wireguardConfig.cwd },
  ): Promise<string> {
    return this.connect.exec(command, parameters, options);
  }

  public async wgPrivateKey(): Promise<string> {
    return this.exec('wg genkey');
  }

  public async wgPublicKey(privateKey: string): Promise<string> {
    return this.exec(`echo ${privateKey} | wg pubkey`);
  }

  public async wgPreSharedKey(): Promise<string> {
    return this.exec('wg genpsk');
  }

  public async saveWgConfig(config: string): Promise<void> {
    await this.exec(`echo '${config}' > wg0.conf`);
  }
}
