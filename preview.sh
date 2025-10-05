#!/bin/bash

# Quick Preview Script for n8n Workflow Builder MCP Server (Linux/Mac)
# This script automatically sets up and launches the server on port 3000

set -e

echo "========================================"
echo " n8n Workflow Builder - Quick Preview"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18.0.0 or higher from https://nodejs.org/"
    echo ""
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH"
    echo "Please install Node.js which includes npm"
    echo ""
    exit 1
fi

echo "[1/5] Checking Node.js version..."
node --version
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[2/5] Installing dependencies..."
    echo "This may take a few minutes..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        echo ""
        exit 1
    fi
else
    echo "[2/5] Dependencies already installed"
fi
echo ""

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "[3/5] Building project..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to build project"
        echo ""
        exit 1
    fi
else
    echo "[3/5] Project already built"
    echo "(Run 'npm run build' manually if you need to rebuild)"
fi
echo ""

echo "[4/5] Starting server on port 3000..."
echo ""
echo "Server will start in a moment..."
echo "Press Ctrl+C to stop the server"
echo ""

# Set environment variables for preview mode
export PORT=3000
export USE_HTTP=true

# Function to open browser
open_browser() {
    sleep 3
    
    # Detect OS and open browser
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "http://localhost:3000" 2>/dev/null || true
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:3000" 2>/dev/null || true
        elif command -v gnome-open &> /dev/null; then
            gnome-open "http://localhost:3000" 2>/dev/null || true
        fi
    fi
}

# Open browser in background
open_browser &

# Start the server
echo "[5/5] Launching..."
echo ""
echo "========================================"
echo " Server Information"
echo "========================================"
echo ""
echo "  URL: http://localhost:3000"
echo "  Health Check: http://localhost:3000/health"
echo "  MCP Endpoint: http://localhost:3000/mcp"
echo ""
echo "========================================"
echo ""

npm start
