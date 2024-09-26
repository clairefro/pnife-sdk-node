import fs from "fs";
import path from "path";

import { Pnife } from "../";

import { DEFAULT_PNIFE_NAME } from "../constants";

// < > load fixtures ----------------------------------------------------
const fixturesPath = path.join(__dirname, "__fixtures__");
const validPnifeFilePath = path.join(fixturesPath, "valid.pnife.json");
const emptyToolsPnifeFilePath = path.join(
  fixturesPath,
  "empty.tools.pnife.json"
);
const invalidFilePath = path.join(fixturesPath, "i.dont.exist.pnife.json");

const validPnifeFileContent = JSON.parse(
  fs.readFileSync(validPnifeFilePath, "utf-8")
);

// </> load fixtures ----------------------------------------------------

describe("Pnife class", () => {
  describe("constructor", () => {
    it("initializes with default name and empty tools if no path provided", () => {
      const pnife = new Pnife();
      const pattern = new RegExp(`^${DEFAULT_PNIFE_NAME}`);
      expect(pnife.name).toMatch(pattern);
      expect(pnife.tools).toEqual([]);
    });

    it("initializes with provided name and empty tools", () => {
      const NAME = "foo";
      const pnife = new Pnife({ name: NAME });
      expect(pnife.name).toEqual(NAME);
      expect(pnife.tools).toEqual([]);
    });

    it("initializes from file with tools if valid path is provided", () => {
      const pnife = new Pnife({ pnifeFilePath: validPnifeFilePath });

      expect(pnife.tools).toEqual(validPnifeFileContent.tools);
      expect(pnife.name).toEqual(validPnifeFileContent.name);
    });

    it("initializes from file with no tools if valid path is provided", () => {
      const pnife = new Pnife({ pnifeFilePath: emptyToolsPnifeFilePath });

      expect(pnife.tools).toEqual([]);
    });

    it("throws an error if invalid pnifeFilePath provided", () => {
      expect(() => new Pnife({ pnifeFilePath: invalidFilePath })).toThrow();
    });
  });

  describe.skip("pnife file management", () => {
    it("should load pnife from a valid pnife.json file", () => {
      const pnife = new Pnife({ pnifeFilePath: validPnifeFilePath });

      expect(pnife.tools).toEqual(validPnifeFileContent.tools);
      expect(pnife.name).toEqual(validPnifeFileContent.name);
    });

    // TODO: IT SHOULD THROW ERROR IF INVALID PNIFE FILE PATH
    // it("should throw an error if the pnife.json file cannot be loaded", () => {
    //   const invalidFilePath = path.join(
    //     __dirname,
    //     "__fixtures__",
    //     "nonexistent.json"
    //   );
    //   const pnife = new Pnife({ configFilePath: invalidFilePath });

    //   expect(() => pnife.loadTools()).toThrow();
    // });

    // TODO: IT SHOULD THROW ERROR IF INVALID PNIFE FILE FORMAT
  });

  // pnife should initilaize with empty tools array and default name if no pnifeFilePath option is passed

  // pnife should load pnife to memory from pnife file if pnifeFilePath is passed

  // pnife should throw error if pnifeFilePath does not resolve to a valid pnife file
});
