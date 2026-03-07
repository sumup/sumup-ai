/**
 * Portions of the `parseWWWAuthenticateChallenges` implementation are adapted from:
 * https://raw.githubusercontent.com/panva/oauth4webapi/refs/heads/main/src/index.ts
 *
 * oauth4webapi license: MIT License
 * Copyright (c) 2022 Filip Skokan
 */

export interface WWWAuthenticateChallengeParameters {
  readonly realm?: string;
  readonly error?: string;
  readonly error_description?: string;
  readonly error_uri?: string;
  readonly algs?: string;
  readonly scope?: string;
  readonly resource_metadata?: string;
  readonly [parameter: Lowercase<string>]: string | undefined;
}

export interface WWWAuthenticateChallenge {
  readonly scheme: Lowercase<string>;
  readonly parameters: WWWAuthenticateChallengeParameters;
  readonly token68?: string;
}

type MutableWWWAuthenticateChallengeParameters = Record<
  Lowercase<string>,
  string | undefined
>;

const tokenMatch = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+";
const token68Match = "[a-zA-Z0-9\\-\\._\\~\\+\\/]+={0,2}";
const quotedMatch = '"((?:[^"\\\\]|\\\\[\\s\\S])*)"';

const quotedParamMatcher = `(${tokenMatch})\\s*=\\s*${quotedMatch}`;
const paramMatcher = `(${tokenMatch})\\s*=\\s*(${tokenMatch})`;

const schemeRE = new RegExp(`^[,\\s]*(${tokenMatch})`);
const quotedParamRE = new RegExp(`^[,\\s]*${quotedParamMatcher}[,\\s]*(.*)`);
const unquotedParamRE = new RegExp(`^[,\\s]*${paramMatcher}[,\\s]*(.*)`);
const token68ParamRE = new RegExp(`^(${token68Match})(?:$|[,\\s])(.*)`);

/**
 * Parses a raw WWW-Authenticate header value into challenge objects.
 * Returns undefined for invalid headers.
 */
export function parseWWWAuthenticateChallenges(
  header: string,
): WWWAuthenticateChallenge[] | undefined {
  const challenges: WWWAuthenticateChallenge[] = [];

  let rest: string | undefined = header;
  while (rest) {
    const match: RegExpMatchArray | null = rest.match(schemeRE);
    if (!match) {
      return undefined;
    }
    const scheme = match[1].toLowerCase() as Lowercase<string>;

    const afterScheme = rest.slice(match[0].length);
    if (afterScheme && !/^[\s,]/.test(afterScheme)) {
      return undefined;
    }

    const spaceMatch = afterScheme.match(/^\s+(.*)$/);
    const hasParameters = !!spaceMatch;
    rest = spaceMatch ? spaceMatch[1] : undefined;

    const parameters: MutableWWWAuthenticateChallengeParameters = {};
    let token68: string | undefined;

    if (hasParameters) {
      while (rest) {
        let key: string;
        let value: string;
        const quotedMatchResult = rest.match(quotedParamRE);

        if (quotedMatchResult) {
          [, key, value, rest] = quotedMatchResult;

          if (value.includes("\\")) {
            try {
              value = JSON.parse(`"${value}"`);
            } catch {
              // Keep original parsed value when unescaping fails.
            }
          }

          parameters[key.toLowerCase() as Lowercase<string>] = value;
          continue;
        }

        const unquotedMatchResult = rest.match(unquotedParamRE);
        if (unquotedMatchResult) {
          [, key, value, rest] = unquotedMatchResult;
          parameters[key.toLowerCase() as Lowercase<string>] = value;
          continue;
        }

        const token68MatchResult = rest.match(token68ParamRE);
        if (token68MatchResult) {
          if (Object.keys(parameters).length) {
            break;
          }
          [, token68, rest] = token68MatchResult;
          break;
        }

        return undefined;
      }
    } else {
      rest = afterScheme || undefined;
    }

    const challenge: WWWAuthenticateChallenge = {
      scheme,
      parameters,
      token68,
    };

    challenges.push(challenge);
  }

  return challenges.length ? challenges : undefined;
}

/**
 * Returns true if the header contains a Bearer challenge.
 */
export function parseWWWAuthenticate(header: string): boolean {
  const challenges = parseWWWAuthenticateChallenges(header);
  return (
    challenges?.some((challenge) => challenge.scheme === "bearer") ?? false
  );
}

function quoteHeaderValue(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function stringifyChallenge(challenge: WWWAuthenticateChallenge): string {
  const parameterEntries = Object.entries(challenge.parameters);
  const parameters = parameterEntries
    .map(([key, value]) => `${key}=${quoteHeaderValue(value ?? "")}`)
    .join(", ");

  if (challenge.token68) {
    return `${challenge.scheme} ${challenge.token68}`;
  }

  if (parameters.length > 0) {
    return `${challenge.scheme} ${parameters}`;
  }

  return challenge.scheme;
}

export function stringifyWWWAuthenticateChallenges(
  challenges: WWWAuthenticateChallenge[],
): string {
  return challenges.map(stringifyChallenge).join(", ");
}

/**
 * Build MCP `resource_metadata` URL from an OAuth resource URL.
 * Per MCP protected-resource metadata discovery, this resolves
 * "/.well-known/oauth-protected-resource" at the resource origin.
 */
export function constructResourceMetadata(
  resource?: string,
): string | undefined {
  if (!resource) {
    return undefined;
  }

  try {
    return new URL(
      "/.well-known/oauth-protected-resource",
      resource,
    ).toString();
  } catch {
    return `${resource.replace(/\/+$/, "")}/.well-known/oauth-protected-resource`;
  }
}
