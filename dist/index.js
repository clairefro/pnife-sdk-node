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
const PnifeFileManager_1 = require("./core/PnifeFileManager"); // New FileManager import
const PnifeToolManager_1 = require("./core/PnifeToolManager");
const PnifeToolExecutor_1 = require("./core/PnifeToolExecutor");
const generatePnifeName_1 = require("./util/generatePnifeName");
class Pnife {
    constructor(opts = {}) {
        this.name = opts.name || (0, generatePnifeName_1.generatePnifeName)();
        // TODO: handle scenario where no knife file present - intialize empty pnife pbj
        this.fileManager = new PnifeFileManager_1.PnifeFileManager(opts.pnifeFilePath);
        // override deafults with pnife file data, if pnifeFilePath option is passed
        if (opts.pnifeFilePath) {
            const { name, tools } = this.load();
            this.name = name;
            this.toolManager = new PnifeToolManager_1.PnifeToolManager(tools);
        }
        else {
            // Initialize tool manager with an empty array if no file is loaded
            this.toolManager = new PnifeToolManager_1.PnifeToolManager([]);
        }
        // TODO: MULTI-MODEL SUPPORT
        this.toolExecutor = new PnifeToolExecutor_1.PnifeToolExecutor(opts.openAiApiKey || "");
        this.name = opts.name || this.name || (0, generatePnifeName_1.generatePnifeName)();
    }
    // ==========================
    // --- TOOL MANAGEMENT ---
    // ==========================
    tools() {
        return this.toolManager.tools();
    }
    addTool(tool) {
        this.toolManager.addTool(tool);
    }
    removeTool(toolName) {
        this.toolManager.removeTool(toolName);
    }
    getTool(toolName) {
        const tool = this.toolManager.tools().find((t) => t.name === toolName);
        if (!tool)
            throw new Error(`Tool '${toolName}' not found.`);
        return tool;
    }
    // ==========================
    //  --- TOOL EXECUTION ---
    // ==========================
    // uninterpolated instructions of a tool
    getInstructionsRaw(toolName) {
        const tool = this.getTool(toolName);
        return tool.instructions;
    }
    getInstructions(toolName, vars = {}) {
        const tool = this.getTool(toolName);
        return this.toolExecutor.interpolateInstructions(tool.instructions, vars);
    }
    use(toolName_1, input_1) {
        return __awaiter(this, arguments, void 0, function* (toolName, input, vars = {}) {
            const tool = this.getTool(toolName);
            return this.toolExecutor.use(tool, input, vars); // Delegate to the tool executor
        });
    }
    // =================================
    //  --- PNIFE FILE MANAGEMENT ---
    // =================================
    get pnifeFilePath() {
        return this.fileManager.pnifeFilePath;
    }
    setPnifeFilePath(newPath) {
        this.fileManager.setPnifeFilePath(newPath);
    }
    load() {
        return this.fileManager.loadPnifeFile();
    }
    // saves to this.pnifeFilePath
    save() {
        const pnifeData = this.export();
        this.fileManager.savePnifeFile(pnifeData);
    }
    saveAs(filePath) {
        const pnifeData = this.export();
        this.fileManager.savePnifeFileAs(pnifeData, filePath);
    }
    // =================================
    // -- OTHER ---
    //==================================
    export() {
        return {
            name: this.name,
            tools: this.toolManager.tools(),
        };
    }
}
exports.Pnife = Pnife;
