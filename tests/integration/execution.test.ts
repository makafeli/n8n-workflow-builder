import { MCPTestClient } from '../helpers/mcpClient';
import { mockN8nResponses } from '../helpers/mockData';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Execution Management Integration Tests', () => {
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

  describe('list_executions', () => {
    it('should list all executions successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockN8nResponses.executions.list.data }
      });

      const result = await client.callTool('list_executions');
      
      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data).toHaveLength(1);
    });

    it('should support filtering by workflow ID', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: mockN8nResponses.executions }
      });

      const result = await client.callTool('list_executions', {
        workflowId: '1'
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/v1/executions',
        expect.objectContaining({
          params: expect.objectContaining({
            workflowId: '1'
          })
        })
      );
    });

    it('should support status filtering', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [] }
      });

      await client.callTool('list_executions', {
        status: 'success'
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/v1/executions',
        expect.objectContaining({
          params: expect.objectContaining({
            status: 'success'
          })
        })
      );
    });

    it('should support pagination', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { data: [] }
      });

      await client.callTool('list_executions', {
        limit: 10,
        offset: 20
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/v1/executions',
        expect.objectContaining({
          params: expect.objectContaining({
            limit: 10,
            offset: 20
          })
        })
      );
    });
  });

  describe('get_execution', () => {
    it('should retrieve execution by ID', async () => {
      const mockExecution = mockN8nResponses.executions.list.data[0];
      mockedAxios.get.mockResolvedValueOnce({
        data: mockExecution
      });

      const result = await client.callTool('get_execution', {
        id: mockExecution.id
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.id).toBe(mockExecution.id);
    });

    it('should support including execution data', async () => {
      const mockExecution = {
        ...mockN8nResponses.executions.list.data[0],
        data: { resultData: { runData: {} } }
      };
      mockedAxios.get.mockResolvedValueOnce({
        data: mockExecution
      });

      const result = await client.callTool('get_execution', {
        id: 'exec-1',
        includeData: true
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/v1/executions/exec-1',
        expect.objectContaining({
          params: expect.objectContaining({
            includeData: true
          })
        })
      );
    });

    it('should require execution ID', async () => {
      const result = await client.callTool('get_execution', {});
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Execution ID is required');
    });

    it('should handle not found errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { message: 'Execution not found' }
        }
      });

      const result = await client.callTool('get_execution', {
        id: 'nonexistent'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Execution not found');
    });
  });

  describe('delete_execution', () => {
    it('should delete execution successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        data: { success: true }
      });

      const result = await client.callTool('delete_execution', {
        id: 'exec-1'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
    });

    it('should require execution ID', async () => {
      const result = await client.callTool('delete_execution', {});
      
      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Execution ID is required');
    });
  });
});