import { ModuleMetadata, Type } from '@nestjs/common';
import { Config } from 'node-ssh';

type MaybePromise<T> = Promise<T> | T;

export interface SshOptions extends Config {
  name?: string;
}

export interface SshOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<SshOptionsFactory>;
  useClass?: Type<SshOptionsFactory>;
  useFactory?: (...args: any[]) => MaybePromise<SshOptions>;
  inject?: any[];
}

export interface SshOptionsFactory {
  createSshOptions(): MaybePromise<SshOptions>;
}
