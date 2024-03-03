import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

import { Server } from './server.entity';
import { Client } from './client.entity';

export class Config {
  @ApiProperty({ type: () => Server })
  server: Server;

  @ApiProperty({
    type: 'object',
    additionalProperties: { $ref: getSchemaPath(Client) },
  })
  clients: Record<string, Client>;
}
