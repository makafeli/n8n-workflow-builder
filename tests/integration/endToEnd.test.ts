import { MCPTestClient } from '../helpers/mcpClient';
import { mockWorkflow } from '../helpers/mockData';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('End-to-End Workflow Tests', () => {
  let client: MCPTestClient;
  let workflowId: string;

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

  it('should complete full workflow lifecycle: create → activate → list → get → deactivate → delete', async () => {
    // Step 1: Create workflow
    const createResponse = { data: { id: 'e2e-workflow-id', ...mockWorkflow } };
    mockedAxios.post.mockResolvedValueOnce(createResponse);

    const createResult = await client.callTool('create_workflow', {
      workflow: mockWorkflow
    });

    expect(createResult.content).toBeDefined();
    const createdWorkflow = JSON.parse((createResult.content as any)[0].text);
    workflowId = createdWorkflow.id;
    expect(workflowId).toBe('e2e-workflow-id');

    // Step 2: Activate workflow
    const activateResponse = { data: { id: workflowId, active: true } };
    mockedAxios.patch.mockResolvedValueOnce(activateResponse);

    const activateResult = await client.callTool('activate_workflow', {
      id: workflowId
    });

    const activatedWorkflow = JSON.parse((activateResult.content as any)[0].text);
    expect(activatedWorkflow.active).toBe(true);

    // Step 3: List workflows (should include our workflow)
    const listResponse = {
      data: {
        data: [{ id: workflowId, name: mockWorkflow.name, active: true }]
      }
    };
    mockedAxios.get.mockResolvedValueOnce(listResponse);

    const listResult = await client.callTool('list_workflows');
    const workflowList = JSON.parse((listResult.content as any)[0].text);
    expect(workflowList.data).toContainEqual(
      expect.objectContaining({ id: workflowId })
    );

    // Step 4: Get specific workflow
    const getResponse = { data: { id: workflowId, ...mockWorkflow, active: true } };
    mockedAxios.get.mockResolvedValueOnce(getResponse);

    const getResult = await client.callTool('get_workflow', {
      id: workflowId
    });

    const retrievedWorkflow = JSON.parse((getResult.content as any)[0].text);
    expect(retrievedWorkflow.id).toBe(workflowId);
    expect(retrievedWorkflow.active).toBe(true);

    // Step 5: Deactivate workflow
    const deactivateResponse = { data: { id: workflowId, active: false } };
    mockedAxios.patch.mockResolvedValueOnce(deactivateResponse);

    const deactivateResult = await client.callTool('deactivate_workflow', {
      id: workflowId
    });

    const deactivatedWorkflow = JSON.parse((deactivateResult.content as any)[0].text);
    expect(deactivatedWorkflow.active).toBe(false);

    // Step 6: Delete workflow
    const deleteResponse = { data: { success: true } };
    mockedAxios.delete.mockResolvedValueOnce(deleteResponse);

    const deleteResult = await client.callTool('delete_workflow', {
      id: workflowId
    });

    const deleteConfirmation = JSON.parse((deleteResult.content as any)[0].text);
    expect(deleteConfirmation.success).toBe(true);
  });

  it('should handle workflow execution flow', async () => {
    // Create and activate workflow first
    const workflowResponse = { data: { id: 'exec-test-workflow', active: true } };
    mockedAxios.post.mockResolvedValueOnce(workflowResponse);
    mockedAxios.patch.mockResolvedValueOnce(workflowResponse);

    await client.callTool('create_workflow', { workflow: mockWorkflow });
    await client.callTool('activate_workflow', { id: 'exec-test-workflow' });

    // Mock execution creation (would happen via n8n webhook/trigger)
    const executionResponse = {
      data: {
        data: [{
          id: 'test-execution',
          workflowId: 'exec-test-workflow',
          status: 'success',
          startedAt: new Date().toISOString(),
          stoppedAt: new Date().toISOString()
        }]
      }
    };
    mockedAxios.get.mockResolvedValueOnce(executionResponse);

    // List executions for the workflow
    const listResult = await client.callTool('list_executions', {
      workflowId: 'exec-test-workflow'
    });

    const executions = JSON.parse((listResult.content as any)[0].text);
    expect(executions.data).toHaveLength(1);
    expect(executions.data[0].workflowId).toBe('exec-test-workflow');

    // Get specific execution
    const getExecResponse = { data: executions.data[0] };
    mockedAxios.get.mockResolvedValueOnce(getExecResponse);

    const getExecResult = await client.callTool('get_execution', {
      id: 'test-execution'
    });

    const execution = JSON.parse((getExecResult.content as any)[0].text);
    expect(execution.id).toBe('test-execution');
    expect(execution.status).toBe('success');
  });
});