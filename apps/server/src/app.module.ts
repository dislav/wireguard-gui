import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { SshModule } from '@wireguard-vpn/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthGuard } from './common/guards/auth.guard';
import { WireguardModule } from './modules';

@Module({
  imports: [
    // Common
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SSH_HOST: Joi.string().required(),
        SSH_PORT: Joi.string().required(),
        SSH_USERNAME: Joi.string().required(),
        SSH_PASSWORD: Joi.string().required(),
        WG_USERNAME: Joi.string().required(),
        WG_PASSWORD: Joi.string().required(),
      }),
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

    // Modules
    WireguardModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AppService],
})
export class AppModule {}
