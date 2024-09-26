"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PnifeFileManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
class PnifeFileManager {
    constructor(pnifeFilePath) {
        this._pnifeFilePath =
            pnifeFilePath || path_1.default.join(process.cwd(), constants_1.DEFAULT_PNIFE_FILE_NAME);
    }
    updatePnifeFilePath(newPath) {
        this._pnifeFilePath = newPath;
    }
    get pnifeFilePath() {
        return this._pnifeFilePath;
    }
    setPnifeFilePath(newPath) {
        this._pnifeFilePath = newPath;
    }
    loadPnifeFile() {
        try {
            const data = fs_1.default.readFileSync(this._pnifeFilePath, "utf-8");
            return JSON.parse(data);
        }
        catch (err) {
            throw new Error(`Failed to load pnife file to ${this._pnifeFilePath}: ${err.message}`);
        }
    }
    savePnifeFile(pnife) {
        try {
            const data = JSON.stringify(pnife, null, 2);
            fs_1.default.writeFileSync(this._pnifeFilePath, data, "utf-8");
        }
        catch (err) {
            throw new Error(`Failed to save pnife file: ${err.message}`);
        }
    }
    savePnifeFileAs(pnifeData, filePath) {
        try {
            fs_1.default.writeFileSync(filePath, JSON.stringify(pnifeData, null, 2));
        }
        catch (err) {
            throw new Error(`Failed to save pnife file as '${filePath}': ${err.message}`);
        }
    }
}
exports.PnifeFileManager = PnifeFileManager;
