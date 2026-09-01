import "dotenv/config";
import { Agent, run, withTrace } from "@openai/agents";
import { SumUpAgentToolkit } from "@sumup/agent-toolkit/openai";

const sumupAgentToolkit = new SumUpAgentToolkit({
  apiKey: process.env.SUMUP_API_KEY!,
});

async function main() {
  const agent = new Agent({
    name: "Transactions reporter",
    instructions: "You are a helpful agent.",
    tools: sumupAgentToolkit.getTools(),
  });

  await withTrace("SumUp transactions example", async () => {
    const result = await run(agent, "tell me about my last 10 transactions");
    console.log(result.finalOutput);

    const messages = result.history;
    messages.push({
      role: "user",
      content: "tell me more about the last transaction",
    });

    const result2 = await run(agent, messages);
    console.log();
    console.log(result2.finalOutput);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
