import { Module } from '@nestjs/common';
import { WireguardService } from './wireguard.service';
import { WireguardController } from './wireguard.controller';

@Module({
  providers: [WireguardService],
  controllers: [WireguardController],
})
export class WireguardModule {}
