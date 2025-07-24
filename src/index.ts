#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

// Configuration
const N8N_HOST = process.env.N8N_HOST || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

console.error("N8N API Configuration:");
console.error("Host:", N8N_HOST);
console.error("API Key:", N8N_API_KEY ? `${N8N_API_KEY.substring(0, 4)}****` : 'Not set');

// Create axios instance for n8n API
const n8nApi = axios.create({
  baseURL: N8N_HOST,
  headers: {
    'X-N8N-API-KEY': N8N_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Create MCP server with proper configuration
const server = new McpServer({
  name: "n8n-workflow-builder",
  version: "0.8.0"
});

// Register workflow management tools using modern MCP SDK patterns
server.registerTool(
  "list_workflows",
  {
    title: "List Workflows",
    description: "List all workflows from n8n",
    inputSchema: {}
  },
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

server.registerTool(
  "create_workflow",
  {
    title: "Create Workflow",
    description: "Create a new workflow in n8n",
    inputSchema: {
      workflow: z.object({
        name: z.string().describe("Name of the workflow"),
        nodes: z.array(z.any()).describe("Array of workflow nodes"),
        connections: z.record(z.any()).optional().describe("Node connections"),
        settings: z.record(z.any()).optional().describe("Workflow settings"),
        tags: z.array(z.any()).optional().describe("Workflow tags")
      }).describe("Workflow configuration")
    }
  },
  async ({ workflow }) => {
    try {
      // Ensure workflow has required settings
      const workflowWithDefaults = {
        ...workflow,
        settings: workflow.settings || {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          saveDataErrorExecution: "all",
          saveDataSuccessExecution: "all",
          executionTimeout: 3600
        }
      };

      const response = await n8nApi.post('/workflows', workflowWithDefaults);
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

server.registerTool(
  "get_workflow",
  {
    title: "Get Workflow",
    description: "Get a workflow by ID",
    inputSchema: {
      id: z.string().describe("Workflow ID")
    }
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

server.registerTool(
  "execute_workflow",
  {
    title: "Execute Workflow",
    description: "Execute a workflow by ID",
    inputSchema: {
      id: z.string().describe("Workflow ID")
    }
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

// Additional workflow management tools
server.registerTool(
  "update_workflow",
  {
    title: "Update Workflow",
    description: "Update an existing workflow by ID",
    inputSchema: {
      id: z.string().describe("Workflow ID"),
      workflow: z.object({
        name: z.string().optional().describe("Name of the workflow"),
        nodes: z.array(z.any()).optional().describe("Array of workflow nodes"),
        connections: z.record(z.any()).optional().describe("Node connections"),
        settings: z.record(z.any()).optional().describe("Workflow settings"),
        tags: z.array(z.any()).optional().describe("Workflow tags")
      }).describe("Updated workflow configuration")
    }
  },
  async ({ id, workflow }) => {
    try {
      // Ensure workflow has required settings if provided
      const workflowWithDefaults = workflow.settings ? {
        ...workflow,
        settings: {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          saveDataErrorExecution: "all",
          saveDataSuccessExecution: "all",
          executionTimeout: 3600,
          ...workflow.settings
        }
      } : workflow;

      const response = await n8nApi.put(`/workflows/${id}`, workflowWithDefaults);
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

server.registerTool(
  "activate_workflow",
  {
    title: "Activate Workflow",
    description: "Activate a workflow by ID",
    inputSchema: {
      id: z.string().describe("Workflow ID")
    }
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.post(`/workflows/${id}/activate`);
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

server.registerTool(
  "deactivate_workflow",
  {
    title: "Deactivate Workflow",
    description: "Deactivate a workflow by ID",
    inputSchema: {
      id: z.string().describe("Workflow ID")
    }
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.post(`/workflows/${id}/deactivate`);
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

server.registerTool(
  "delete_workflow",
  {
    title: "Delete Workflow",
    description: "Delete a workflow by ID",
    inputSchema: {
      id: z.string().describe("Workflow ID")
    }
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.delete(`/workflows/${id}`);
      return {
        content: [{
          type: "text",
          text: response.status === 200 ? "Workflow deleted successfully" : JSON.stringify(response.data, null, 2)
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

server.registerTool(
  "create_workflow_and_activate",
  {
    title: "Create and Activate Workflow",
    description: "Create a new workflow in n8n and immediately activate it",
    inputSchema: {
      workflow: z.object({
        name: z.string().describe("Name of the workflow"),
        nodes: z.array(z.any()).describe("Array of workflow nodes"),
        connections: z.record(z.any()).optional().describe("Node connections"),
        settings: z.record(z.any()).optional().describe("Workflow settings"),
        tags: z.array(z.any()).optional().describe("Workflow tags")
      }).describe("Workflow configuration")
    }
  },
  async ({ workflow }) => {
    try {
      // Ensure workflow has required settings
      const workflowWithDefaults = {
        ...workflow,
        settings: workflow.settings || {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          saveDataErrorExecution: "all",
          saveDataSuccessExecution: "all",
          executionTimeout: 3600
        }
      };

      // First create the workflow
      const createResponse = await n8nApi.post('/workflows', workflowWithDefaults);
      const createdWorkflow = createResponse.data;

      // Then activate it
      const activateResponse = await n8nApi.post(`/workflows/${createdWorkflow.id}/activate`);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            created: createdWorkflow,
            activated: activateResponse.data
          }, null, 2)
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

// Execution Management Tools
server.registerTool(
  "list_executions",
  {
    title: "List Executions",
    description: "List workflow executions with filtering and pagination support",
    inputSchema: {
      includeData: z.boolean().optional().describe("Include execution's detailed data"),
      status: z.enum(["error", "success", "waiting"]).optional().describe("Filter by execution status"),
      workflowId: z.string().optional().describe("Filter by specific workflow ID"),
      projectId: z.string().optional().describe("Filter by project ID"),
      limit: z.number().min(1).max(250).optional().describe("Number of executions to return (max: 250)"),
      cursor: z.string().optional().describe("Pagination cursor for next page")
    }
  },
  async ({ includeData, status, workflowId, projectId, limit, cursor }) => {
    try {
      const params = new URLSearchParams();

      if (includeData !== undefined) params.append('includeData', includeData.toString());
      if (status) params.append('status', status);
      if (workflowId) params.append('workflowId', workflowId);
      if (projectId) params.append('projectId', projectId);
      if (limit) params.append('limit', limit.toString());
      if (cursor) params.append('cursor', cursor);

      const response = await n8nApi.get(`/executions?${params.toString()}`);
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

server.registerTool(
  "get_execution",
  {
    title: "Get Execution",
    description: "Get detailed information about a specific workflow execution",
    inputSchema: {
      id: z.string().describe("Execution ID"),
      includeData: z.boolean().optional().describe("Include detailed execution data")
    }
  },
  async ({ id, includeData }) => {
    try {
      const params = new URLSearchParams();
      if (includeData !== undefined) params.append('includeData', includeData.toString());

      const url = `/executions/${id}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await n8nApi.get(url);
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

server.registerTool(
  "delete_execution",
  {
    title: "Delete Execution",
    description: "Delete a workflow execution record from the n8n instance",
    inputSchema: {
      id: z.string().describe("Execution ID to delete")
    }
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.delete(`/executions/${id}`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Execution ${id} deleted successfully`,
            deletedExecution: response.data
          }, null, 2)
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

// Tag Management Tools
server.registerTool(
  "list_tags",
  {
    title: "List Tags",
    description: "List all workflow tags with pagination support",
    inputSchema: {
      limit: z.number().min(1).max(250).optional().describe("Number of tags to return (max: 250)"),
      cursor: z.string().optional().describe("Pagination cursor for next page")
    }
  },
  async ({ limit, cursor }) => {
    try {
      const params = new URLSearchParams();

      if (limit) params.append('limit', limit.toString());
      if (cursor) params.append('cursor', cursor);

      const response = await n8nApi.get(`/tags?${params.toString()}`);
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

server.registerTool(
  "create_tag",
  {
    title: "Create Tag",
    description: "Create a new workflow tag for organization and categorization",
    inputSchema: {
      name: z.string().describe("Name of the tag to create")
    }
  },
  async ({ name }) => {
    try {
      const response = await n8nApi.post('/tags', { name });
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Tag '${name}' created successfully`,
            tag: response.data
          }, null, 2)
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

// Security Audit Tool
server.registerTool(
  "generate_audit",
  {
    title: "Generate Security Audit",
    description: "Generate a comprehensive security audit report for the n8n instance",
    inputSchema: {
      additionalOptions: z.object({
        daysAbandonedWorkflow: z.number().optional().describe("Number of days to consider a workflow abandoned"),
        categories: z.array(z.enum(["credentials", "database", "nodes", "filesystem", "instance"])).optional().describe("Audit categories to include")
      }).optional().describe("Additional audit configuration options")
    }
  },
  async ({ additionalOptions }) => {
    try {
      const auditPayload: any = {};

      if (additionalOptions) {
        if (additionalOptions.daysAbandonedWorkflow !== undefined) {
          auditPayload.daysAbandonedWorkflow = additionalOptions.daysAbandonedWorkflow;
        }
        if (additionalOptions.categories) {
          auditPayload.categories = additionalOptions.categories;
        }
      }

      const response = await n8nApi.post('/audit', auditPayload);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: "Security audit generated successfully",
            audit: response.data
          }, null, 2)
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

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("N8N Workflow Builder MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
