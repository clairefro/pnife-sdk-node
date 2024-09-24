import fs from "fs";
import path from "path";

import { DEFAULT_PNIFE_FILE_NAME } from "../constants";

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

  loadPnifeFile(): PnifeFileJson {
    try {
      const data = fs.readFileSync(this._pnifeFilePath, "utf-8");
      return JSON.parse(data);
    } catch (err: any) {
      throw new Error(
        `Failed to load pnife file to ${this._pnifeFilePath}: ${err.message}`
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
