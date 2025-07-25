// Test setup file for Jest
import 'dotenv/config';

// Set test environment variables
process.env.N8N_HOST = process.env.N8N_HOST || 'http://localhost:5678';
process.env.N8N_API_KEY = process.env.N8N_API_KEY || 'test-api-key';
