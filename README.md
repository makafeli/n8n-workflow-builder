[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/makafeli-n8n-workflow-builder-badge.png)](https://mseep.ai/app/makafeli-n8n-workflow-builder)

# n8n Workflow Builder MCP Server

This project provides an MCP server for managing n8n workflows. It offers functionality to list, create, update, delete, activate, and deactivate workflows through a set of defined tools.

**Important:**  
This version exclusively supports **npm** for package management and running the server. (npx support will be reintroduced in a future update.)

## Requirements

- Node.js (v14+ recommended)
- npm

## Extensive Installation Guide

### 1. Clone the Repository

Clone the repository from your preferred source. For example:

```bash
git clone https://github.com/makafeli/n8n-workflow-builder.git
```

Then, navigate to the project directory:

```bash
cd /root/n8n-workflow-builder
```

### 2. Install Dependencies

Install the necessary dependencies using npm:

```bash
npm install
```

This command will download and install all required packages as defined in the `package.json` file.

### 3. Build and Test

For testing and getting the server online, use the following commands:

- **Build the project:**  
  This compiles the TypeScript files and produces the executable JavaScript in the `build` directory.
  
  ```bash
  npm run build
  ```

- **Start the MCP Server:**  
  Launch the server using:
  
  ```bash
  npm start
  ```

The server will start and connect via stdio. You can check the console to see messages confirming that the server has started correctly.

### 4. Deployment

For testing purposes and to get the server online, use the build and start commands mentioned above. This basic workflow (install, build, start) is currently the recommended method.

### 5. Additional Configuration

Server configuration for [Cline](https://cline.bot) is managed via the `cline_mcp_settings.json` file. Ensure that the following environment variables are correctly set:

- `N8N_HOST`: Your n8n API host URL.
- `N8N_API_KEY`: Your n8n API key.

Example configuration in `cline_mcp_settings.json`:

```json
{
  "n8n-workflow-builder": {
    "command": "node",
    "args": ["/root/n8n-workflow-builder/build/index.js"],
    "env": {
      "N8N_HOST": "https://n8n.io/api/v1/",
      "N8N_API_KEY": "YOUR_N8N_API_KEY_HERE"
    },
    "disabled": false,
    "alwaysAllow": [
      "create_workflow",
      "create_workflow_and_activate",
      "update_workflow",
      "activate_workflow",
      "deactivate_workflow",
      "get_workflow",
      "delete_workflow"
    ],
    "autoApprove": []
  }
}
```

## Available Features

### MCP Tools

The following tools are defined in the server and can be accessed through your MCP client:

#### Workflow Management
- **list_workflows**: Lists all workflows from n8n.
- **create_workflow**: Creates a new workflow in n8n.
- **get_workflow**: Retrieves a workflow by its ID.
- **update_workflow**: Updates an existing workflow.
- **delete_workflow**: Deletes a workflow by its ID.
- **activate_workflow**: Activates a workflow by its ID.
- **deactivate_workflow**: Deactivates a workflow by its ID.

#### Execution Management
- **list_executions**: Lists all workflow executions with optional filters.
- **get_execution**: Retrieves details of a specific execution by its ID.
- **delete_execution**: Deletes an execution by its ID.

### MCP Resources

The server also provides the following resources for more efficient context access:

#### Static Resources
- **/workflows**: List of all available workflows in the n8n instance
- **/execution-stats**: Summary statistics about workflow executions

#### Dynamic Resource Templates
- **/workflows/{id}**: Detailed information about a specific workflow
- **/executions/{id}**: Detailed information about a specific execution

## Troubleshooting

- Ensure you are using npm (this version does not support npx).
- If you encounter any issues, try cleaning the build directory and rebuilding:
  ```bash
  npm run clean && npm run build
  ```
- Verify that your environment variables in `cline_mcp_settings.json` are correct.

## Future Enhancements

- Reintroduction of npx support.
- Additional tools and workflow features.
- Further enhancements to deployment and scaling.

## License

This project is licensed under the MIT License.
