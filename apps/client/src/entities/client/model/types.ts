export interface Server {
    privateKey: string;
    publicKey: string;
    address: string;
}

export interface Client {
    id: string;
    telegramId?: number;
    name: string;
    privateKey: string;
    publicKey: string;
    preSharedKey: string;
    address: string;
    enabled: boolean;
    latestHandshakeAt?: string;
    transferRx?: number;
    transferTx?: number;
    persistentKeepalive?: string;
    expiryDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Config {
    server: Server;
    clients: Record<string, Client>;
}

export interface ClientState {
    clients: Client[];
}
