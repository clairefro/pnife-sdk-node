import { PnifeFileManager } from "./core/PnifeFileManager"; // FileManager import
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
    this.fileManager = new PnifeFileManager(opts.pnifeFilePath);
    this.toolManager = new PnifeToolManager([]);
    this.toolExecutor = new PnifeToolExecutor(opts.openAiApiKey || "");

    if (opts.pnifeFilePath) {
      const { name, tools } = this.file.load(opts.pnifeFilePath);
      this.name = name;
      this.toolManager.setTools(tools);
    }
  }

  // ==========================
  // --- TOOL MANAGEMENT ---
  // ==========================
  get tools() {
    return {
      add: (tool: Tool) => this.toolManager.addTool(tool),
      remove: (toolName: string) => this.toolManager.removeTool(toolName),
      get: (toolName: string) => this.toolManager.getTool(toolName),
      list: () => this.toolManager.tools,
    };
  }

  // ==========================
  // --- TOOL EXECUTION ---
  // ==========================

  async use(toolName: string, input: string, vars = {}) {
    const tool = this.tools.get(toolName) as Tool;
    return this.toolExecutor.use(tool, input, vars);
  }

  // =================================
  // --- PNIFE FILE MANAGEMENT ---
  // =================================
  get file() {
    return {
      path: () => this.fileManager.pnifeFilePath,
      setPath: (newPath: string) => this.fileManager.setPnifeFilePath(newPath),
      load: (path?: string) => {
        const pnifeJson = this.fileManager.readPnifeFile(path);
        this.toolManager.setTools(pnifeJson.tools);
        this.name = pnifeJson.name;
        return pnifeJson;
      },
      save: () => {
        const pnifeData = this.export();
        this.fileManager.savePnifeFile(pnifeData);
      },
      saveAs: (path: string) => {
        const pnifeData = this.export();
        this.fileManager.savePnifeFileAs(pnifeData, path);
      },
    };
  }

  // ==========================
  // --- OTHER  ---
  // ==========================
  export(): PnifeFileJson {
    return {
      name: this.name,
      tools: this.toolManager.tools,
    };
  }
}
