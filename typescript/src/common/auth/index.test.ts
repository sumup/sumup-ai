import {
  constructResourceMetadata,
  parseWWWAuthenticate,
  parseWWWAuthenticateChallenges,
} from "./index";

describe("auth helpers", () => {
  test("returns undefined for malformed authenticate header", () => {
    expect(parseWWWAuthenticateChallenges("")).toBeUndefined();
    expect(parseWWWAuthenticateChallenges(",")).toBeUndefined();
    expect(
      parseWWWAuthenticateChallenges('Scheme, realm="foo"'),
    ).toBeUndefined();
    expect(parseWWWAuthenticateChallenges('Scheme realm="unterminated')).toBe(
      undefined,
    );
  });

  test("parses case-insensitive scheme and parameter names", () => {
    expect(parseWWWAuthenticateChallenges('SCHEME REALM="foo"')).toEqual([
      { scheme: "scheme", parameters: { realm: "foo" } },
    ]);
  });

  test("parses quoted and unquoted params and ignores extra commas", () => {
    expect(
      parseWWWAuthenticateChallenges(
        'Digest realm="test", qop=auth, nonce="abc123",, ,',
      ),
    ).toEqual([
      {
        scheme: "digest",
        parameters: { realm: "test", qop: "auth", nonce: "abc123" },
      },
    ]);
  });

  test("duplicate params are overwritten by later entries", () => {
    expect(
      parseWWWAuthenticateChallenges('Scheme realm="foo", realm="bar"'),
    ).toEqual([{ scheme: "scheme", parameters: { realm: "bar" } }]);
  });

  test("parses escaped quoted-string values", () => {
    expect(
      parseWWWAuthenticateChallenges(
        'Bearer error="invalid_token", error_description="The token was \\"tampered\\""',
      ),
    ).toEqual([
      {
        scheme: "bearer",
        parameters: {
          error: "invalid_token",
          error_description: 'The token was "tampered"',
        },
      },
    ]);
  });

  test("parses token68 challenges", () => {
    expect(
      parseWWWAuthenticateChallenges(
        'NTLS Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGE=, Scheme realm="foobar"',
      ),
    ).toEqual([
      {
        scheme: "ntls",
        parameters: {},
        token68: "Y2hhbGxlbmdlIHdpdGggYmFzZTY0IGRhdGE=",
      },
      { scheme: "scheme", parameters: { realm: "foobar" } },
    ]);
  });

  test("detects OAuth bearer challenge", () => {
    expect(parseWWWAuthenticate('Bearer error="invalid_token"')).toBe(true);
    expect(parseWWWAuthenticate('Bearer scope="payments:read"')).toBe(true);
    expect(
      parseWWWAuthenticate(
        'Basic realm="example", Bearer error="invalid_token"',
      ),
    ).toBe(true);
  });

  test("ignores non-bearer authenticate challenge", () => {
    expect(parseWWWAuthenticate('Basic realm="example"')).toBe(false);
    expect(parseWWWAuthenticate("not-a-valid-header")).toBe(false);
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

  test("parses multiple authenticate challenges", () => {
    const parsed = parseWWWAuthenticateChallenges(
      'Basic realm="example", Bearer scope="payments:read"',
    );

    expect(parsed).toEqual([
      { scheme: "basic", parameters: { realm: "example" } },
      { scheme: "bearer", parameters: { scope: "payments:read" } },
    ]);
  });

  test("fallback metadata derivation works for non-URL resources", () => {
    expect(constructResourceMetadata("sumup-resource")).toBe(
      "sumup-resource/.well-known/oauth-protected-resource",
    );
  });
});
