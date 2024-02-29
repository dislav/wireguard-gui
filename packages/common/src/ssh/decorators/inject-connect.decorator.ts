import { Inject } from '@nestjs/common';
import { SSH_CONNECT } from '../constants';

export function InjectConnect(): ParameterDecorator {
  return Inject(SSH_CONNECT);
}
