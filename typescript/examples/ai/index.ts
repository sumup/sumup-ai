import { SumUpAgentToolkit } from "@sumup/agent-toolkit/ai";
import { generateText, stepCountIs } from "ai";

require("dotenv").config();

const sumupAgentToolkit = new SumUpAgentToolkit({
  apiKey: process.env.SUMUP_API_KEY!,
});

(async () => {
  const result = await generateText({
    model: "openai/gpt-4o",
    tools: sumupAgentToolkit.getTools(),
    stopWhen: stepCountIs(5),
    prompt: "Tell me about my last 5 transactions and their status.",
  });

  console.log(result);
})();
