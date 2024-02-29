import { Injectable } from '@nestjs/common';
import { NodeSSH } from 'node-ssh';

import { InjectConnect } from '@wireguard-vpn/common';

@Injectable()
export class AppService {
  constructor(@InjectConnect() private readonly connect: NodeSSH) {}

  async getHello(): Promise<string> {
    const result = await this.connect.exec('cat wg0.conf', [], { cwd: '/etc/wireguard' });
    console.log(result);

    return 'Hello World!';
  }
}
