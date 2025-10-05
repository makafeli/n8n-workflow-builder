#!/bin/bash

# Railway Deployment Verification Script
# This script checks if your Railway deployment is working

RAILWAY_URL="https://n8n-workflow-builder-production-8aa3.up.railway.app"

echo "🔍 Checking Railway Deployment..."
echo "URL: $RAILWAY_URL"
echo ""

# Check health endpoint
echo "1. Testing /health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$RAILWAY_URL/health" 2>&1)
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Health check PASSED"
    echo "   Response: $BODY"
else
    echo "❌ Health check FAILED"
    echo "   HTTP Code: $HTTP_CODE"
    echo "   Response: $BODY"
fi
echo ""

# Check root endpoint
echo "2. Testing root endpoint..."
ROOT_RESPONSE=$(curl -s -w "\n%{http_code}" "$RAILWAY_URL/" 2>&1)
HTTP_CODE=$(echo "$ROOT_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Root endpoint PASSED"
    echo "   HTTP Code: $HTTP_CODE"
else
    echo "❌ Root endpoint FAILED"
    echo "   HTTP Code: $HTTP_CODE"
fi
echo ""

# Summary
echo "📊 Deployment Summary:"
echo "   Service: n8n Workflow Builder"
echo "   Version: 0.10.3"
echo "   URL: $RAILWAY_URL"
echo ""
echo "🔗 Quick Links:"
echo "   • Health Check: $RAILWAY_URL/health"
echo "   • Main Page: $RAILWAY_URL/"
echo "   • Railway Dashboard: https://railway.app/dashboard"
echo ""
echo "💡 Tips:"
echo "   • If health check fails, check Railway logs"
echo "   • Set N8N_HOST and N8N_API_KEY in Railway for full functionality"
echo "   • Enable COPILOT with OPENAI_API_KEY for AI features"
