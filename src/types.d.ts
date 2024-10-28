interface PnifeOptions {
  openAiApiKey?: string;
  pnifeFilePath?: string;
  name?: string;
}

interface PnifeFileJson {
  name: string;
  tools: Tool[];
}

interface Tool {
  name: string;
  instructions: string;
  description?: string;
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
  load(path?: string): PnifeFileJson;
  read(path?: string): PnifeFileJson;
  save(): void;
  saveAs(path: string): void;
}

interface PnifeToolManagerI {
  tools: Tool[];
  addTool(tool: Tool): void;
  removeTool(toolName: string): void;
  getTool(toolName: string): Tool | undefined;
  setTools(tools: Tool[]): void;

  validateUniqueToolNames(): void;
}

interface PnifeToolExecutorI {
  use(tool: Tool, input: string, vars: { [key: string]: string }): string;
  interpolateInstructions(
    instructions: string,
    vars: { [key: string]: string }
  ): string;
}

interface PnifeFileManagerI {
  pnifeFilePath: string;

  updatePnifeFilePath(newPath: string): void;
  setPnifeFilePath(newPath: string): void;

  readPnifeFile(path?: string): PnifeFileJson;
  savePnifeFile(pnife: PnifeFileJson): void;
  savePnifeFileAs(pnifeData: PnifeFileJson, filePath: string): void;
}
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
