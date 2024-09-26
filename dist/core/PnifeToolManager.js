"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PnifeToolManager = void 0;
const validateTool_1 = require("../validators/validateTool");
class PnifeToolManager {
    constructor(tools) {
        this._tools = [];
        this._tools = tools;
    }
    tools() {
        return this._tools; // Always fetch from the tool manager
    }
    addTool(tool) {
        (0, validateTool_1.validateTool)(tool);
        this._tools.push(tool);
    }
    removeTool(toolName) {
        this._tools = this._tools.filter((tool) => tool.name !== toolName);
    }
    getTool(toolName) {
        return this._tools.find((tool) => tool.name === toolName);
    }
    validateUniqueToolNames() {
        const toolNames = this._tools.map((tool) => tool.name);
        const duplicates = toolNames.filter((name, index) => toolNames.indexOf(name) !== index);
        if (duplicates.length > 0) {
            throw new Error(`Duplicate tool names found: ${duplicates.join(", ")}`);
        }
    }
}
exports.PnifeToolManager = PnifeToolManager;
