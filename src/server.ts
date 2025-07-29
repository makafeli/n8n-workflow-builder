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

// Create MCP server with modern SDK 1.17.0 API
const server = new McpServer({
  name: "n8n-workflow-builder",
  version: "0.10.3"
});

// Register workflow management tools using modern MCP SDK 1.17.0 API
server.tool(
  "list_workflows",
  "List all workflows from n8n instance",
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
  "Create a new workflow in n8n",
  {
    workflow: z.object({
      name: z.string().describe("Name of the workflow"),
      nodes: z.array(z.any()).describe("Array of workflow nodes"),
      connections: z.record(z.string(), z.any()).optional().describe("Node connections"),
      settings: z.record(z.string(), z.any()).optional().describe("Workflow settings"),
      tags: z.array(z.any()).optional().describe("Workflow tags")
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
  "Get a workflow by ID",
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
  "update_workflow",
  "Update an existing workflow by ID",
  {
    id: z.string().describe("Workflow ID"),
    workflow: z.object({
      name: z.string().optional().describe("Name of the workflow"),
      nodes: z.array(z.any()).optional().describe("Array of workflow nodes"),
      connections: z.record(z.string(), z.any()).optional().describe("Node connections"),
      settings: z.record(z.string(), z.any()).optional().describe("Workflow settings"),
      tags: z.array(z.any()).optional().describe("Workflow tags")
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
  "delete_workflow",
  "Delete a workflow by ID",
  {
    id: z.string().describe("Workflow ID")
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.delete(`/workflows/${id}`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Workflow ${id} deleted successfully`,
            deletedWorkflow: response.data
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

server.tool(
  "activate_workflow",
  "Activate a workflow by ID",
  {
    id: z.string().describe("Workflow ID")
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.post(`/workflows/${id}/activate`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Workflow ${id} activated successfully`,
            workflow: response.data
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

server.tool(
  "deactivate_workflow",
  "Deactivate a workflow by ID",
  {
    id: z.string().describe("Workflow ID")
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.post(`/workflows/${id}/deactivate`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Workflow ${id} deactivated successfully`,
            workflow: response.data
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

server.tool(
  "execute_workflow",
  "Execute a workflow manually",
  {
    id: z.string().describe("Workflow ID")
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.post(`/workflows/${id}/execute`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Workflow ${id} executed successfully`,
            execution: response.data
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

server.tool(
  "create_workflow_and_activate",
  "Create a new workflow and immediately activate it",
  {
    workflow: z.object({
      name: z.string().describe("Name of the workflow"),
      nodes: z.array(z.any()).describe("Array of workflow nodes"),
      connections: z.record(z.string(), z.any()).optional().describe("Node connections"),
      settings: z.record(z.string(), z.any()).optional().describe("Workflow settings"),
      tags: z.array(z.any()).optional().describe("Workflow tags")
    }).describe("Workflow configuration")
  },
  async ({ workflow }) => {
    try {
      // First create the workflow
      const createResponse = await n8nApi.post('/workflows', workflow);
      const workflowId = createResponse.data.id;

      // Then activate it
      const activateResponse = await n8nApi.post(`/workflows/${workflowId}/activate`);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Workflow created and activated successfully`,
            workflow: activateResponse.data
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
server.tool(
  "list_executions",
  "List workflow executions with filtering and pagination support",
  {
    includeData: z.boolean().optional().describe("Include execution's detailed data"),
    status: z.enum(["error", "success", "waiting"]).optional().describe("Filter by execution status"),
    workflowId: z.string().optional().describe("Filter by specific workflow ID"),
    projectId: z.string().optional().describe("Filter by project ID"),
    limit: z.number().min(1).max(250).optional().describe("Number of executions to return (max: 250)"),
    cursor: z.string().optional().describe("Pagination cursor for next page")
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

server.tool(
  "get_execution",
  "Get detailed information about a specific workflow execution",
  {
    id: z.string().describe("Execution ID"),
    includeData: z.boolean().optional().describe("Include detailed execution data")
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

server.tool(
  "delete_execution",
  "Delete a workflow execution record from the n8n instance",
  {
    id: z.string().describe("Execution ID to delete")
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
server.tool(
  "list_tags",
  "List all workflow tags with pagination support",
  {
    limit: z.number().min(1).max(250).optional().describe("Number of tags to return (max: 250)"),
    cursor: z.string().optional().describe("Pagination cursor for next page")
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

server.tool(
  "create_tag",
  "Create a new workflow tag for organization and categorization",
  {
    name: z.string().describe("Name of the tag to create")
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

server.tool(
  "get_tag",
  "Retrieve individual tag details by ID",
  {
    id: z.string().describe("Tag ID")
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.get(`/tags/${id}`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            tag: response.data,
            message: `Tag ${id} retrieved successfully`
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

server.tool(
  "update_tag",
  "Modify tag names for better organization",
  {
    id: z.string().describe("Tag ID"),
    name: z.string().describe("New name for the tag")
  },
  async ({ id, name }) => {
    try {
      const response = await n8nApi.put(`/tags/${id}`, { name });
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Tag ${id} updated successfully`,
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

server.tool(
  "delete_tag",
  "Remove unused tags from the system",
  {
    id: z.string().describe("Tag ID to delete")
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.delete(`/tags/${id}`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Tag ${id} deleted successfully`,
            deletedTag: response.data
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

server.tool(
  "get_workflow_tags",
  "Get all tags associated with a specific workflow",
  {
    workflowId: z.string().describe("Workflow ID")
  },
  async ({ workflowId }) => {
    try {
      const response = await n8nApi.get(`/workflows/${workflowId}/tags`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            workflowId,
            tags: response.data,
            message: `Tags for workflow ${workflowId} retrieved successfully`
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

server.tool(
  "update_workflow_tags",
  "Assign or remove tags from workflows",
  {
    workflowId: z.string().describe("Workflow ID"),
    tagIds: z.array(z.string()).describe("Array of tag IDs to assign to the workflow")
  },
  async ({ workflowId, tagIds }) => {
    try {
      const response = await n8nApi.put(`/workflows/${workflowId}/tags`, { tagIds });
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Tags for workflow ${workflowId} updated successfully`,
            workflowId,
            assignedTags: response.data
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

// Credential Management Tools
server.tool(
  "create_credential",
  "Create a new credential for workflow authentication. Use get_credential_schema first to understand required fields for the credential type.",
  {
    name: z.string().describe("Name for the credential"),
    type: z.string().describe("Credential type (e.g., 'httpBasicAuth', 'httpHeaderAuth', 'oAuth2Api', etc.)"),
    data: z.record(z.string(), z.any()).describe("Credential data object with required fields for the credential type")
  },
  async ({ name, type, data }) => {
    try {
      const response = await n8nApi.post('/credentials', {
        name,
        type,
        data
      });
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Credential '${name}' created successfully`,
            credential: {
              id: response.data.id,
              name: response.data.name,
              type: response.data.type,
              createdAt: response.data.createdAt
            }
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

server.tool(
  "get_credential_schema",
  "Get the schema for a specific credential type to understand what fields are required when creating credentials.",
  {
    credentialType: z.string().describe("Credential type name (e.g., 'httpBasicAuth', 'httpHeaderAuth', 'oAuth2Api', 'githubApi', 'slackApi', etc.)")
  },
  async ({ credentialType }) => {
    try {
      const response = await n8nApi.get(`/credentials/schema/${credentialType}`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            credentialType,
            schema: response.data,
            message: `Schema for credential type '${credentialType}' retrieved successfully`
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

server.tool(
  "delete_credential",
  "Delete a credential by ID. This will remove the credential and make it unavailable for workflows. Use with caution as this action cannot be undone.",
  {
    id: z.string().describe("Credential ID to delete")
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.delete(`/credentials/${id}`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Credential ${id} deleted successfully`,
            deletedCredential: response.data
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
server.tool(
  "generate_audit",
  "Generate a comprehensive security audit report for the n8n instance",
  {
    additionalOptions: z.object({
      daysAbandonedWorkflow: z.number().optional().describe("Number of days to consider a workflow abandoned"),
      categories: z.array(z.enum(["credentials", "database", "nodes", "filesystem", "instance"])).optional().describe("Audit categories to include")
    }).optional().describe("Additional audit configuration options")
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
  console.error("N8N Workflow Builder MCP server v0.10.3 running on stdio");
  console.error("Modern SDK 1.17.0 with 23 tools: 9 workflow + 3 execution + 7 tag + 3 credential + 1 audit");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
