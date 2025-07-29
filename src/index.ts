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
    version: "0.10.3"
  });

  // Register workflow management tools using modern MCP SDK 1.17.0 API
  server.tool(
    "list_workflows",
    "List all workflows from your n8n instance. Returns a comprehensive list of all workflows with their IDs, names, status (active/inactive), creation dates, and basic metadata. Perfect for getting an overview of your automation landscape.",
    {},
    async () => {
      try {
        const response = await n8nApi.get('/workflows');
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
    "Create a new workflow in n8n with custom nodes, connections, and settings. Build complex automation workflows programmatically by defining nodes (triggers, actions, conditions) and their relationships. Supports all n8n node types and advanced workflow configurations.",
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
        const response = await n8nApi.post('/workflows', workflow);
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
    "Retrieve detailed information about a specific workflow by its ID. Returns complete workflow configuration including all nodes, connections, settings, triggers, and metadata. Essential for inspecting workflow structure before making modifications.",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.get(`/workflows/${id}`);
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
    "Trigger immediate execution of a workflow by its ID. Starts the workflow manually regardless of its normal triggers (webhooks, schedules, etc.). Returns execution details including status, start time, and any immediate results or errors.",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.post(`/workflows/${id}/execute`);
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
    "Modify an existing workflow by updating its configuration, nodes, connections, or settings. Supports partial updates - you can change specific aspects without affecting the entire workflow. Perfect for iterative workflow development and maintenance.",
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
        const response = await n8nApi.put(`/workflows/${id}`, workflow);
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
    "Enable a workflow to start processing triggers and executing automatically. Once activated, the workflow will respond to its configured triggers (webhooks, schedules, file changes, etc.) and run according to its automation logic.",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.patch(`/workflows/${id}/activate`);
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
    "Disable a workflow to stop it from processing triggers and executing automatically. The workflow will remain in your n8n instance but won't respond to triggers until reactivated. Useful for maintenance, debugging, or temporary suspension.",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.patch(`/workflows/${id}/deactivate`);
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
    "Permanently remove a workflow from your n8n instance. This action cannot be undone - the workflow, its configuration, nodes, and execution history will be completely deleted. Use with caution for cleanup and workflow lifecycle management.",
    {
      id: z.string().describe("Workflow ID")
    },
    async ({ id }) => {
      try {
        const response = await n8nApi.delete(`/workflows/${id}`);
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
