"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWorkflowSpec = validateWorkflowSpec;
function validateWorkflowSpec(input) {
    if (!input || typeof input !== 'object')
        return false;
    if (!Array.isArray(input.nodes))
        return false;
    for (const node of input.nodes) {
        if (typeof node !== 'object' || typeof node.type !== 'string' || typeof node.name !== 'string') {
            return false;
        }
    }
    // If connections are provided, they must be an array.
    if (input.connections && !Array.isArray(input.connections))
        return false;
    return true;
}
//# sourceMappingURL=validation.js.map