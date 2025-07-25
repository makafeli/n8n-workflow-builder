import { MCPTestClient } from '../helpers/mcpClient';
import { mockCredential, mockCredentialSchema, mockN8nResponses } from '../helpers/mockData';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Credential Management Integration Tests', () => {
  let client: MCPTestClient;

  beforeEach(() => {
    client = new MCPTestClient();
    jest.clearAllMocks();
  });

  describe('create_credential', () => {
    it('should create a new credential successfully', async () => {
      const credentialData = {
        name: 'Test HTTP Auth',
        type: 'httpBasicAuth',
        data: {
          user: 'testuser',
          password: 'testpass'
        }
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: mockN8nResponses.credentials.create.data
      });

      const result = await client.callTool('create_credential', credentialData);

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.credential.name).toBe(credentialData.name);
      expect(response.credential.type).toBe(credentialData.type);
      expect(response.message).toContain('created successfully');
    });

    it('should require credential name', async () => {
      const result = await client.callTool('create_credential', {
        type: 'httpBasicAuth',
        data: { user: 'test', password: 'test' }
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('name, type, and data are required');
    });

    it('should require credential type', async () => {
      const result = await client.callTool('create_credential', {
        name: 'Test Credential',
        data: { user: 'test', password: 'test' }
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('name, type, and data are required');
    });

    it('should require credential data', async () => {
      const result = await client.callTool('create_credential', {
        name: 'Test Credential',
        type: 'httpBasicAuth'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('name, type, and data are required');
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

      const result = await client.callTool('create_credential', {
        name: 'Test Credential',
        type: 'httpBasicAuth',
        data: { user: 'test', password: 'test' }
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: API Error');
    });
  });

  describe('get_credential_schema', () => {
    it('should retrieve credential schema successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: mockN8nResponses.credentials.schema.data
      });

      const result = await client.callTool('get_credential_schema', {
        credentialType: 'httpBasicAuth'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.credentialType).toBe('httpBasicAuth');
      expect(response.schema).toBeDefined();
      expect(response.schema.properties).toBeDefined();
    });

    it('should require credential type', async () => {
      const result = await client.callTool('get_credential_schema', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Credential type is required');
    });

    it('should handle unknown credential types', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Unknown credential type'));

      const result = await client.callTool('get_credential_schema', {
        credentialType: 'unknownType'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Unknown credential type');
    });
  });

  describe('delete_credential', () => {
    it('should delete credential successfully', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        data: mockN8nResponses.credentials.delete.data
      });

      const result = await client.callTool('delete_credential', {
        id: 'test-credential-id'
      });

      expect(result.content).toBeDefined();
      const response = JSON.parse((result.content as any)[0].text);
      expect(response.success).toBe(true);
      expect(response.message).toContain('deleted successfully');
    });

    it('should require credential ID', async () => {
      const result = await client.callTool('delete_credential', {});

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Credential ID is required');
    });

    it('should handle not found errors', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Credential not found'));

      const result = await client.callTool('delete_credential', {
        id: 'nonexistent-id'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Credential not found');
    });

    it('should handle credentials in use errors', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Credential is in use by workflows'));

      const result = await client.callTool('delete_credential', {
        id: 'in-use-credential-id'
      });

      expect(result.isError).toBe(true);
      expect((result.content as any)[0].text).toContain('Error: Credential is in use by workflows');
    });
  });
});
