import { ModuleMetadata, Type } from '@nestjs/common';
import { Config } from 'node-ssh';

type MaybePromise<T> = Promise<T> | T;

export interface SshOptions extends Config {}

export interface SshOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<SshOptionsFactory>;
  useClass?: Type<SshOptionsFactory>;
  useFactory?: (...args: any[]) => MaybePromise<SshOptions>;
  inject?: any[];
}

export interface SshOptionsFactory {
  createSshOptions(): MaybePromise<SshOptions>;
}
