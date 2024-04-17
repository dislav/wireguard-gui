import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthGuard } from './common/guards/auth.guard';
import { ServersModule, WireguardModule } from './modules';

@Module({
  imports: [
    // Common
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DASHBOARD_USERNAME: Joi.string().required(),
        DASHBOARD_PASSWORD: Joi.string().required(),
      }),
      envFilePath: './.env',
    }),

    // Modules
    ServersModule,
    WireguardModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }, AppService],
})
export class AppModule {}
