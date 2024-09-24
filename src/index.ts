import { PnifeFileManager } from "./core/PnifeFileManager"; // New FileManager import
import { PnifeToolManager } from "./core/PnifeToolManager";
import { PnifeToolExecutor } from "./core/PnifeToolExecutor";

import { generatePnifeName } from "./util/generatePnifeName";

export class Pnife implements PnifeI {
  private toolManager: PnifeToolManager;
  private fileManager: PnifeFileManager;
  private toolExecutor: PnifeToolExecutor;

  private _name: string;

  constructor(opts: PnifeOptions = {}) {
    this._name = opts.name || generatePnifeName();

    // TODO: handle scenario where no knife file present - intialize empty pnife pbj
    this.fileManager = new PnifeFileManager(opts.pnifeFilePath);

    // override deafults with pnife file data, if pnifeFilePath option is passed
    if (opts.pnifeFilePath) {
      const { name, tools } = this.load();
      this._name = name;
      this.toolManager = new PnifeToolManager(tools);
    } else {
      // Initialize tool manager with an empty array if no file is loaded
      this.toolManager = new PnifeToolManager([]);
    }

    // TODO: MULTI-MODEL SUPPORT
    this.toolExecutor = new PnifeToolExecutor(opts.openAiApiKey || "");

    this._name = opts.name || this._name || generatePnifeName();
  }

  name() {
    return this._name;
  }

  // ==========================
  // --- TOOL MANAGEMENT ---
  // ==========================
  tools(): Tool[] {
    return this.toolManager.tools();
  }

  addTool(tool: Tool) {
    this.toolManager.addTool(tool);
  }

  removeTool(toolName: string) {
    this.toolManager.removeTool(toolName);
  }

  getTool(toolName: string): Tool {
    const tool = this.toolManager.tools().find((t) => t.name === toolName);
    if (!tool) throw new Error(`Tool '${toolName}' not found.`);
    return tool;
  }

  // ==========================
  //  --- TOOL EXECUTION ---
  // ==========================

  // uninterpolated instructions of a tool
  getInstructionsRaw(toolName: string): string {
    const tool = this.getTool(toolName);
    return tool.instructions;
  }

  getInstructions(
    toolName: string,
    vars: { [key: string]: string } = {}
  ): string {
    const tool = this.getTool(toolName);
    return this.toolExecutor.interpolateInstructions(tool.instructions, vars);
  }

  async use(toolName: string, input: string, vars = {}) {
    const tool = this.getTool(toolName);
    return this.toolExecutor.use(tool, input, vars); // Delegate to the tool executor
  }

  // =================================
  //  --- PNIFE FILE MANAGEMENT ---
  // =================================
  get pnifeFilePath(): string {
    return this.fileManager.pnifeFilePath;
  }

  setPnifeFilePath(newPath: string) {
    this.fileManager.setPnifeFilePath(newPath);
  }

  load(): PnifeFileJson {
    return this.fileManager.loadPnifeFile();
  }

  // saves to this.pnifeFilePath
  save() {
    const pnifeData = this.export();
    this.fileManager.savePnifeFile(pnifeData);
  }

  saveAs(filePath: string) {
    const pnifeData = this.export();
    this.fileManager.savePnifeFileAs(pnifeData, filePath);
  }

  // =================================
  // -- OTHER ---
  //==================================
  export(): PnifeFileJson {
    return {
      name: this._name,
      tools: this.toolManager.tools(),
    };
  }
}
