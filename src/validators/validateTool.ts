// TODO: sync with Tool interface definition, using typescript-json-schema
export function validateTool(obj: any): void {
  const errors: string[] = [];

  if (typeof obj.name !== "string") {
    errors.push("Tool property 'name' must be a string.");
  }

  if (typeof obj.instructions !== "string") {
    errors.push(
      `Tool '${obj.name}': Property 'instructions' must be a string.`
    );
  }

  if (obj.required_vars !== undefined) {
    if (!Array.isArray(obj.required_vars)) {
      errors.push(
        `Tool '${obj.name}': Property 'required_vars' must be an array.`
      );
    } else if (
      !obj.required_vars.every((item: any) => typeof item === "string")
    ) {
      errors.push(
        `Tool '${obj.name}': All elements in 'required_vars' must be strings.`
      );
    }
  }

  if (obj.description !== undefined) {
    if (typeof obj.description !== "string") {
      errors.push(
        `Tool '${obj.name}': Property 'description' must be a string.`
      );
    }
  }

  if (errors.length) {
    throw new Error(
      `Validation error: tool '${
        obj.name
      }' is not correctly formatted: ${errors.join("\n")}`
    );
  }

  return;
}
