import { ApiProperty } from '@nestjs/swagger';

export class Dump {
  @ApiProperty()
  publicKey: string;

  @ApiProperty()
  preSharedKey: string;

  @ApiProperty()
  endpoint: string;

  @ApiProperty()
  allowedIps: string;

  @ApiProperty()
  latestHandshakeAt: Date;

  @ApiProperty()
  transferRx: number;

  @ApiProperty()
  transferTx: number;

  @ApiProperty()
  persistentKeepalive: string;
}
