import axios from "axios";

export class PnifeToolExecutor {
  constructor(private apiKey: string) {}

  interpolateInstructions(
    instructions: string,
    vars: { [key: string]: string }
  ) {
    return instructions.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      if (!(key in vars)) throw new Error(`Missing required variable: ${key}`);
      return vars[key];
    });
  }

  async use(tool: Tool, input: string, vars = {}) {
    if (tool.required_vars) {
      tool.required_vars.forEach((varName) => {
        if (!(varName in vars)) {
          throw new Error(`Missing required variable: ${varName}`);
        }
      });
    }

    const instructions = this.interpolateInstructions(tool.instructions, vars);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: instructions },
            { role: "user", content: input },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (err: any) {
      throw new Error(`Failed to call OpenAI API: ${err.message}`);
    }
  }
}
