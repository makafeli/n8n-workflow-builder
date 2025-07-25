import { MCPTestClient } from '../helpers/mcpClient';
import { mockTag, mockN8nResponses } from '../helpers/mockData';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Tag Management Integration Tests', () => {
  let client: MCPTestClient;

  beforeEach(() => {
    client = new MCPTestClient();
    jest.clearAllMocks();
  });

  describe('list_tags', () => {
    it('should list all tags successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: mockN8nResponses.tags.list
      });

      const result = await client.callTool('list_tags', {});

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should support pagination with limit', async () => {
      const result = await client.callTool('list_tags', {
        limit: 10
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.data).toBeDefined();
    });

    it('should support pagination with cursor', async () => {
      const result = await client.callTool('list_tags', {
        cursor: 'next-page-cursor'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.data).toBeDefined();
    });
  });

  describe('create_tag', () => {
    it('should create a new tag successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: mockN8nResponses.tags.create.data
      });

      const result = await client.callTool('create_tag', {
        name: 'Production'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.tag.name).toBe('Production');
      expect(response.message).toContain('created successfully');
    });

    it('should require tag name', async () => {
      const result = await client.callTool('create_tag', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Tag name is required');
    });

    it('should handle duplicate tag names', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Tag name already exists'));

      const result = await client.callTool('create_tag', {
        name: 'Existing Tag'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Tag name already exists');
    });
  });

  describe('get_tag', () => {
    it('should retrieve tag by ID successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: mockN8nResponses.tags.get.data
      });

      const result = await client.callTool('get_tag', {
        id: 'test-tag-id'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.tag).toBeDefined();
    });

    it('should require tag ID', async () => {
      const result = await client.callTool('get_tag', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Tag ID is required');
    });

    it('should handle not found errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Tag not found'));

      const result = await client.callTool('get_tag', {
        id: 'nonexistent-id'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Tag not found');
    });
  });

  describe('update_tag', () => {
    it('should update tag name successfully', async () => {
      mockedAxios.put.mockResolvedValueOnce({
        data: mockN8nResponses.tags.update.data
      });

      const result = await client.callTool('update_tag', {
        id: 'test-tag-id',
        name: 'Updated Tag Name'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.tag.name).toBe('Updated Tag Name');
      expect(response.message).toContain('updated successfully');
    });

    it('should require tag ID and name', async () => {
      const result = await client.callTool('update_tag', {
        id: 'test-id'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Tag ID and name are required');
    });

    it('should handle duplicate names', async () => {
      mockedAxios.put.mockRejectedValueOnce(new Error('Tag name already exists'));

      const result = await client.callTool('update_tag', {
        id: 'test-id',
        name: 'Existing Name'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Tag name already exists');
    });
  });

  describe('delete_tag', () => {
    it('should delete tag successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        data: mockN8nResponses.tags.delete.data
      });

      const result = await client.callTool('delete_tag', {
        id: 'test-tag-id'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.message).toContain('deleted successfully');
    });

    it('should require tag ID', async () => {
      const result = await client.callTool('delete_tag', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Tag ID is required');
    });

    it('should handle tags in use', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Tag is in use by workflows'));

      const result = await client.callTool('delete_tag', {
        id: 'in-use-tag-id'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Tag is in use by workflows');
    });
  });

  describe('get_workflow_tags', () => {
    it('should retrieve workflow tags successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [mockTag]
      });

      const result = await client.callTool('get_workflow_tags', {
        workflowId: 'test-workflow-id'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.workflowId).toBe('test-workflow-id');
      expect(response.tags).toBeDefined();
    });

    it('should require workflow ID', async () => {
      const result = await client.callTool('get_workflow_tags', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Workflow ID is required');
    });
  });

  describe('update_workflow_tags', () => {
    it('should update workflow tags successfully', async () => {
      mockedAxios.put.mockResolvedValueOnce({
        data: ['tag-1', 'tag-2']
      });

      const result = await client.callTool('update_workflow_tags', {
        workflowId: 'test-workflow-id',
        tagIds: ['tag-1', 'tag-2']
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.workflowId).toBe('test-workflow-id');
      expect(response.assignedTags).toEqual(['tag-1', 'tag-2']);
    });

    it('should require workflow ID and tag IDs', async () => {
      const result = await client.callTool('update_workflow_tags', {
        workflowId: 'test-id'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Workflow ID and tag IDs are required');
    });

    it('should handle invalid tag IDs', async () => {
      mockedAxios.put.mockRejectedValueOnce(new Error('Invalid tag IDs'));

      const result = await client.callTool('update_workflow_tags', {
        workflowId: 'test-workflow-id',
        tagIds: ['invalid-tag-id']
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Invalid tag IDs');
    });
  });
});
