import { listCheckoutsParameters } from "./common/checkouts/parameters";

describe("list checkouts", () => {
  test.each([
    ["missing reference", {}, false],
    ["checkout reference", { checkout_reference: "order-123" }, true],
  ])("validates %s", (_scenario, input, success) => {
    expect(listCheckoutsParameters.safeParse(input).success).toBe(success);
  });
});
