import { Inject } from '@nestjs/common';
import { getConnectName } from '../utils';

export function InjectConnect(name?: string) {
  return Inject(getConnectName(name));
}
