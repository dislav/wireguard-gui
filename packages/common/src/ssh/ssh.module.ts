import { DynamicModule, Module } from '@nestjs/common';

import { SshCoreModule } from './ssh-core.module';
import { SshOptions, SshOptionsAsync } from './interfaces';

@Module({})
export class SshModule {
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
