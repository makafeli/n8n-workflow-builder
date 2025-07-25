import { MCPTestClient } from '../helpers/mcpClient';
import { mockN8nResponses } from '../helpers/mockData';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MCP Resources Integration Tests', () => {
  let client: MCPTestClient;

  beforeAll(async () => {
    client = new MCPTestClient();
    await client.connect();
  });

  afterAll(async () => {
    if (client) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Resource Templates', () => {
    it('should list available resource templates', async () => {
      const templates = await client.listResourceTemplates();
      
      expect(templates.resourceTemplates).toBeDefined();
      expect(templates.resourceTemplates).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            uriTemplate: '/workflows/{id}',
            name: 'Workflow Details',
            mimeType: 'application/json'
          }),
          expect.objectContaining({
            uriTemplate: '/executions/{id}',
            name: 'Execution Details', 
            mimeType: 'application/json'
          })
        ])
      );
    });
  });

  describe('Static Resources', () => {
    it('should read /workflows resource', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockN8nResponses.workflows.list.data }
      });

      const result = await client.readResource('/workflows');
      
      expect(result.contents).toBeDefined();
      expect(result.contents[0].type).toBe('text');
      expect(result.contents[0].mimeType).toBe('application/json');
      
      const workflows = JSON.parse((result.contents as any)[0].text);
      expect(Array.isArray(workflows)).toBe(true);
    });

    it('should read /execution-stats resource', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockN8nResponses.executions }
      });

      const result = await client.readResource('/execution-stats');
      
      expect(result.contents).toBeDefined();
      expect(result.contents[0].type).toBe('text');
      expect(result.contents[0].mimeType).toBe('application/json');
      
      const stats = JSON.parse((result.contents as any)[0].text);
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('succeeded');
      expect(stats).toHaveProperty('failed');
      expect(stats).toHaveProperty('avgExecutionTime');
    });

    it('should handle execution stats API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const result = await client.readResource('/execution-stats');
      
      expect(result.contents).toBeDefined();
      const stats = JSON.parse((result.contents as any)[0].text);
      expect(stats.error).toContain('Failed to retrieve execution statistics');
    });
  });

  describe('Dynamic Resources', () => {
    it('should read workflow by ID resource', async () => {
      const mockWorkflow = {
        id: 'workflow-123',
        name: 'Test Workflow',
        active: true
      };
      mockedAxios.get.mockResolvedValueOnce({
        data: mockWorkflow
      });

      const result = await client.readResource('/workflows/workflow-123');
      
      expect(result.contents).toBeDefined();
      expect(result.contents[0].type).toBe('text');
      expect(result.contents[0].mimeType).toBe('application/json');
      
      const workflow = JSON.parse((result.contents as any)[0].text);
      expect(workflow.id).toBe('workflow-123');
    });

    it('should read execution by ID resource', async () => {
      const mockExecution = {
        id: 'exec-456',
        workflowId: 'workflow-123',
        status: 'success'
      };
      mockedAxios.get.mockResolvedValueOnce({
        data: mockExecution
      });

      const result = await client.readResource('/executions/exec-456');
      
      expect(result.contents).toBeDefined();
      const execution = JSON.parse((result.contents as any)[0].text);
      expect(execution.id).toBe('exec-456');
    });

    it('should handle not found resources', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 404 }
      });

      await expect(
        client.readResource('/workflows/nonexistent')
      ).rejects.toThrow();
    });
  });

  describe('Resource Listing', () => {
    it('should list all available resources', async () => {
      const resources = await client.listResources();
      
      expect(resources.resources).toBeDefined();
      expect(resources.resources).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            uri: '/workflows',
            name: 'Workflows List',
            mimeType: 'application/json'
          }),
          expect.objectContaining({
            uri: '/execution-stats',
            name: 'Execution Statistics',
            mimeType: 'application/json'
          })
        ])
      );
    });
  });
});