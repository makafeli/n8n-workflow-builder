import { MCPTestClient } from '../helpers/mcpClient';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Error Handling Integration Tests', () => {
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

  describe('Network and API Errors', () => {
    it('should handle network connection errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      const result = await client.callTool('list_workflows');
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('ECONNREFUSED');
    });

    it('should handle n8n API authentication errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      });

      const result = await client.callTool('list_workflows');
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Unauthorized');
    });

    it('should handle n8n API rate limiting', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 429,
          data: { message: 'Too Many Requests' }
        }
      });

      const result = await client.callTool('list_workflows');
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Too Many Requests');
    });

    it('should handle n8n server errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      });

      const result = await client.callTool('list_workflows');
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Internal Server Error');
    });
  });

  describe('Invalid Parameters', () => {
    it('should validate missing required parameters', async () => {
      const result = await client.callTool('get_workflow', {});
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Workflow ID is required');
    });

    it('should validate invalid workflow data structure', async () => {
      const result = await client.callTool('create_workflow', {
        workflow: null
      });
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Workflow data is required');
    });

    it('should handle invalid execution filters', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { message: 'Invalid status filter' }
        }
      });

      const result = await client.callTool('list_executions', {
        status: 'invalid-status'
      });
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Invalid status filter');
    });
  });

  describe('Resource Access Errors', () => {
    it('should handle invalid resource URIs', async () => {
      await expect(
        client.readResource('/invalid-resource')
      ).rejects.toThrow();
    });

    it('should handle resource not found errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 404 }
      });

      await expect(
        client.readResource('/workflows/nonexistent-id')
      ).rejects.toThrow();
    });
  });

  describe('Tool Not Found', () => {
    it('should handle calls to non-existent tools', async () => {
      const result = await client.callTool('nonexistent_tool', {});
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Unknown tool');
    });
  });

  describe('MCP Server Connection Errors', () => {
    it('should handle server startup failures gracefully', async () => {
      // This test would require more complex setup to simulate server startup failure
      // For now, we'll test that the client can detect connection issues
      const failingClient = new MCPTestClient();
      
      // Mock a scenario where server process fails to start
      jest.spyOn(require('child_process'), 'spawn').mockImplementationOnce(() => {
        const mockProcess = {
          stdout: null,
          stdin: null,
          kill: jest.fn(),
          on: jest.fn()
        };
        return mockProcess as any;
      });

      await expect(failingClient.connect()).rejects.toThrow(
        'Failed to create server process stdio streams'
      );
    });
  });
});