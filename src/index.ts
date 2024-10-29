// Modules
import { PnifeFileManager } from "./core/PnifeFileManager";
import { PnifeToolManager } from "./core/PnifeToolManager";
import { PnifeModelManager } from "./core/PnifeModelManager";
import { PnifeToolRunner } from "./core/PnifeToolRunner";

// Utils
import { generatePnifeName } from "./util/generatePnifeName";

// Types
import {
  PnifeI,
  PnifeOptions,
  ToolOutput,
  Model,
  Tool,
  PnifeFileJson,
} from "./types";

export class Pnife implements PnifeI {
  private toolManager: PnifeToolManager;
  private fileManager: PnifeFileManager;
  private modelManager: PnifeModelManager;
  private toolRunner: PnifeToolRunner;

  name: string;

  constructor(opts: PnifeOptions = {}) {
    this.name = opts.name || generatePnifeName();

    this.fileManager = new PnifeFileManager(opts.pnifeFilePath);
    this.toolManager = new PnifeToolManager([]);
    this.modelManager = new PnifeModelManager();
    this.toolRunner = new PnifeToolRunner(this.modelManager, this.toolManager);

    if (opts.pnifeFilePath) {
      const { name, tools } = this.file.load(opts.pnifeFilePath);
      this.import({ name, tools });
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

  async use(toolName: string, input: string, vars = {}): Promise<ToolOutput> {
    return this.toolRunner.use(toolName, input, vars);
  }

  interpolateInstructions(toolName: string, vars: {}) {
    const tool = this.toolManager.getTool(toolName);
    return this.toolRunner.interpolateInstructions(tool, vars);
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
  // --- MODELS  ---
  // ==========================

  get models() {
    return {
      add: (model: Model): void => {
        this.modelManager.addModel(model);
      },
      remove: (platform: string, modelName: string): void => {
        this.modelManager.removeModel(platform, modelName);
      },
      get: (platform: string, modelName: string): Model => {
        return this.modelManager.getModel(platform, modelName);
      },
      update: (platform: string, modelName: string, updated = {}): void => {
        this.modelManager.updateModel(platform, modelName, updated);
      },
      getActive: (): Model | undefined => {
        return this.modelManager.getActiveModel();
      },
      setActive: (platform: string, modelName: string): void => {
        this.modelManager.setActiveModel(platform, modelName);
      },
      list: () => {
        return this.modelManager.listModels();
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

  import(pnifeJson: PnifeFileJson): void {
    const { name, tools } = pnifeJson;
    this.name = name;
    this.toolManager.setTools(tools);
  }
}
