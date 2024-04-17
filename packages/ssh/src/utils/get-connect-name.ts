import { SSH_CONNECT } from '../constants';

export function getConnectName(name?: string) {
  if (!name) {
    return SSH_CONNECT;
  }

  return `${SSH_CONNECT}_${name}`;
}
