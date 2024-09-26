interface PnifeOptions {
  openAiApiKey?: string;
  pnifeFilePath?: string;
  name?: string;
}

interface Tool {
  name: string;
  instructions: string;
  required_vars?: string[];
}

interface PnifeI {
  pnifeFilePath: string;

  name: string;
  tools: Tool[];

  addTool(tool: Tool): void;
  removeTool(toolName: string): void;
  getTool(toolName: string): Tool;

  getInstructionsRaw(toolName: string): string;
  getInstructions(toolName: string, vars?: { [key: string]: string }): string;

  use(
    toolName: string,
    input: string,
    vars?: Record<string, any>
  ): Promise<string>;

  setPnifeFilePath(newPath: string): void;
  export(): PnifeFileJson;
  load(): PnifeFileJson;
  save(): void;
  saveAs(filePath: string): void;
}

interface PnifeFileJson {
  name: string;
  tools: Tool[];
}

interface PnifeToolManagerI {}

interface Model {}

interface ModelAdapter {
  callModel(
    instructions: string,
    input: string,
    apiKey?: string
  ): Promise<string>;
}

// shim third party libs without types

declare module "short-uuid" {
  const value: any;
  export default value;
}
