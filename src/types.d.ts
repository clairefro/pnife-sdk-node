export interface PnifeOptions {
  openAiApiKey?: string;
  pnifeFilePath?: string;
  name?: string;
}

export interface PnifeFileJson {
  name: string;
  tools: Tool[];
}

export interface Tool {
  name: string;
  instructions: string;
  description?: string;
  required_vars?: string[];
}

export interface PnifeI {
  name: string;
  tools: {
    get: (toolName: string) => Tool;
    add: (tool: Tool) => void;
    remove: (toolName: string) => void;
    list: () => Tool[];
  };

  file: {
    path: () => string;
    setPath: (path: string) => void;
    load: (path?: string) => PnifeFileJson;
    save: () => void;
    saveAs: (path: string) => void;
  };

  models: {
    add: (model: Model) => void;
    remove: (platform: string, modelName: string) => void;
    get: (platform: string, modelName: string) => Model;
    getActive: (platform: string, modelName: string) => Model | undefined;
    update: (platform: string, modelName: string, updated: {}) => void;
    setActive: (platform: string, modelName: string) => void;
    list: () => Model[];
  };

  export: () => PnifeFileJson;
  import: (pnifeJson: PnifeFileJson) => void;

  use: (toolName: string, input: string, vars: {}) => Promise<ToolOutput>;
}

export interface Model {
  platform: string;
  name: string;
  apiKey?: string;
}

export interface ModelAdapter {
  callModel(
    instructions: string,
    input: string,
    apiKey?: string
  ): Promise<string>;
}

export interface ModelManagerI {}

export interface ToolOutput {
  output: string;
  meta?: any;
}
