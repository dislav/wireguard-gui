import { Client } from '../model/types';

export type ClientsBody = Client[];

export type ClientBody = Client;

export interface CreateClientDto {
    name: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
    id: string;
}
