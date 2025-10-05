#!/bin/bash

# Deployment Verification Script for n8n Workflow Builder on Railway
# This script tests all critical endpoints to verify the 502 fix is working

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if URL is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide your Railway service URL${NC}"
    echo "Usage: $0 <railway-url>"
    echo "Example: $0 https://your-service.up.railway.app"
    exit 1
fi

SERVICE_URL=$1
# Remove trailing slash if present
SERVICE_URL=${SERVICE_URL%/}

echo "======================================================"
echo "  n8n Workflow Builder - Deployment Verification"
echo "======================================================"
echo ""
echo "Testing service at: ${SERVICE_URL}"
echo ""

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    local method=${4:-GET}
    local data=${5:-}
    local headers=${6:-}
    
    echo -n "Testing ${name}... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "${url}" \
            -H "Content-Type: application/json" \
            ${headers} \
            -d "${data}" 2>&1) || true
    else
        response=$(curl -s -w "\n%{http_code}" "${url}" 2>&1) || true
    fi
    
    status_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status_code)"
        PASSED=$((PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected HTTP $expected_status, got $status_code)"
        FAILED=$((FAILED + 1))
        return 1
    fi
}

# Run tests
echo "Running endpoint tests..."
echo ""

# Test 1: Health endpoint
test_endpoint "Health endpoint" "${SERVICE_URL}/health" "200"

# Test 2: Root endpoint
test_endpoint "Root endpoint" "${SERVICE_URL}/" "200"

# Test 3: Invalid route (should 404)
test_endpoint "404 handler (invalid route)" "${SERVICE_URL}/nonexistent-route" "404"

# Test 4: MCP endpoint with proper headers (should NOT 404)
test_endpoint "MCP endpoint (initialize)" \
    "${SERVICE_URL}/mcp" \
    "200" \
    "POST" \
    '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' \
    '-H "Accept: application/json, text/event-stream"'

# Test 5: MCP GET without session (should be 400, not 404)
test_endpoint "MCP GET (no session)" "${SERVICE_URL}/mcp" "400"

echo ""
echo "======================================================"
echo "  Test Results"
echo "======================================================"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! Deployment is working correctly.${NC}"
    echo ""
    echo "Your n8n Workflow Builder is ready to use!"
    echo "Health endpoint: ${SERVICE_URL}/health"
    echo "MCP endpoint: ${SERVICE_URL}/mcp"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please check the deployment.${NC}"
    echo ""
    echo "Common issues:"
    echo "1. Service not fully started yet - wait 30 seconds and try again"
    echo "2. Environment variables not set correctly"
    echo "3. Check Railway logs for startup errors"
    echo ""
    echo "For more help, see:"
    echo "- RAILWAY_502_FIX.md"
    echo "- TROUBLESHOOTING.md"
    echo "- RAILWAY_DEPLOYMENT_CHECKLIST.md"
    exit 1
fi
