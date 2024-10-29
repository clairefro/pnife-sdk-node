import axios from "axios";

import { PnifeModelManager } from "./PnifeModelManager";
import { PnifeToolManager } from "./PnifeToolManager";

import { ToolOutput, Tool } from "../types";

export class PnifeToolRunner {
  modelManager: PnifeModelManager;
  toolManger: PnifeToolManager;

  constructor(modelManager: PnifeModelManager, toolManager: PnifeToolManager) {
    this.modelManager = modelManager;
    this.toolManger = toolManager;
  }

  async use(toolName: string, input: string, vars = {}): Promise<ToolOutput> {
    const tool = this.toolManger.getTool(toolName) as Tool;
    const instructions = this.interpolateInstructions(tool, vars);
    return this.callActiveModel({ instructions, input });
  }

  interpolateInstructions(tool: Tool, vars: { [key: string]: string }) {
    this._validateRequiredVars(tool, vars);
    return tool.instructions.replace(/\{\{(.*?)\}\}/g, (_, key) => vars[key]);
  }

  _validateRequiredVars(tool: Tool, vars: { [key: string]: string }): void {
    if (!tool.required_vars) return;
    const missingVars = tool.required_vars.filter((e) => !(e in vars));
    if (missingVars.length > 0) {
      throw new Error(`Missing required vars: ${missingVars.join(", ")}`);
    }
    return;
  }

  // Execution
  async callActiveModel({
    instructions,
    input,
  }: {
    instructions: string;
    input: string;
  }): Promise<ToolOutput> {
    // get current model with raw API key
    const _model = this.modelManager._getActiveModelUnsafe();
    if (!_model) {
      throw new Error("No active model selected. Please set an active model.");
    }

    // TODO: make model calling dynamic for various LLM platforms/ models. Allow custom overrides w callback?
    const messages = [
      { role: "system", content: instructions },
      { role: "user", content: input },
    ];

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: _model.name,
          messages: messages,
        },
        {
          headers: {
            Authorization: `Bearer ${_model.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      const output = response.data.choices[0].message.content;
      return { output };
    } catch (err: any) {
      throw new Error(`Failed to call API: ${err.message}`);
    }
  }
}
