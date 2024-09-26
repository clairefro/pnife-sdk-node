import fs from "fs";
import path from "path";

import { validatePnife } from "../validators/validatePnife";

import { DEFAULT_PNIFE_FILE_NAME } from "../constants";

export class PnifeFileManager implements PnifeFileManagerI {
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

  readPnifeFile(path?: string): PnifeFileJson {
    const resolvedPath = path || this._pnifeFilePath;
    try {
      const data = fs.readFileSync(resolvedPath, "utf-8");
      const parsed = JSON.parse(data);
      validatePnife(parsed);
      return parsed;
    } catch (err: any) {
      throw new Error(
        `Failed to load pnife file to ${resolvedPath}: ${err.message}`
      );
    }
  }

  savePnifeFile(pnife: PnifeFileJson) {
    try {
      const data = JSON.stringify(pnife, null, 2);
      fs.writeFileSync(this._pnifeFilePath, data, "utf-8");
    } catch (err: any) {
      throw new Error(`Failed to save pnife file: ${err.message}`);
    }
  }

  savePnifeFileAs(pnifeData: PnifeFileJson, filePath: string) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(pnifeData, null, 2));
    } catch (err: any) {
      throw new Error(
        `Failed to save pnife file as '${filePath}': ${err.message}`
      );
    }
  }
}
