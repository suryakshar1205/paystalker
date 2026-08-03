declare module 'http' {
  export interface IncomingMessage {
    url?: string;
    method?: string;
    on(event: string, listener: (chunk: any) => void): this;
  }
  export interface ServerResponse {
    setHeader(name: string, value: string): void;
    writeHead(statusCode: number, headers?: Record<string, string>): void;
    end(data?: string): void;
  }
  export interface Server {
    listen(port: number | string, callback?: () => void): void;
  }
  export function createServer(requestListener: (req: IncomingMessage, res: ServerResponse) => void): Server;
}

declare module 'fs' {
  export function readFile(path: string, encoding: string, callback: (err: any, data: string) => void): void;
}

declare module 'path' {
  export function join(...paths: string[]): string;
}

declare module 'dotenv' {
  export function config(options?: any): any;
}

declare module 'dotenv/config' {}
