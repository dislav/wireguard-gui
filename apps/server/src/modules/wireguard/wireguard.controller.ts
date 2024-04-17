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
import { ServerName } from '../../common/decorators/server-name.decorator';

@ApiTags('wireguard')
@Controller('wireguard')
export class WireguardController {
  constructor(private readonly wireguardService: WireguardService) {}

  @Get('/config')
  @ApiOkResponse({ type: Config })
  config(@ServerName() serverName: string): Promise<Config> {
    return this.wireguardService.getConfig(serverName);
  }

  @Get('/clients')
  @ApiOkResponse({ type: [Client] })
  clients(@ServerName() serverName: string): Promise<Client[]> {
    return this.wireguardService.getClients(serverName);
  }

  @Get('/clients/:id')
  @ApiOkResponse({ type: Client })
  client(
    @Param('id') id: string,
    @ServerName() serverName: string,
  ): Promise<Client> {
    return this.wireguardService.getClient(id, serverName);
  }

  @Get('/clients/:id/config')
  async clientConfig(
    @Param('id') id: string,
    @Res({ passthrough: true }) response: Response,
    @ServerName() serverName: string,
  ): Promise<StreamableFile> {
    const client = await this.wireguardService.getClient(id, serverName);
    const clientConfig = await this.wireguardService.getClientConfig(
      id,
      serverName,
    );

    response.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="${client.name}.conf"`,
    });

    const stream = Readable.from(clientConfig, { encoding: 'utf-8' });

    return new StreamableFile(stream);
  }

  @Get('/clients/:id/qrcode')
  @Header('Content-Type', 'image/svg+xml')
  clientQRCode(
    @Param('id') id: string,
    @ServerName() serverName: string,
  ): Promise<string> {
    return this.wireguardService.getClientQRCode(id, serverName);
  }

  @Post('/clients')
  @ApiOkResponse({ type: Client })
  createClients(
    @Body() createClientDto: CreateClientDto,
    @ServerName() serverName: string,
  ): Promise<Client> {
    return this.wireguardService.createClient(createClientDto, serverName);
  }

  @Put('/clients/:id')
  @ApiOkResponse({ type: Client })
  updateClient(
    @Body() updateClientDto: UpdateClientDto,
    @ServerName() serverName: string,
  ): Promise<Client> {
    return this.wireguardService.updateClient(
      updateClientDto.id,
      updateClientDto,
      serverName,
    );
  }

  @Put('/clients/:id/enable')
  @ApiOkResponse({ type: Client })
  enableClient(
    @Param('id') id: string,
    @ServerName() serverName: string,
  ): Promise<Client> {
    return this.wireguardService.enableClient(id, serverName);
  }

  @Put('/clients/:id/disable')
  @ApiOkResponse({ type: Client })
  disableClient(
    @Param('id') id: string,
    @ServerName() serverName: string,
  ): Promise<Client> {
    return this.wireguardService.disableClient(id, serverName);
  }

  @Put('clients/:id/extend/:rateId')
  @ApiOkResponse({ type: Client })
  extendClient(
    @Param('id') id: string,
    @Param('rateId') rateId: string,
    @ServerName() serverName: string,
  ): Promise<Client> {
    return this.wireguardService.extendClient(id, rateId, serverName);
  }

  @Delete('/clients/:id')
  @ApiOkResponse({ type: Client })
  removeClient(
    @Param('id') id: string,
    @ServerName() serverName: string,
  ): Promise<Client> {
    return this.wireguardService.removeClient(id, serverName);
  }
}
