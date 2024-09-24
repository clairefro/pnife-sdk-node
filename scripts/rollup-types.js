// This script copies ambient type defintions used in development to the dist dir, adding export statements for interfaces and types

const fs = require("fs");
const path = require("path");

// Load tsconfig.json
const tsconfig = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);

// get outDir from tsconfig
const distDir = tsconfig.compilerOptions.outDir;

const distTypesDir = path.join(distDir, "types"); // Types directory based on outDir
const distTypesFile = path.join(distTypesDir, "index.d.ts");

const srcDir = path.join(__dirname, "../src");
const srcTypesFile = path.join(srcDir, "types.d.ts");

// Ensure the /dist types directory exists
if (!fs.existsSync(distTypesDir)) {
  fs.mkdirSync(distTypesDir, { recursive: true });
}

// Read the ambient type definitions in src
let typesContent = fs.readFileSync(srcTypesFile, "utf-8");

// Add "export" to each line that defines an interface or type
typesContent = typesContent
  .split("\n")
  .map((line) => {
    if (line.startsWith("interface") || line.startsWith("type")) {
      return line.replace(/^/, "export ");
    }
    return line;
  })
  .join("\n");

// Write the modified content to the destination file
fs.writeFileSync(distTypesFile, typesContent.trim() + "\n", "utf-8");

console.log(`Generated type definitions with exports to ${distTypesFile}`);
