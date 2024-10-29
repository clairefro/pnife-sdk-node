import { validateTool } from "../validators/validateTool";

import { Tool } from "../types";
export class PnifeToolManager {
  private _tools: Tool[] = [];

  constructor(tools: Tool[]) {
    this._tools = tools;
  }

  get tools(): Tool[] {
    return this._tools; // Always fetch from the tool manager
  }

  addTool(tool: Tool) {
    validateTool(tool);
    this._tools.push(tool);
  }

  removeTool(toolName: string) {
    const filtered = this._tools.filter((tool) => tool.name !== toolName);
    if (filtered.length === this._tools.length) {
      throw new Error(`No tool with name '${toolName}' found`);
    }
    this._tools = filtered;
  }

  getTool(toolName: string): Tool {
    const tool = this._tools.find((t) => t.name === toolName);
    if (!tool) throw new Error(`Tool '${toolName}' not found.`);
    return tool;
  }

  setTools(tools: Tool[]): void {
    this._tools = tools;
  }

  validateUniqueToolNames() {
    const toolNames = this._tools.map((tool) => tool.name);
    const duplicates = toolNames.filter(
      (name, index) => toolNames.indexOf(name) !== index
    );
    if (duplicates.length > 0) {
      throw new Error(`Duplicate tool names found: ${duplicates.join(", ")}`);
    }
  }

  interpolateInstructions(
    instructions: string,
    vars: { [key: string]: string }
  ) {
    return instructions.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      if (!(key in vars)) throw new Error(`Missing required variable: ${key}`);
      return vars[key];
    });
  }

  validateRequiredVars(reqVars: string[], providedVars: {}) {
    let missing: string[] = [];

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
