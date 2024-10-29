import { Pnife } from "..";
import dotenv from "dotenv";

dotenv.config();

// ------------------------------------

const run = async () => {
  const pnife = new Pnife();

  const tool = {
    name: "simplify",
    instructions: "simplify to one concise sentence",
  };

  pnife.tools.add(tool);

  const model = {
    platform: "openai",
    name: "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY,
  };

  pnife.models.add(model);
  console.log("models: ", pnife.models.list());
  console.log("active model: ", pnife.models.getActive());

  const sampleInput = `Quantum entanglement is a phenomenon in quantum mechanics where two or more particles become intertwined in such a way that the state of one particle cannot be described independently of the state of the other, even when separated by vast distances. This interconnectedness means that a change in the quantum state of one particle instantaneously affects the other, regardless of the distance between them, a concept that puzzled even Albert Einstein, who famously referred to it as "spooky action at a distance." Entanglement challenges classical intuitions about locality and causality, as it suggests that information can be shared between entangled particles faster than the speed of light. This phenomenon is central to many applications in quantum computing and quantum cryptography, where entangled particles are used to perform computations and transmit information in ways that are theoretically unbreakable by conventional means. However, the exact mechanism behind quantum entanglement remains one of the most debated and least understood aspects of quantum physics, sparking philosophical questions about the nature of reality and the limits of our understanding of the universe.`;

  console.log(pnife.tools);

  console.log(`using 'simplify'...`);
  const output = await pnife.use("simplify", sampleInput);
  console.log(`done`);

  console.log(output);
};

run();
