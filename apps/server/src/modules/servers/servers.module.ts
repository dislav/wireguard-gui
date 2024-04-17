import { Module } from '@nestjs/common';

import { SshModule } from '@wireguard-vpn/ssh';
import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';

@Module({
  imports: [SshModule.register('NL'), SshModule.register('DE')],
  controllers: [ServersController],
  providers: [ServersService],
  exports: [ServersService],
})
export class ServersModule {}
