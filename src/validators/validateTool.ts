// TODO: sync with Tool interface definition, using typescript-json-schema
export function validateTool(obj: any): void {
  const errors: string[] = [];

  if (typeof obj.name !== "string") {
    errors.push("Property 'name' must be a string.");
  }

  if (typeof obj.instructions !== "string") {
    errors.push("Property 'instructions' must be a string.");
  }

  if (obj.required_vars !== undefined) {
    if (!Array.isArray(obj.required_vars)) {
      errors.push("Property 'required_vars' must be an array.");
    } else if (
      !obj.required_vars.every((item: any) => typeof item === "string")
    ) {
      errors.push("All elements in 'required_vars' must be strings.");
    }
  }
  if (errors.length) {
    throw new Error(
      `Validation error: tool does not have required properties. ${errors.join(
        "\n"
      )}`
    );
  }

  return;
}