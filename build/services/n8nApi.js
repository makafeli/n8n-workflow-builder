"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkflow = createWorkflow;
exports.getWorkflow = getWorkflow;
exports.updateWorkflow = updateWorkflow;
exports.deleteWorkflow = deleteWorkflow;
exports.activateWorkflow = activateWorkflow;
exports.deactivateWorkflow = deactivateWorkflow;
exports.listWorkflows = listWorkflows;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../config/constants");
const api = axios_1.default.create({
    baseURL: `${constants_1.N8N_HOST}/rest/workflows`,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': constants_1.N8N_API_KEY
    }
});
async function createWorkflow(workflow) {
    const response = await api.post('/', workflow);
    return response.data;
}
async function getWorkflow(id) {
    const response = await api.get(`/${id}`);
    return response.data;
}
async function updateWorkflow(id, workflow) {
    const response = await api.put(`/${id}`, workflow);
    return response.data;
}
async function deleteWorkflow(id) {
    const response = await api.delete(`/${id}`);
    return response.data;
}
async function activateWorkflow(id) {
    const response = await api.patch(`/${id}`, { active: true });
    return response.data;
}
async function deactivateWorkflow(id) {
    const response = await api.patch(`/${id}`, { active: false });
    return response.data;
}
async function listWorkflows() {
    const response = await api.get('/');
    return response.data;
}
//# sourceMappingURL=n8nApi.js.map