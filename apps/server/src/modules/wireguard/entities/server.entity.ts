import { ApiProperty } from '@nestjs/swagger';

export class Server {
  @ApiProperty()
  privateKey: string;

  @ApiProperty()
  publicKey: string;

  @ApiProperty()
  address: string;
}
