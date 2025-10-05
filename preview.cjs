#!/usr/bin/env node

/**
 * Quick Preview Script for n8n Workflow Builder MCP Server
 * Cross-platform Node.js launcher
 * 
 * This script automatically sets up and launches the server on port 3000
 * Works on Windows, Linux, and macOS
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('');
  log('========================================', 'bright');
  log(` ${message}`, 'bright');
  log('========================================', 'bright');
  console.log('');
}

function checkCommand(command) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

function checkNodeModules() {
  return fs.existsSync(path.join(process.cwd(), 'node_modules'));
}

function checkBuildDir() {
  return fs.existsSync(path.join(process.cwd(), 'build'));
}

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, FORCE_COLOR: '1' }
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

function openBrowser(url) {
  const startMap = {
    'darwin': 'open',
    'win32': 'start',
    'linux': 'xdg-open'
  };

  const command = startMap[process.platform];
  
  if (command) {
    // Add delay before opening browser
    setTimeout(() => {
      try {
        if (process.platform === 'win32') {
          // Windows needs special handling
          execSync(`start "" "${url}"`, { stdio: 'ignore' });
        } else {
          execSync(`${command} "${url}"`, { stdio: 'ignore' });
        }
        log('✓ Browser opened', 'green');
      } catch (error) {
        log(`Note: Could not open browser automatically. Please open ${url} manually.`, 'yellow');
      }
    }, 3000);
  } else {
    log(`Note: Please open ${url} manually in your browser.`, 'yellow');
  }
}

async function main() {
  logHeader('n8n Workflow Builder - Quick Preview');

  try {
    // Step 1: Check Node.js
    log('[1/5] Checking Node.js installation...', 'blue');
    if (!checkCommand('node')) {
      log('ERROR: Node.js is not installed or not in PATH', 'red');
      log('Please install Node.js 18.0.0 or higher from https://nodejs.org/', 'yellow');
      process.exit(1);
    }
    
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log(`✓ Node.js ${nodeVersion} found`, 'green');
    console.log('');

    // Step 2: Check dependencies
    log('[2/5] Checking dependencies...', 'blue');
    if (!checkNodeModules()) {
      log('Installing dependencies...', 'yellow');
      log('This may take a few minutes...', 'yellow');
      await runCommand('npm', ['install']);
      log('✓ Dependencies installed', 'green');
    } else {
      log('✓ Dependencies already installed', 'green');
    }
    console.log('');

    // Step 3: Check build
    log('[3/5] Checking build...', 'blue');
    if (!checkBuildDir()) {
      log('Building project...', 'yellow');
      await runCommand('npm', ['run', 'build']);
      log('✓ Project built', 'green');
    } else {
      log('✓ Project already built', 'green');
      log('(Run "npm run build" manually if you need to rebuild)', 'yellow');
    }
    console.log('');

    // Step 4: Prepare server
    log('[4/5] Starting server on port 3000...', 'blue');
    console.log('');
    log('Server will start in a moment...', 'yellow');
    log('Press Ctrl+C to stop the server', 'yellow');
    console.log('');

    // Set environment variables
    process.env.PORT = '3000';
    process.env.USE_HTTP = 'true';

    // Open browser
    openBrowser('http://localhost:3000');

    // Step 5: Start server
    log('[5/5] Launching...', 'blue');
    console.log('');
    logHeader('Server Information');
    console.log('');
    log('  URL: http://localhost:3000', 'bright');
    log('  Health Check: http://localhost:3000/health', 'bright');
    log('  MCP Endpoint: http://localhost:3000/mcp', 'bright');
    console.log('');
    log('========================================', 'bright');
    console.log('');

    await runCommand('npm', ['start']);

  } catch (error) {
    console.error('');
    log('ERROR: ' + error.message, 'red');
    console.error('');
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('');
  log('Shutting down server...', 'yellow');
  process.exit(0);
});

// Run the script
main();
