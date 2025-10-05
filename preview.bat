@echo off
REM Quick Preview Script for n8n Workflow Builder MCP Server (Windows)
REM This script automatically sets up and launches the server on port 3000

echo ========================================
echo  n8n Workflow Builder - Quick Preview
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18.0.0 or higher from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js which includes npm
    echo.
    pause
    exit /b 1
)

echo [1/5] Checking Node.js version...
node --version
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [2/5] Installing dependencies...
    echo This may take a few minutes...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        echo.
        pause
        exit /b 1
    )
) else (
    echo [2/5] Dependencies already installed
)
echo.

REM Check if build directory exists
if not exist "build\" (
    echo [3/5] Building project...
    call npm run build
    if %errorlevel% neq 0 (
        echo ERROR: Failed to build project
        echo.
        pause
        exit /b 1
    )
) else (
    echo [3/5] Project already built
    echo (Run 'npm run build' manually if you need to rebuild)
)
echo.

echo [4/5] Starting server on port 3000...
echo.
echo Server will start in a moment...
echo Press Ctrl+C to stop the server
echo.

REM Set environment variables for preview mode
set PORT=3000
set USE_HTTP=true

REM Open browser after a short delay
start "" timeout /t 3 /nobreak >nul 2>&1 ^& start http://localhost:3000

REM Start the server
echo [5/5] Launching...
echo.
echo ========================================
echo  Server Information
echo ========================================
echo.
echo  URL: http://localhost:3000
echo  Health Check: http://localhost:3000/health
echo  MCP Endpoint: http://localhost:3000/mcp
echo.
echo ========================================
echo.

call npm start
