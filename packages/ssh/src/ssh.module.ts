import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SshCoreModule } from './ssh-core.module';
import { SshOptions, SshOptionsAsync } from './interfaces';

@Module({})
export class SshModule {
  public static register(name: string): DynamicModule {
    return {
      module: SshModule,
      imports: [
        SshCoreModule.forRootAsync({
          name,
          useFactory: (configService: ConfigService) => ({
            host: configService.get(`SSH_HOST_${name}`),
            port: configService.get(`SSH_PORT_${name}`, 22),
            username: configService.get(`SSH_USERNAME_${name}`),
            password: configService.get(`SSH_PASSWORD_${name}`),
          }),
          inject: [ConfigService],
        }),
      ],
      exports: [SshCoreModule],
    };
  }

  public static forRoot(options: SshOptions): DynamicModule {
    return {
      module: SshModule,
      imports: [SshCoreModule.forRoot(options)],
      exports: [SshCoreModule],
    };
  }

  public static forRootAsync(options: SshOptionsAsync): DynamicModule {
    return {
      module: SshModule,
      imports: [SshCoreModule.forRootAsync(options)],
      exports: [SshCoreModule],
    };
  }
}
