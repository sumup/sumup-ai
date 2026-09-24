import type SumUp from "@sumup/sdk";
import { executeTool } from "../execute";
import { createCheckout } from "./tools";

test("creates hosted payment links without accepting payment or callback options", async () => {
  const create = rs
    .fn()
    .mockResolvedValue({ id: "checkout", status: "PENDING" });
  const sumup = { checkouts: { create } } as unknown as SumUp;
  const input = {
    merchant_code: "MTEST",
    checkout_reference: "order",
    amount: 12.34,
    currency: "EUR",
  } as const;
  await executeTool(createCheckout, sumup, input);
  expect(create).toHaveBeenCalledWith({
    ...input,
    hosted_checkout: { enabled: true },
  });

  const unsupportedInput = {
    ...input,
    return_url: "https://example.com/callback",
    hosted_checkout: { enabled: false },
  };
  await expect(
    executeTool(createCheckout, sumup, unsupportedInput),
  ).rejects.toThrow();
  expect(create).toHaveBeenCalledTimes(1);
});
