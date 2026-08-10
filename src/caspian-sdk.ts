export interface CaspianConfig {
  apiKey: string;
}

export interface CaspianMessage {
  id?: string;
  channel: 'discord' | 'whatsapp' | 'email' | 'telegram' | string;
  from?: string;
  to?: string;
  content?: string;
  subject?: string;
  body?: string;
  metadata?: Record<string, unknown>;
}

export interface CaspianSendOptions {
  channel: 'discord' | 'whatsapp' | 'email' | 'telegram' | string;
  to: string;
  body: string;
  subject?: string;
  metadata?: Record<string, unknown>;
}

export type CaspianMessageHandler = (msg: CaspianMessage) => Promise<void> | void;

export class Caspian {
  private messageHandler?: CaspianMessageHandler;
  private apiKey: string;

  constructor(config: CaspianConfig) {
    this.apiKey = config.apiKey;
  }

  onMessage(handler: CaspianMessageHandler): void {
    this.messageHandler = handler;
  }

  async send(options: CaspianSendOptions): Promise<{ success: boolean; id?: string }> {
    const channelUpper = options.channel.toUpperCase();
    console.log(`\n📡 [Caspian Outbound -> ${channelUpper}] To: ${options.to} ${options.subject ? '| Subject: ' + options.subject : ''}`);
    console.log(`   Body: ${options.body.replace(/\n/g, '\n   ')}`);
    return { success: true, id: `msg_${Date.now()}` };
  }

  async simulateIncoming(msg: CaspianMessage): Promise<void> {
    if (this.messageHandler) {
      await this.messageHandler(msg);
    }
  }
}
