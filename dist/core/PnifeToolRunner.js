"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PnifeToolRunner = void 0;
const axios_1 = __importDefault(require("axios"));
class PnifeToolRunner {
    constructor(modelManager, toolManager) {
        this.modelManager = modelManager;
        this.toolManger = toolManager;
    }
    use(toolName_1, input_1) {
        return __awaiter(this, arguments, void 0, function* (toolName, input, vars = {}) {
            const tool = this.toolManger.getTool(toolName);
            const instructions = this.interpolateInstructions(tool, vars);
            return this.callActiveModel({ instructions, input });
        });
    }
    interpolateInstructions(tool, vars) {
        this._validateRequiredVars(tool, vars);
        return tool.instructions.replace(/\{\{(.*?)\}\}/g, (_, key) => vars[key]);
    }
    _validateRequiredVars(tool, vars) {
        if (!tool.required_vars)
            return;
        const missingVars = tool.required_vars.filter((e) => !(e in vars));
        if (missingVars.length > 0) {
            throw new Error(`Missing required vars: ${missingVars.join(", ")}`);
        }
        return;
    }
    // Execution
    callActiveModel(_a) {
        return __awaiter(this, arguments, void 0, function* ({ instructions, input, }) {
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
                const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
                    model: _model.name,
                    messages: messages,
                }, {
                    headers: {
                        Authorization: `Bearer ${_model.apiKey}`,
                        "Content-Type": "application/json",
                    },
                });
                const output = response.data.choices[0].message.content;
                return { output };
            }
            catch (err) {
                throw new Error(`Failed to call API: ${err.message}`);
            }
        });
    }
}
exports.PnifeToolRunner = PnifeToolRunner;
