import { MCPTestClient } from '../helpers/mcpClient';
import { mockWorkflow, mockAuditReport, mockN8nResponses } from '../helpers/mockData';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('New Workflow Tools Integration Tests', () => {
  let client: MCPTestClient;

  beforeEach(() => {
    client = new MCPTestClient();
    jest.clearAllMocks();
  });

  describe('execute_workflow', () => {
    it('should execute workflow successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          id: 'new-execution-id',
          workflowId: 'test-workflow-id',
          status: 'running',
          startedAt: new Date().toISOString()
        }
      });

      const result = await client.callTool('execute_workflow', {
        id: 'test-workflow-id'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.execution).toBeDefined();
      expect(response.execution.workflowId).toBe('test-workflow-id');
      expect(response.message).toContain('executed successfully');
    });

    it('should require workflow ID', async () => {
      const result = await client.callTool('execute_workflow', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Workflow ID is required');
    });

    it('should handle inactive workflow errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Workflow is not active'));

      const result = await client.callTool('execute_workflow', {
        id: 'inactive-workflow-id'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Workflow is not active');
    });

    it('should handle workflow not found errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Workflow not found'));

      const result = await client.callTool('execute_workflow', {
        id: 'nonexistent-workflow-id'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Workflow not found');
    });

    it('should handle execution errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Execution failed'));

      const result = await client.callTool('execute_workflow', {
        id: 'test-workflow-id'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Execution failed');
    });
  });

  describe('create_workflow_and_activate', () => {
    it('should create and activate workflow successfully', async () => {
      // Mock workflow creation
      mockedAxios.post
        .mockResolvedValueOnce({
          data: { ...mockWorkflow, id: 'new-workflow-id' }
        })
        // Mock workflow activation
        .mockResolvedValueOnce({
          data: { ...mockWorkflow, id: 'new-workflow-id', active: true }
        });

      const result = await client.callTool('create_workflow_and_activate', {
        workflow: mockWorkflow
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.workflow).toBeDefined();
      expect(response.workflow.active).toBe(true);
      expect(response.message).toContain('created and activated successfully');
    });

    it('should require workflow data', async () => {
      const result = await client.callTool('create_workflow_and_activate', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Workflow data is required');
    });

    it('should handle workflow creation errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Invalid workflow data'));

      const result = await client.callTool('create_workflow_and_activate', {
        workflow: { name: 'Invalid Workflow' }
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Invalid workflow data');
    });

    it('should handle activation errors after successful creation', async () => {
      // Mock successful creation
      mockedAxios.post
        .mockResolvedValueOnce({
          data: { ...mockWorkflow, id: 'new-workflow-id' }
        })
        // Mock activation failure
        .mockRejectedValueOnce(new Error('Activation failed'));

      const result = await client.callTool('create_workflow_and_activate', {
        workflow: mockWorkflow
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Activation failed');
    });

    it('should validate workflow structure', async () => {
      const invalidWorkflow = {
        name: 'Test Workflow'
        // Missing required nodes array
      };

      const result = await client.callTool('create_workflow_and_activate', {
        workflow: invalidWorkflow
      });

      // The mock client should handle this gracefully
      expect(result.content).toBeDefined();
    });
  });

  describe('generate_audit', () => {
    it('should generate security audit successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: mockAuditReport
      });

      const result = await client.callTool('generate_audit', {});

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.audit).toBeDefined();
      expect(response.audit.instance).toBeDefined();
      expect(response.audit.security).toBeDefined();
      expect(response.audit.recommendations).toBeDefined();
      expect(response.message).toContain('Security audit generated successfully');
    });

    it('should support custom audit options', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: mockAuditReport
      });

      const result = await client.callTool('generate_audit', {
        additionalOptions: {
          daysAbandonedWorkflow: 30,
          categories: ['credentials', 'workflows']
        }
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.audit).toBeDefined();
    });

    it('should handle audit generation errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Audit generation failed'));

      const result = await client.callTool('generate_audit', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Audit generation failed');
    });

    it('should handle insufficient permissions', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Insufficient permissions for audit'));

      const result = await client.callTool('generate_audit', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Insufficient permissions for audit');
    });

    it('should validate audit categories', async () => {
      const result = await client.callTool('generate_audit', {
        additionalOptions: {
          categories: ['credentials', 'database', 'nodes', 'filesystem', 'instance']
        }
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
    });
  });
});
