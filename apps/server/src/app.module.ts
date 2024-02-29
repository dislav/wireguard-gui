import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SshModule } from '@wireguard-vpn/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    SshModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get('SSH_HOST'),
        port: configService.get('SSH_PORT', 22),
        username: configService.get('SSH_USERNAME'),
        password: configService.get('SSH_PASSWORD'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
