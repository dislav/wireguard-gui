import session from 'express-session';
import { User } from './src/common/interfaces/user.interface';

declare module 'express-session' {
  export interface SessionData {
    user: User;
  }
}
