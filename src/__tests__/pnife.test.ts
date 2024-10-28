import fs from "fs";
import path from "path";

import { Pnife } from "../";

import { DEFAULT_PNIFE_NAME, DEFAULT_PNIFE_FILE_NAME } from "../constants";
import { validatePnife } from "../validators/validatePnife";

// LOAD FIXTURES =============================================================
const fixturesPath = path.join(__dirname, "__fixtures__");
const validPnifeFilePath = path.join(fixturesPath, "valid.pnife.json");
const tempPnifeFilePath = path.join(fixturesPath, "temp.pnife.json");
const emptyToolsPnifeFilePath = path.join(
  fixturesPath,
  "empty.tools.pnife.json"
);
const invalidFilePath = path.join(fixturesPath, "i.dont.exist.pnife.json");

const validPnifeFileContent = JSON.parse(
  fs.readFileSync(validPnifeFilePath, "utf-8")
);
// ========================================================================

describe("Pnife class", () => {
  // CONSTRUCTOR --------------------------------------------------------
  describe("constructor", () => {
    it("initializes with default name and empty tools if no path provided", () => {
      const pnife = new Pnife();
      const pattern = new RegExp(`^${DEFAULT_PNIFE_NAME}`);
      expect(pnife.name).toMatch(pattern);
      expect(pnife.tools.list()).toEqual([]);
    });

    it("initializes with provided name and empty tools", () => {
      const NAME = "foo";
      const pnife = new Pnife({ name: NAME });
      expect(pnife.name).toEqual(NAME);
      expect(pnife.tools.list()).toEqual([]);
    });

    it("initializes from file with tools if valid path is provided", () => {
      const pnife = new Pnife({ pnifeFilePath: validPnifeFilePath });

      expect(pnife.tools.list()).toEqual(validPnifeFileContent.tools);
      expect(pnife.name).toEqual(validPnifeFileContent.name);
    });

    it("initializes from file with no tools if valid path is provided", () => {
      const pnife = new Pnife({ pnifeFilePath: emptyToolsPnifeFilePath });

      expect(pnife.tools.list()).toEqual([]);
    });

    it("throws an error if invalid pnifeFilePath provided", () => {
      expect(() => new Pnife({ pnifeFilePath: invalidFilePath })).toThrow();
    });
  });

  // =============================================================================
  describe("pnife.file", () => {
    it("throws an error if the pnife.json file cannot be loaded", () => {
      const invalidFilePath = path.join(
        __dirname,
        "__fixtures__",
        "nonexistent.json"
      );

      expect(() => new Pnife({ pnifeFilePath: invalidFilePath })).toThrow();
    });

    it("throws an error if the pnife file exists but it not in correct format", () => {
      const invalidPnifePath = path.join(
        __dirname,
        "__fixtures__",
        "invalid.pnife.json"
      );

      expect(() => new Pnife({ pnifeFilePath: invalidPnifePath })).toThrow();
    });

    it("saves pnife to default path, with default name", () => {
      const pnife = new Pnife();
      expect(() => pnife.file.save()).not.toThrow();

      const loadedPnife = JSON.parse(
        fs.readFileSync(DEFAULT_PNIFE_FILE_NAME, "utf-8")
      );
      expect(loadedPnife.name).toMatch(DEFAULT_PNIFE_NAME);
      expect(() => validatePnife(loadedPnife)).not.toThrow();

      // cleanup: delete pnife file
      fs.unlinkSync(pnife.file.path());
    });

    it("saves pnife to provided path, if pnife file path configured", () => {
      const pnife = new Pnife();

      pnife.file.setPath(tempPnifeFilePath);

      expect(() => pnife.file.save()).not.toThrow();

      const loadedPnife = JSON.parse(
        fs.readFileSync(tempPnifeFilePath, "utf-8")
      );
      expect(pnife.file.path()).toEqual(tempPnifeFilePath);
      expect(() => validatePnife(loadedPnife)).not.toThrow();
      expect(loadedPnife.name).toMatch(DEFAULT_PNIFE_NAME);

      // cleanup: delete pnife file
      fs.unlinkSync(tempPnifeFilePath);
    });

    it("saveAs to provided pnife file path", () => {
      const pnife = new Pnife();

      expect(() => pnife.file.saveAs(tempPnifeFilePath)).not.toThrow();

      const loadedPnife = JSON.parse(
        fs.readFileSync(tempPnifeFilePath, "utf-8")
      );
      expect(loadedPnife.name).toMatch(DEFAULT_PNIFE_NAME);
      expect(() => validatePnife(loadedPnife)).not.toThrow();

      // cleanup: delete pnife file
      fs.unlinkSync(tempPnifeFilePath);
    });

    it("save() overrides existing pnife file", () => {
      const pnife = new Pnife();

      pnife.file.save();

      let loadedPnife = JSON.parse(fs.readFileSync(pnife.file.path(), "utf-8"));
      expect(loadedPnife.tools).toHaveLength(0);

      const tool = {
        name: "test",
        instructions: "do something",
      };

      pnife.tools.add(tool);

      pnife.file.save();

      loadedPnife = JSON.parse(fs.readFileSync(pnife.file.path(), "utf-8"));
      expect(loadedPnife.tools).toHaveLength(1);
      expect(loadedPnife.tools[0].name).toBe(tool.name);
      expect(loadedPnife.tools[0].instructions).toBe(tool.instructions);

      // cleanup: delete pnife file
      fs.unlinkSync(pnife.file.path());
    });

    it("saveAs() overrides existing pnife file", () => {
      const pnife = new Pnife();

      pnife.file.saveAs(tempPnifeFilePath);

      let loadedPnife = JSON.parse(fs.readFileSync(tempPnifeFilePath, "utf-8"));
      expect(loadedPnife.tools).toHaveLength(0);

      const tool = {
        name: "test",
        instructions: "do something",
      };

      pnife.tools.add(tool);

      pnife.file.saveAs(tempPnifeFilePath);

      loadedPnife = JSON.parse(fs.readFileSync(tempPnifeFilePath, "utf-8"));
      expect(loadedPnife.tools).toHaveLength(1);
      expect(loadedPnife.tools[0].name).toBe(tool.name);
      expect(loadedPnife.tools[0].instructions).toBe(tool.instructions);

      // cleanup: delete pnife file
      fs.unlinkSync(tempPnifeFilePath);
    });
  });

  // =============================================================================

  describe("pnife.tools", () => {
    it("gets tools", () => {
      const pnife = new Pnife({ pnifeFilePath: validPnifeFilePath });

      expect(pnife.tools.list()).toEqual(validPnifeFileContent.tools);
    });

    it("gets a tool by name", () => {
      const pnife = new Pnife({ pnifeFilePath: validPnifeFilePath });

      expect(pnife.tools.get("simplify")).toEqual(
        validPnifeFileContent.tools[0]
      );
    });

    it("throws error if no tool found with provided name ", () => {
      const pnife = new Pnife({ pnifeFilePath: validPnifeFilePath });
      expect(() => pnife.tools.get("i-dont-exist")).toThrow();
    });

    it("lets you add tools", () => {
      const pnife = new Pnife();

      expect(pnife.tools.list()).toHaveLength(0);

      const TOOL1_NAME = "tool1";
      const tool1 = {
        name: TOOL1_NAME,
        instructions: "this is tool 1",
      };

      pnife.tools.add(tool1);

      expect(pnife.tools.list()).toHaveLength(1);
      expect(pnife.tools.list()[0].name).toBe(TOOL1_NAME);

      const TOOL2_NAME = "tool2";
      const tool2 = {
        name: TOOL2_NAME,
        instructions: "this is tool 2",
      };

      pnife.tools.add(tool2);

      expect(pnife.tools.list()).toHaveLength(2);
      expect(pnife.tools.list()[1].name).toBe(TOOL2_NAME);
    });

    it("removes tools", () => {
      const pnife = new Pnife({ pnifeFilePath: validPnifeFilePath });

      expect(pnife.tools.list()).toHaveLength(2);

      pnife.tools.remove("simplify");

      expect(pnife.tools.list()).toHaveLength(1);
    });

    it("logs a warning if you try to remove tool that doesn't exist", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

      const pnife = new Pnife({ pnifeFilePath: validPnifeFilePath });

      expect(pnife.tools.list()).toHaveLength(2);

      expect(() => pnife.tools.remove("foo")).not.toThrow();

      expect(warnSpy).toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it("throws error if you add an invalid tool", () => {
      const pnife = new Pnife();

      const invalidTool = { foo: "bar" } as any;

      expect(() => pnife.tools.add(invalidTool)).toThrow();
    });

    // TODO: CAN'T ADD TOOL WITH DUPLICATE NAME

    // TODO: TOOL EXECUTION (NO VARS)

    // TODO: TOOL EXECUTION: (WITH VARS)
  });
});
