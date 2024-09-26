import { validateTool } from "../validators/validateTool";

export class PnifeToolManager implements PnifeToolManagerI {
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
    this._tools = this._tools.filter((tool) => tool.name !== toolName);
  }

  getTool(toolName: string): Tool | undefined {
    return this._tools.find((tool) => tool.name === toolName);
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
}
