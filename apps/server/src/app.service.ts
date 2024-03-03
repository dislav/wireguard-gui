import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './common/dto/login.dto';

@Injectable()
export class AppService {
  private readonly WG_USERNAME = this.configService.get<string>('WG_USERNAME');
  private readonly WG_PASSWORD = this.configService.get<string>('WG_PASSWORD');

  constructor(private readonly configService: ConfigService) {}

  login(request: Request, loginDto: LoginDto): void {
    if (loginDto.username !== this.WG_USERNAME) {
      throw new UnauthorizedException();
    }

    const isMatch = bcrypt.compareSync(
      loginDto.password,
      bcrypt.hashSync(this.WG_PASSWORD, 10),
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    request.session.user = loginDto;
    request.session.save();
  }
}
