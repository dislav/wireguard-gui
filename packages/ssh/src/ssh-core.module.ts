import {
  Global,
  Module,
  DynamicModule,
  Logger,
  Provider,
} from '@nestjs/common';
import { NodeSSH } from 'node-ssh';

import { SshOptions, SshOptionsAsync, SshOptionsFactory } from './interfaces';
import { SSH_OPTIONS, SSH_CONNECT_NAME } from './constants';
import { getConnectName } from './utils';

@Global()
@Module({})
export class SshCoreModule {
  private static logger = new Logger(SshCoreModule.name, { timestamp: true });

  public static forRoot(options: SshOptions): DynamicModule {
    const connectName = getConnectName(options.name);

    const sshConfigProvider: Provider = {
      provide: SSH_OPTIONS,
      useValue: options,
    };

    const sshConnectNameProvider: Provider = {
      provide: SSH_CONNECT_NAME,
      useValue: connectName,
    };

    const sshConnectProvider: Provider = {
      provide: connectName,
      useFactory: () => this.createSshConnectFactory(options),
    };

    return {
      module: SshCoreModule,
      providers: [
        sshConfigProvider,
        sshConnectNameProvider,
        sshConnectProvider,
      ],
      exports: [sshConnectProvider],
    };
  }

  public static forRootAsync(options: SshOptionsAsync): DynamicModule {
    const connectName = getConnectName(options.name);

    const asyncProviders = this.createAsyncProviders(options);

    const sshConnectProvider: Provider = {
      provide: connectName,
      useFactory: (options) => this.createSshConnectFactory(options),
      inject: [SSH_OPTIONS],
    };

    return {
      module: SshCoreModule,
      providers: [...asyncProviders, sshConnectProvider],
      exports: [sshConnectProvider],
    };
  }

  private static createAsyncProviders(options: SshOptionsAsync): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      { provide: options.useClass, useClass: options.useClass },
    ];
  }

  private static createAsyncOptionsProvider(
    options: SshOptionsAsync,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: SSH_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: SSH_OPTIONS,
      useFactory: async (options: SshOptionsFactory) =>
        await options.createSshOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }

  private static async createSshConnectFactory(
    options: SshOptions,
  ): Promise<NodeSSH> {
    const ssh = new NodeSSH();
    const connect = await ssh.connect(options);

    this.logger.log('Ssh connect successfully initialized');

    return connect;
  }
}
