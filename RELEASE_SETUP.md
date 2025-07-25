# 🚀 Release Setup Guide for n8n-workflow-builder

## ✅ Current Status

**GitHub Release v0.10.1**: ✅ **CREATED SUCCESSFULLY**
- **Release URL**: https://github.com/makafeli/n8n-workflow-builder/releases/tag/v0.10.1
- **Tag**: v0.10.1
- **Comprehensive Release Notes**: ✅ Included
- **GitHub Actions Workflows**: ✅ Configured

**NPM Publishing**: ⏳ **PENDING NPM_TOKEN SETUP**

## 🔧 Required Setup Steps

### 1. Create NPM Access Token

1. **Login to npm**: Go to https://www.npmjs.com/
2. **Navigate to Access Tokens**: Profile → Access Tokens
3. **Create New Token**:
   - **Type**: `Automation` (for CI/CD)
   - **Scope**: `Publish` (to publish packages)
   - **Copy the token** (you won't see it again!)

### 2. Add NPM_TOKEN to GitHub Secrets

1. **Go to Repository Settings**: https://github.com/makafeli/n8n-workflow-builder/settings/secrets/actions
2. **Click "New repository secret"**
3. **Name**: `NPM_TOKEN`
4. **Value**: Paste your npm access token
5. **Click "Add secret"**

### 3. Verify Package Configuration

The package is already properly configured:

```json
{
  "name": "@makafeli/n8n-workflow-builder",
  "version": "0.10.1",
  "publishConfig": {
    "access": "public"
  },
  "files": [
    "build/**/*",
    "README.md",
    "LICENSE"
  ]
}
```

## 🎯 Automated Publishing Process

Once NPM_TOKEN is configured, the publishing process is **fully automated**:

### Release Workflow (Already Running)
- ✅ **Tests**: Run comprehensive test suite (78 tests)
- ✅ **Build**: Compile TypeScript to JavaScript
- ✅ **Package**: Create npm package (16.6 kB compressed)
- ⏳ **Publish**: Publish to npm registry (waiting for NPM_TOKEN)

### What Happens After NPM_TOKEN Setup:
1. **Automatic Retry**: The release workflow will complete successfully
2. **NPM Publishing**: Package will be published to https://www.npmjs.com/package/@makafeli/n8n-workflow-builder
3. **Installation Available**: `npm install @makafeli/n8n-workflow-builder`

## 📦 Package Details

**Current Package Configuration**:
- **Name**: `@makafeli/n8n-workflow-builder`
- **Version**: `0.10.1`
- **Size**: 16.6 kB compressed, 111.2 kB unpacked
- **Files**: 47 files (build output, README, LICENSE)
- **Node.js**: >=18.0.0
- **Dependencies**: MCP SDK 1.17.0, Axios, Zod

## 🔍 Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
# 1. Ensure you're logged into npm
npm login

# 2. Build the package
npm run build

# 3. Verify package contents
npm pack --dry-run

# 4. Publish to npm
npm publish
```

## 🧪 Testing the Published Package

After publishing, test the package:

```bash
# Install globally
npm install -g @makafeli/n8n-workflow-builder

# Test the CLI
n8n-workflow-builder --help

# Or install locally in a project
npm install @makafeli/n8n-workflow-builder

# Use in Node.js
const { N8nWorkflowBuilder } = require('@makafeli/n8n-workflow-builder');
```

## 🚀 CI/CD Workflows Overview

### 1. **Continuous Integration** (`.github/workflows/ci.yml`)
- **Triggers**: Push to main/develop, Pull Requests
- **Tests**: Node.js 18, 20, 22
- **Security**: npm audit, vulnerability scanning
- **Build**: TypeScript compilation and verification

### 2. **Release and Publish** (`.github/workflows/release.yml`)
- **Triggers**: GitHub release published
- **Process**: Test → Build → Publish to npm
- **Authentication**: Uses NPM_TOKEN secret

### 3. **Create Release** (`.github/workflows/create-release.yml`)
- **Triggers**: Manual workflow dispatch
- **Process**: Version validation → Tag creation → Release creation

## 📊 Current Workflow Status

Check workflow status at: https://github.com/makafeli/n8n-workflow-builder/actions

**Latest Runs**:
- ✅ **Release Workflow**: Running (waiting for NPM_TOKEN)
- ❌ **CI Workflow**: Failed (expected - needs npm audit fix)

## 🎉 Next Steps

1. **Add NPM_TOKEN secret** (5 minutes)
2. **Verify npm publishing** (automatic)
3. **Test package installation** (2 minutes)
4. **Update documentation** with npm install instructions

After setup, the package will be available for installation worldwide! 🌍

## 📞 Support

If you encounter any issues:
1. Check GitHub Actions logs
2. Verify npm token permissions
3. Ensure package.json version matches release tag
4. Test local build with `npm run build`
