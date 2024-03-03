import { Body, Controller, Get, Post, Req, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SessionData } from 'express-session';
import { Request } from 'express';

import { AppService } from './app.service';
import { LoginDto } from './common/dto/login.dto';
import { User } from './common/interfaces/user.interface';
import { IsPublic } from './common/decorators/public.decorator';

@ApiTags('session')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/session')
  user(@Session() session: SessionData): Omit<User, 'password'> {
    const { password, ...user } = session.user;

    return user;
  }

  @IsPublic()
  @Post('/session')
  login(@Req() request: Request, @Body() loginDto: LoginDto): void {
    this.appService.login(request, loginDto);
  }
}
