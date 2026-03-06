import {
  addResourceMetadata,
  constructResourceMetadata,
  parseWWWAuthenticate,
} from "./auth";

describe("auth helpers", () => {
  test("detects OAuth bearer challenge", () => {
    expect(parseWWWAuthenticate('Bearer error="invalid_token"')).toBe(true);
    expect(parseWWWAuthenticate('Bearer scope="payments:read"')).toBe(true);
  });

  test("ignores non-bearer authenticate challenge", () => {
    expect(parseWWWAuthenticate('Basic realm="example"')).toBe(false);
  });

  test("derives resource_metadata from resource when not provided", () => {
    expect(constructResourceMetadata("https://api.sumup.example")).toBe(
      "https://api.sumup.example/.well-known/oauth-protected-resource",
    );
  });

  test("derivation avoids double slash for resource ending with slash", () => {
    expect(constructResourceMetadata("https://api.sumup.example/")).toBe(
      "https://api.sumup.example/.well-known/oauth-protected-resource",
    );
  });

  test("derivation removes search/hash from URL resource", () => {
    expect(
      constructResourceMetadata("https://api.sumup.example/path/?q=1#part"),
    ).toBe("https://api.sumup.example/.well-known/oauth-protected-resource");
  });

  test("adds resource_metadata to bearer challenge", () => {
    const enhanced = addResourceMetadata(
      'Bearer error="invalid_token"',
      "https://auth.sumup.example/resource-metadata",
    );

    expect(enhanced).toBe(
      'Bearer error="invalid_token", resource_metadata="https://auth.sumup.example/resource-metadata"',
    );
  });

  test("overrides existing resource_metadata in bearer challenge", () => {
    const enhanced = addResourceMetadata(
      'Bearer error="invalid_token", resource_metadata="https://old.example/.well-known/oauth-protected-resource"',
      "https://new.example/.well-known/oauth-protected-resource",
    );

    expect(enhanced).toBe(
      'Bearer error="invalid_token", resource_metadata="https://new.example/.well-known/oauth-protected-resource"',
    );
  });
});
