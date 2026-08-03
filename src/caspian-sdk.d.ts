declare module 'caspian-sdk' {
  export interface CaspianConfig {
    apiKey: string;
  }

  export interface CaspianMessage {
    id?: string;
    channel: 'discord' | 'whatsapp' | 'email' | string;
    from?: string;
    to?: string;
    content?: string;
    subject?: string;
    body?: string;
    metadata?: Record<string, unknown>;
  }

  export interface CaspianSendOptions {
    channel: 'discord' | 'whatsapp' | 'email' | string;
    to: string;
    body: string;
    subject?: string;
    metadata?: Record<string, unknown>;
  }

  export class Caspian {
    constructor(config: CaspianConfig);
    onMessage(handler: (msg: CaspianMessage) => Promise<void> | void): void;
    send(options: CaspianSendOptions): Promise<{ success: boolean; id?: string }>;
  }
}
