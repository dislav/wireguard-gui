import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './common/dto/login.dto';
import { ServersService } from './modules';

@Injectable()
export class AppService {
  private readonly username =
    this.configService.get<string>('DASHBOARD_USERNAME');

  private readonly password =
    this.configService.get<string>('DASHBOARD_PASSWORD');

  constructor(
    private readonly configService: ConfigService,
    private readonly serversService: ServersService,
  ) {}

  async login(request: Request, loginDto: LoginDto): Promise<boolean> {
    if (loginDto.username !== this.username) {
      throw new UnauthorizedException();
    }

    const isMatch = bcrypt.compareSync(
      loginDto.password,
      bcrypt.hashSync(this.password, 10),
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    request.session.user = {
      username: loginDto.username,
      password: loginDto.password,
      server: this.serversService.serverName,
    };

    request.session.save();

    return true;
  }

  async changeServer(request: Request, name: string): Promise<boolean> {
    const serverName = name.toUpperCase();

    if (!this.serversService.servers.includes(serverName)) {
      throw new BadRequestException();
    }

    request.session.user.server = serverName;
    request.session.save();

    return true;
  }
}
