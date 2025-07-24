declare module '@modelcontextprotocol/sdk' {
  export class Server {
    constructor(info: { name: string; version: string }, config: { capabilities: { tools: any; resources: any } });
    setRequestHandler(schema: any, handler: (request: any) => Promise<any>): void;
    connect(transport: any): Promise<void>;
    onerror: (error: any) => void;
  }
}

declare module '@modelcontextprotocol/sdk/client/index.js' {
  export class Client {
    constructor(info: { name: string; version: string }, config: { capabilities: any });
    connect(transport: any): Promise<void>;
    close(): Promise<void>;
    listTools(): Promise<{ tools: any[] }>;
    callTool(params: { name: string; arguments: any }): Promise<{
      content: Array<{ type: string; text: string }>;
      isError?: boolean;
    }>;
    listResources(): Promise<{ resources: any[] }>;
    readResource(params: { uri: string }): Promise<{
      contents: Array<{ type: string; text: string; mimeType: string; uri: string }>;
    }>;
    listResourceTemplates(): Promise<{ resourceTemplates: any[] }>;
  }
}

declare module '@modelcontextprotocol/sdk/client/stdio.js' {
  export class StdioClientTransport {
    constructor(params: { reader: any; writer: any });
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
