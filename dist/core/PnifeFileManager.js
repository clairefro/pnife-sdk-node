"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PnifeFileManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const validatePnife_1 = require("../validators/validatePnife");
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
    get defaultPnifeFilePath() {
        return path_1.default.join(process.cwd(), constants_1.DEFAULT_PNIFE_FILE_NAME);
    }
    readPnifeFile(path) {
        const resolvedPath = path || this._pnifeFilePath;
        let data;
        try {
            data = fs_1.default.readFileSync(resolvedPath, "utf-8");
        }
        catch (err) {
            throw new Error(`Failed to load pnife file path: ${resolvedPath}: ${err.message}`);
        }
        try {
            const parsed = JSON.parse(data);
            (0, validatePnife_1.validatePnife)(parsed);
            return parsed;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    savePnifeFile(pnife) {
        try {
            // TODO: VALIDATE PNIFE FILE
            const data = JSON.stringify(pnife, null, 2);
            fs_1.default.writeFileSync(this._pnifeFilePath, data, "utf-8");
        }
        catch (err) {
            throw new Error(`Failed to save pnife file: ${err.message}`);
        }
    }
    savePnifeFileAs(pnife, path) {
        try {
            fs_1.default.writeFileSync(path, JSON.stringify(pnife, null, 2));
        }
        catch (err) {
            throw new Error(`Failed to save pnife file as '${path}': ${err.message}`);
        }
    }
}
exports.PnifeFileManager = PnifeFileManager;
