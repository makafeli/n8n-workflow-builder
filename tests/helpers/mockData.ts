// Mock data for testing

export const mockWorkflow = {
  name: 'Test Workflow',
  nodes: [
    {
      id: 'start-node',
      name: 'Start',
      type: 'n8n-nodes-base.start',
      typeVersion: 1,
      position: [250, 300],
      parameters: {}
    },
    {
      id: 'http-node',
      name: 'HTTP Request',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 1,
      position: [450, 300],
      parameters: {
        url: 'https://api.example.com/data',
        method: 'GET'
      }
    }
  ],
  connections: {
    'Start': {
      main: [
        [
          {
            node: 'HTTP Request',
            type: 'main',
            index: 0
          }
        ]
      ]
    }
  },
  settings: {
    executionOrder: 'v1'
  },
  tags: []
};

export const mockExecution = {
  id: 'test-execution-id',
  workflowId: 'test-workflow-id',
  status: 'success',
  startedAt: '2024-01-01T00:00:00.000Z',
  stoppedAt: '2024-01-01T00:01:00.000Z',
  mode: 'manual',
  data: {
    resultData: {
      runData: {}
    }
  }
};

export const mockTag = {
  id: 'test-tag-id',
  name: 'Test Tag',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

export const mockCredential = {
  id: 'test-credential-id',
  name: 'Test Credential',
  type: 'httpBasicAuth',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

export const mockCredentialSchema = {
  type: 'httpBasicAuth',
  displayName: 'HTTP Basic Auth',
  properties: {
    user: {
      displayName: 'User',
      type: 'string',
      required: true
    },
    password: {
      displayName: 'Password',
      type: 'string',
      typeOptions: {
        password: true
      },
      required: true
    }
  }
};

export const mockAuditReport = {
  instance: {
    version: '1.0.0',
    nodeVersion: '18.0.0',
    database: 'sqlite'
  },
  security: {
    credentials: {
      total: 5,
      encrypted: 5,
      issues: []
    },
    workflows: {
      total: 10,
      active: 7,
      abandoned: 1,
      issues: []
    }
  },
  recommendations: [
    'Update to latest n8n version',
    'Review abandoned workflows'
  ]
};

export const mockN8nResponses = {
  workflows: {
    list: { data: [mockWorkflow] },
    get: { data: mockWorkflow },
    create: { data: { ...mockWorkflow, id: 'new-workflow-id' } },
    update: { data: { ...mockWorkflow, id: 'updated-workflow-id' } },
    delete: { data: { success: true } },
    activate: { data: { ...mockWorkflow, active: true } },
    deactivate: { data: { ...mockWorkflow, active: false } }
  },
  executions: {
    list: { data: [mockExecution] },
    get: { data: mockExecution },
    delete: { data: { success: true } }
  },
  tags: {
    list: { data: [mockTag] },
    get: { data: mockTag },
    create: { data: { ...mockTag, id: 'new-tag-id' } },
    update: { data: { ...mockTag, name: 'Updated Tag' } },
    delete: { data: { success: true } }
  },
  credentials: {
    create: { data: { ...mockCredential, id: 'new-credential-id' } },
    schema: { data: mockCredentialSchema },
    delete: { data: { success: true } }
  },
  audit: {
    generate: { data: mockAuditReport }
  }
};
