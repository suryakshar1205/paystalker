// Ambient global declarations for Node.js process and external modules

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      CASPIAN_API_KEY?: string;
      GEMINI_API_KEY?: string;
      FREELANCER_DISCORD_CHANNEL?: string;
      FREELANCER_TELEGRAM_CHAT?: string;
      CLIENT_EMAIL?: string;
      CLIENT_WHATSAPP?: string;
    }
    interface Process {
      env: ProcessEnv;
      argv: string[];
    }
  }

  var process: NodeJS.Process;
}

declare module '@google/generative-ai' {
  export class GoogleGenerativeAI {
    constructor(apiKey: string);
    getGenerativeModel(options: { model: string }): {
      generateContent(prompt: string): Promise<{
        response: {
          text(): string;
        };
      }>;
    };
  }
}

export {};
