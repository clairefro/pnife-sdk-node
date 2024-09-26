import fs from "fs";
import path from "path";

import { Pnife } from "../";

// < > load fixtures ----------------------------------------------------
const fixturesPath = path.join(__dirname, "__fixtures__");
const validPnifeFilePath = path.join(fixturesPath, "valid.pnife.json");

const validPnifeFileContent = JSON.parse(
  fs.readFileSync(validPnifeFilePath, "utf-8")
);

// </> load fixtures ----------------------------------------------------

describe("Pnife class", () => {
  describe("loadTools()", () => {
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
