import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

// Configuration schema for Smithery
export const configSchema = z.object({
  n8nHost: z.string().describe("n8n instance URL (e.g., http://localhost:5678)").default("http://localhost:5678"),
  n8nApiKey: z.string().describe("n8n API key for authentication")
});

export default function ({ config }: { config: z.infer<typeof configSchema> }) {
  // Create axios instance for n8n API
  const n8nApi = axios.create({
    baseURL: config.n8nHost,
    headers: {
      'X-N8N-API-KEY': config.n8nApiKey,
      'Content-Type': 'application/json'
    }
  });

  // Create MCP server with modern SDK 1.17.0 API
  const server = new McpServer({
    name: "n8n-workflow-builder",
    version: "0.10.1"
  });

  // Register workflow management tools using modern MCP SDK 1.17.0 API
  server.tool(
    "list_workflows",
    "List all workflows from n8n instance",
    {},
    async () => {
      try {
        const response = await n8nApi.get('/api/v1/workflows');
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "create_workflow",
    "Create a new workflow in n8n",
    {
      workflow: z.object({
        name: z.string().describe("Name of the workflow"),
        nodes: z.array(z.any()).describe("Array of workflow nodes"),
        connections: z.record(z.string(), z.any()).describe("Node connections").optional(),
        settings: z.record(z.string(), z.any()).describe("Workflow settings").optional(),
        tags: z.array(z.string()).describe("Workflow tags").optional()
      }).describe("Workflow configuration")
    },
    async ({ workflow }) => {
      try {
        const response = await n8nApi.post('/api/v1/workflows', workflow);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "get_workflow",
    "Get a workflow by ID",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.get(`/api/v1/workflows/${id}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "execute_workflow",
    "Execute a workflow by ID",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.post(`/api/v1/workflows/${id}/execute`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "update_workflow",
    "Update an existing workflow by ID",
    {
      id: z.string().describe("Workflow ID"),
      workflow: z.object({
        name: z.string().describe("Name of the workflow").optional(),
        nodes: z.array(z.any()).describe("Array of workflow nodes").optional(),
        connections: z.record(z.string(), z.any()).describe("Node connections").optional(),
        settings: z.record(z.string(), z.any()).describe("Workflow settings").optional(),
        tags: z.array(z.string()).describe("Workflow tags").optional()
      }).describe("Updated workflow configuration")
    },
    async ({ id, workflow }) => {
      try {
        const response = await n8nApi.put(`/api/v1/workflows/${id}`, workflow);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "activate_workflow",
    "Activate a workflow by ID",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.patch(`/api/v1/workflows/${id}/activate`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "deactivate_workflow",
    "Deactivate a workflow by ID",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.patch(`/api/v1/workflows/${id}/deactivate`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  server.tool(
    "delete_workflow",
    "Delete a workflow by ID",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.delete(`/api/v1/workflows/${id}`);
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{
            type: "text",
            text: `Error: ${error instanceof Error ? error.message : String(error)}`
          }],
          isError: true
        };
      }
    }
  );

  return server.server;
}
