"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configSchema = void 0;
exports.default = default_1;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
const axios_1 = __importDefault(require("axios"));
// Configuration schema for Smithery
exports.configSchema = zod_1.z.object({
    n8nHost: zod_1.z.string().describe("n8n instance URL (e.g., http://localhost:5678)").default("http://localhost:5678"),
    n8nApiKey: zod_1.z.string().describe("n8n API key for authentication")
});
function default_1({ config }) {
    // Create axios instance for n8n API
    const n8nApi = axios_1.default.create({
        baseURL: config.n8nHost,
        headers: {
            'X-N8N-API-KEY': config.n8nApiKey,
            'Content-Type': 'application/json'
        }
    });
    // Create MCP server with modern SDK 1.17.0 API
    const server = new mcp_js_1.McpServer({
        name: "n8n-workflow-builder",
        version: "0.10.1"
    });
    // Register workflow management tools using modern MCP SDK 1.17.0 API
    server.tool("list_workflows", "List all workflows from n8n instance", {}, async () => {
        try {
            const response = await n8nApi.get('/api/v1/workflows');
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response.data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }],
                isError: true
            };
        }
    });
    server.tool("create_workflow", "Create a new workflow in n8n", {
        workflow: zod_1.z.object({
            name: zod_1.z.string().describe("Name of the workflow"),
            nodes: zod_1.z.array(zod_1.z.any()).describe("Array of workflow nodes"),
            connections: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).describe("Node connections").optional(),
            settings: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).describe("Workflow settings").optional(),
            tags: zod_1.z.array(zod_1.z.string()).describe("Workflow tags").optional()
        }).describe("Workflow configuration")
    }, async ({ workflow }) => {
        try {
            const response = await n8nApi.post('/api/v1/workflows', workflow);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response.data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }],
                isError: true
            };
        }
    });
    server.tool("get_workflow", "Get a workflow by ID", {
        id: zod_1.z.string().describe("Workflow ID")
    }, async ({ id }) => {
        try {
            const response = await n8nApi.get(`/api/v1/workflows/${id}`);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response.data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }],
                isError: true
            };
        }
    });
    server.tool("execute_workflow", "Execute a workflow by ID", {
        id: zod_1.z.string().describe("Workflow ID")
    }, async ({ id }) => {
        try {
            const response = await n8nApi.post(`/api/v1/workflows/${id}/execute`);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response.data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }],
                isError: true
            };
        }
    });
    server.tool("update_workflow", "Update an existing workflow by ID", {
        id: zod_1.z.string().describe("Workflow ID"),
        workflow: zod_1.z.object({
            name: zod_1.z.string().describe("Name of the workflow").optional(),
            nodes: zod_1.z.array(zod_1.z.any()).describe("Array of workflow nodes").optional(),
            connections: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).describe("Node connections").optional(),
            settings: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).describe("Workflow settings").optional(),
            tags: zod_1.z.array(zod_1.z.string()).describe("Workflow tags").optional()
        }).describe("Updated workflow configuration")
    }, async ({ id, workflow }) => {
        try {
            const response = await n8nApi.put(`/api/v1/workflows/${id}`, workflow);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response.data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }],
                isError: true
            };
        }
    });
    server.tool("activate_workflow", "Activate a workflow by ID", {
        id: zod_1.z.string().describe("Workflow ID")
    }, async ({ id }) => {
        try {
            const response = await n8nApi.patch(`/api/v1/workflows/${id}/activate`);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response.data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }],
                isError: true
            };
        }
    });
    server.tool("deactivate_workflow", "Deactivate a workflow by ID", {
        id: zod_1.z.string().describe("Workflow ID")
    }, async ({ id }) => {
        try {
            const response = await n8nApi.patch(`/api/v1/workflows/${id}/deactivate`);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response.data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }],
                isError: true
            };
        }
    });
    server.tool("delete_workflow", "Delete a workflow by ID", {
        id: zod_1.z.string().describe("Workflow ID")
    }, async ({ id }) => {
        try {
            const response = await n8nApi.delete(`/api/v1/workflows/${id}`);
            return {
                content: [{
                        type: "text",
                        text: JSON.stringify(response.data, null, 2)
                    }]
            };
        }
        catch (error) {
            return {
                content: [{
                        type: "text",
                        text: `Error: ${error instanceof Error ? error.message : String(error)}`
                    }],
                isError: true
            };
        }
    });
    return server.server;
}
//# sourceMappingURL=index.js.map