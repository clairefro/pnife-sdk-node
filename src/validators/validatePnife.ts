import { validateTool } from "./validateTool";

export function validatePnife(obj: any): void {
  const errors: string[] = [];

  if (!obj || typeof obj !== "object") {
    errors.push("Pnife is not an object.");
  }

  // Validate 'name' property is a string
  if (typeof obj?.name !== "string") {
    errors.push("Property 'name' must be a string.");
  }

  // Validate 'tools' property is an array of correctly formatted Tools
  if (!Array.isArray(obj?.tools)) {
    errors.push("Property 'tools' must be an array.");
  } else {
    obj.tools.forEach((tool: any) => {
      try {
        validateTool(tool);
      } catch (e: any) {
        errors.push(e.message);
      }
    });
  }

  if (errors.length) {
    throw new Error(
      `Validation error: pnife is not correctly formatted. ${errors.join("\n")}`
    );
  }

  return;
}
