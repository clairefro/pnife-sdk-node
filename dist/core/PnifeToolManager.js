"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PnifeToolManager = void 0;
const validateTool_1 = require("../validators/validateTool");
class PnifeToolManager {
    constructor(tools) {
        this._tools = [];
        this._tools = tools;
    }
    get tools() {
        return this._tools; // Always fetch from the tool manager
    }
    addTool(tool) {
        (0, validateTool_1.validateTool)(tool);
        this._tools.push(tool);
    }
    removeTool(toolName) {
        const filtered = this._tools.filter((tool) => tool.name !== toolName);
        if (filtered.length === this._tools.length) {
            console.warn(`No tool with name '${toolName}' found`);
        }
        this._tools = filtered;
    }
    getTool(toolName) {
        const tool = this._tools.find((t) => t.name === toolName);
        if (!tool)
            throw new Error(`Tool '${toolName}' not found.`);
        return tool;
    }
    setTools(tools) {
        this._tools = tools;
    }
    validateUniqueToolNames() {
        const toolNames = this._tools.map((tool) => tool.name);
        const duplicates = toolNames.filter((name, index) => toolNames.indexOf(name) !== index);
        if (duplicates.length > 0) {
            throw new Error(`Duplicate tool names found: ${duplicates.join(", ")}`);
        }
    }
    interpolateInstructions(instructions, vars) {
        return instructions.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            if (!(key in vars))
                throw new Error(`Missing required variable: ${key}`);
            return vars[key];
        });
    }
    validateRequiredVars(reqVars, providedVars) {
        let missing = [];
        reqVars.forEach((rVar) => {
            if (!(rVar in providedVars)) {
                missing.push(rVar);
            }
        });
        if (missing.length) {
            throw new Error(`Missing required variables: ${missing.join(", ")}`);
        }
    }
}
exports.PnifeToolManager = PnifeToolManager;
