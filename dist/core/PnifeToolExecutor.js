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
exports.PnifeToolExecutor = void 0;
const axios_1 = __importDefault(require("axios"));
class PnifeToolExecutor {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    interpolateInstructions(instructions, vars) {
        return instructions.replace(/\{\{(.*?)\}\}/g, (_, key) => {
            if (!(key in vars))
                throw new Error(`Missing required variable: ${key}`);
            return vars[key];
        });
    }
    use(tool_1, input_1) {
        return __awaiter(this, arguments, void 0, function* (tool, input, vars = {}) {
            if (tool.required_vars) {
                tool.required_vars.forEach((varName) => {
                    if (!(varName in vars)) {
                        throw new Error(`Missing required variable: ${varName}`);
                    }
                });
            }
            const instructions = this.interpolateInstructions(tool.instructions, vars);
            try {
                const response = yield axios_1.default.post("https://api.openai.com/v1/chat/completions", {
                    model: "gpt-4",
                    messages: [
                        { role: "system", content: instructions },
                        { role: "user", content: input },
                    ],
                }, {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data.choices[0].message.content;
            }
            catch (err) {
                throw new Error(`Failed to call OpenAI API: ${err.message}`);
            }
        });
    }
}
exports.PnifeToolExecutor = PnifeToolExecutor;
