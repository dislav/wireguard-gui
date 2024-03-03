import { ApiProperty } from '@nestjs/swagger';

export class Client {
  @ApiProperty()
  id: string;

  @ApiProperty()
  telegramId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  privateKey: string;

  @ApiProperty()
  publicKey: string;

  @ApiProperty()
  preSharedKey: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  enabled: boolean;

  @ApiProperty({ required: false })
  latestHandshakeAt?: Date;

  @ApiProperty({ required: false })
  transferRx?: number;

  @ApiProperty({ required: false })
  transferTx?: number;

  @ApiProperty({ required: false })
  persistentKeepalive?: string;

  @ApiProperty({ required: false })
  expiryDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
