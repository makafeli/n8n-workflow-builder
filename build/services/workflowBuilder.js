"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowBuilder = void 0;
const positioning_1 = require("../utils/positioning");
class WorkflowBuilder {
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.nextPosition = { x: 100, y: 100 };
    }
    addNode(node) {
        if (!node.position) {
            node.position = { ...this.nextPosition };
            this.nextPosition = (0, positioning_1.calculateNextPosition)(this.nextPosition);
        }
        this.nodes.push(node);
        return node;
    }
    connectNodes(connection) {
        this.connections.push(connection);
    }
    exportWorkflow() {
        return {
            nodes: this.nodes,
            connections: this.connections
        };
    }
}
exports.WorkflowBuilder = WorkflowBuilder;
//# sourceMappingURL=workflowBuilder.js.map