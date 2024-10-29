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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pnife = void 0;
// Modules
const PnifeFileManager_1 = require("./core/PnifeFileManager");
const PnifeToolManager_1 = require("./core/PnifeToolManager");
const PnifeModelManager_1 = require("./core/PnifeModelManager");
const PnifeToolRunner_1 = require("./core/PnifeToolRunner");
// Utils
const generatePnifeName_1 = require("./util/generatePnifeName");
class Pnife {
    constructor(opts = {}) {
        this.name = opts.name || (0, generatePnifeName_1.generatePnifeName)();
        this.fileManager = new PnifeFileManager_1.PnifeFileManager(opts.pnifeFilePath);
        this.toolManager = new PnifeToolManager_1.PnifeToolManager([]);
        this.modelManager = new PnifeModelManager_1.PnifeModelManager();
        this.toolRunner = new PnifeToolRunner_1.PnifeToolRunner(this.modelManager, this.toolManager);
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
            add: (tool) => this.toolManager.addTool(tool),
            remove: (toolName) => this.toolManager.removeTool(toolName),
            get: (toolName) => this.toolManager.getTool(toolName),
            list: () => this.toolManager.tools,
        };
    }
    // ==========================
    // --- TOOL EXECUTION ---
    // ==========================
    use(toolName_1, input_1) {
        return __awaiter(this, arguments, void 0, function* (toolName, input, vars = {}) {
            return this.toolRunner.use(toolName, input, vars);
        });
    }
    interpolateInstructions(toolName, vars) {
        const tool = this.toolManager.getTool(toolName);
        return this.toolRunner.interpolateInstructions(tool, vars);
    }
    // =================================
    // --- PNIFE FILE MANAGEMENT ---
    // =================================
    get file() {
        return {
            path: () => this.fileManager.pnifeFilePath,
            setPath: (newPath) => this.fileManager.setPnifeFilePath(newPath),
            load: (path) => {
                const pnifeJson = this.fileManager.readPnifeFile(path);
                this.toolManager.setTools(pnifeJson.tools);
                this.name = pnifeJson.name;
                return pnifeJson;
            },
            save: () => {
                const pnifeData = this.export();
                this.fileManager.savePnifeFile(pnifeData);
            },
            saveAs: (path) => {
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
            add: (model) => {
                this.modelManager.addModel(model);
            },
            remove: (platform, modelName) => {
                this.modelManager.removeModel(platform, modelName);
            },
            get: (platform, modelName) => {
                return this.modelManager.getModel(platform, modelName);
            },
            update: (platform, modelName, updated = {}) => {
                this.modelManager.updateModel(platform, modelName, updated);
            },
            getActive: () => {
                return this.modelManager.getActiveModel();
            },
            setActive: (platform, modelName) => {
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
    export() {
        return {
            name: this.name,
            tools: this.toolManager.tools,
        };
    }
}
exports.Pnife = Pnife;
