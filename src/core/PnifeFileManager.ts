import fs from "fs";
import path from "path";

import { validatePnife } from "../validators/validatePnife";

import { DEFAULT_PNIFE_FILE_NAME } from "../constants";

import { PnifeFileJson } from "../types";

export class PnifeFileManager {
  private _pnifeFilePath: string;

  constructor(pnifeFilePath?: string) {
    this._pnifeFilePath =
      pnifeFilePath || path.join(process.cwd(), DEFAULT_PNIFE_FILE_NAME);
  }

  updatePnifeFilePath(newPath: string) {
    this._pnifeFilePath = newPath;
  }

  get pnifeFilePath(): string {
    return this._pnifeFilePath;
  }

  setPnifeFilePath(newPath: string) {
    this._pnifeFilePath = newPath;
  }

  get defaultPnifeFilePath(): string {
    return path.join(process.cwd(), DEFAULT_PNIFE_FILE_NAME);
  }

  readPnifeFile(path?: string): PnifeFileJson {
    const resolvedPath = path || this._pnifeFilePath;
    let data;
    try {
      data = fs.readFileSync(resolvedPath, "utf-8");
    } catch (err: any) {
      throw new Error(
        `Failed to load pnife file path: ${resolvedPath}: ${err.message}`
      );
    }

    try {
      const parsed = JSON.parse(data);
      validatePnife(parsed);
      return parsed;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  savePnifeFile(pnife: PnifeFileJson) {
    try {
      // TODO: VALIDATE PNIFE FILE
      const data = JSON.stringify(pnife, null, 2);
      fs.writeFileSync(this._pnifeFilePath, data, "utf-8");
    } catch (err: any) {
      throw new Error(`Failed to save pnife file: ${err.message}`);
    }
  }

  savePnifeFileAs(pnife: PnifeFileJson, path: string) {
    try {
      fs.writeFileSync(path, JSON.stringify(pnife, null, 2));
    } catch (err: any) {
      throw new Error(`Failed to save pnife file as '${path}': ${err.message}`);
    }
  }
}
