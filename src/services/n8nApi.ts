import axios from 'axios';
import { N8N_HOST, N8N_API_KEY } from '../config/constants';
import { WorkflowSpec } from '../types/workflow';
import { N8NWorkflowResponse } from '../types/api';

const api = axios.create({
  baseURL: `${N8N_HOST}/workflows`,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': N8N_API_KEY
  }
});

export async function createWorkflow(workflow: WorkflowSpec): Promise<N8NWorkflowResponse> {
  const response = await api.post('/', workflow);
  return response.data;
}

export async function getWorkflow(id: string): Promise<N8NWorkflowResponse> {
  const response = await api.get(`/${id}`);
  return response.data;
}

export async function updateWorkflow(id: string, workflow: WorkflowSpec): Promise<N8NWorkflowResponse> {
  const response = await api.put(`/${id}`, workflow);
  return response.data;
}

export async function deleteWorkflow(id: string): Promise<any> {
  const response = await api.delete(`/${id}`);
  return response.data;
}

export async function activateWorkflow(id: string): Promise<N8NWorkflowResponse> {
  const response = await api.patch(`/${id}`, { active: true });
  return response.data;
}

export async function deactivateWorkflow(id: string): Promise<N8NWorkflowResponse> {
  const response = await api.patch(`/${id}`, { active: false });
  return response.data;
}

export async function listWorkflows(): Promise<N8NWorkflowResponse[]> {
  const response = await api.get('/');
  return response.data;
}
