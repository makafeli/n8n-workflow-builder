declare module '@modelcontextprotocol/sdk' {
  export class Server {
    constructor(info: { name: string; version: string }, config: { capabilities: { tools: any; resources: any } });
    setRequestHandler(schema: any, handler: (request: any) => Promise<any>): void;
    connect(transport: any): Promise<void>;
    onerror: (error: any) => void;
  }
}

declare module '@modelcontextprotocol/sdk/stdio' {
  export class StdioServerTransport {
    constructor();
  }
}

declare module '@modelcontextprotocol/sdk/types' {
  export const CallToolRequestSchema: any;
  export const ListToolsRequestSchema: any;
  export class McpError extends Error {
    constructor(code: string, message: string);
  }
  export const ErrorCode: {
    InvalidParams: string;
    MethodNotFound: string;
    InternalError: string;
  };
}

export {};
