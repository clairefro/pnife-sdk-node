import { PnifeFileManager } from "./core/PnifeFileManager"; // New FileManager import
import { PnifeToolManager } from "./core/PnifeToolManager";
import { PnifeToolExecutor } from "./core/PnifeToolExecutor";

import { generatePnifeName } from "./util/generatePnifeName";

export class Pnife implements PnifeI {
  private toolManager: PnifeToolManager;
  private fileManager: PnifeFileManager;
  private toolExecutor: PnifeToolExecutor;

  name: string;

  constructor(opts: PnifeOptions = {}) {
    this.name = opts.name || generatePnifeName();

    // TODO: handle scenario where no knife file present - intialize empty pnife pbj
    this.fileManager = new PnifeFileManager(opts.pnifeFilePath);
    this.toolManager = new PnifeToolManager([]);
    // TODO: MULTI-MODEL SUPPORT
    this.toolExecutor = new PnifeToolExecutor(opts.openAiApiKey || "");

    // override deafults with pnife file data, if pnifeFilePath option is passed
    if (opts.pnifeFilePath) {
      const { name, tools } = this.load(opts.pnifeFilePath);
      this.name = name;
      this.toolManager.setTools(tools);
    }
  }

  // ==========================
  // --- TOOL MANAGEMENT ---
  // ==========================
  get tools(): Tool[] {
    return this.toolManager.tools;
  }

  addTool(tool: Tool) {
    this.toolManager.addTool(tool);
  }

  removeTool(toolName: string) {
    this.toolManager.removeTool(toolName);
  }

  getTool(toolName: string): Tool {
    const tool = this.toolManager.tools.find((t) => t.name === toolName);
    if (!tool) throw new Error(`Tool '${toolName}' not found.`);
    return tool;
  }

  // ==========================
  //  --- TOOL EXECUTION ---
  // ==========================

  // uninterpolated
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

  load(path?: string): PnifeFileJson {
    const pnifeJson = this.read(path);
    this.toolManager.setTools(pnifeJson.tools);
    this.name = pnifeJson.name;
    return pnifeJson;
  }

  read(path?: string): PnifeFileJson {
    return this.fileManager.readPnifeFile(path);
  }

  // saves to this.pnifeFilePath
  save() {
    const pnifeData = this.export();
    this.fileManager.savePnifeFile(pnifeData);
  }

  saveAs(path: string) {
    const pnifeData = this.export();
    this.fileManager.savePnifeFileAs(pnifeData, path);
  }

  // =================================
  // -- OTHER ---
  //==================================
  export(): PnifeFileJson {
    return {
      name: this.name,
      tools: this.toolManager.tools,
    };
  }
}
