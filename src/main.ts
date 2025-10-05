#!/usr/bin/env node

// Entry point that chooses between stdio and HTTP mode
const useHttp = process.env.USE_HTTP === 'true' || process.env.PORT || process.env.RAILWAY_ENVIRONMENT;

if (useHttp) {
  console.log("Starting N8N Workflow Builder in HTTP mode...");
  // Import and run the HTTP server
  require('./http-server.cjs');
} else {
  console.log("Starting N8N Workflow Builder in stdio mode...");
  // Import and run the stdio server  
  require('./server.cjs');
}