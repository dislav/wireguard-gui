import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Header,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { Readable } from 'stream';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { WireguardService } from './wireguard.service';
import { Config } from './entities/config.entity';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('wireguard')
@Controller('wireguard')
export class WireguardController {
  constructor(private readonly wireguardService: WireguardService) {}

  @Get('/config')
  @ApiOkResponse({ type: Config })
  config(): Promise<Config> {
    return this.wireguardService.getConfig();
  }

  @Get('/clients')
  @ApiOkResponse({ type: [Client] })
  clients(): Promise<Client[]> {
    return this.wireguardService.getClients();
  }

  @Get('/clients/:id')
  @ApiOkResponse({ type: Client })
  client(@Param('id') id: string): Promise<Client> {
    return this.wireguardService.getClient(id);
  }

  @Get('/clients/:id/config')
  async clientConfig(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const client = await this.wireguardService.getClient(id);
    const clientConfig = await this.wireguardService.getClientConfig(id);

    response.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${client.name}.conf"`,
    });

    const stream = Readable.from(clientConfig, { encoding: 'utf-8' });

    return new StreamableFile(stream);
  }

  @Get('/clients/:id/qrcode')
  @Header('Content-Type', 'image/svg+xml')
  clientQRCode(@Param('id') id: string): Promise<string> {
    return this.wireguardService.getClientQRCode(id);
  }

  @Post('/clients')
  @ApiOkResponse({ type: Client })
  createClients(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.wireguardService.createClient(createClientDto);
  }

  @Put('/clients/:id')
  @ApiOkResponse({ type: Client })
  updateClient(@Body() updateClientDto: UpdateClientDto): Promise<Client> {
    return this.wireguardService.updateClient(
      updateClientDto.id,
      updateClientDto,
    );
  }

  @Put('/clients/:id/enable')
  @ApiOkResponse({ type: Client })
  enableClient(@Param('id') id: string): Promise<Client> {
    return this.wireguardService.enableClient(id);
  }

  @Put('/clients/:id/disable')
  @ApiOkResponse({ type: Client })
  disableClient(@Param('id') id: string): Promise<Client> {
    return this.wireguardService.disableClient(id);
  }

  @Delete('/clients/:id')
  @ApiOkResponse({ type: Client })
  removeClient(@Param('id') id: string): Promise<Client> {
    return this.wireguardService.removeClient(id);
  }
}
