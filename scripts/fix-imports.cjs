#!/usr/bin/env node

/**
 * Post-build script to fix CommonJS imports for @modelcontextprotocol/sdk
 * 
 * The SDK has issues with package exports, so we need to manually fix the require paths
 */

const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');

// Mapping of problematic imports to correct paths
const importFixes = {
  '@modelcontextprotocol/sdk/server/mcp.js': '../node_modules/@modelcontextprotocol/sdk/dist/cjs/server/mcp.js',
  '@modelcontextprotocol/sdk/server/stdio.js': '../node_modules/@modelcontextprotocol/sdk/dist/cjs/server/stdio.js',
  '@modelcontextprotocol/sdk/server/streamableHttp.js': '../node_modules/@modelcontextprotocol/sdk/dist/cjs/server/streamableHttp.js'
};

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Fix local .js imports to .cjs first (before SDK imports)
  const localJsRegex = /require\("(\..+?)\.js"\)/g;
  const matches = content.match(localJsRegex);
  if (matches) {
    content = content.replace(localJsRegex, 'require("$1.cjs")');
    modified = true;
  }
  
  // Fix @modelcontextprotocol/sdk imports (these should remain .js)
  for (const [oldPath, newPath] of Object.entries(importFixes)) {
    const regex = new RegExp(`require\\("${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\)`, 'g');
    if (content.includes(`"${oldPath}"`)) {
      content = content.replace(regex, `require("${newPath}")`);
      modified = true;
      console.log(`Fixed import in ${path.basename(filePath)}: ${oldPath} -> ${newPath}`);
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
  }
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.cjs')) {
      fixImportsInFile(fullPath);
    }
  }
}

console.log('Fixing CommonJS imports for @modelcontextprotocol/sdk...');
processDirectory(buildDir);
console.log('Import fixing complete!');