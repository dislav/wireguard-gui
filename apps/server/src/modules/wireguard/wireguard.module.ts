import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ServersModule } from '../servers';
import { WireguardService } from './wireguard.service';
import { WireguardController } from './wireguard.controller';

@Module({
  imports: [ScheduleModule.forRoot(), ServersModule],
  providers: [WireguardService],
  controllers: [WireguardController],
})
export class WireguardModule {}
