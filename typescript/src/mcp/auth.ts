/**
 * Parse WWW-Authenticate header to check if it contains OAuth challenge parameters.
 * Returns true if the header appears to be an OAuth Bearer challenge.
 */
export function parseWWWAuthenticate(header: string): boolean {
  // Check if it's a Bearer challenge
  if (!header.toLowerCase().startsWith("bearer")) {
    return false;
  }

  // OAuth Bearer challenges typically contain error, error_description, or scope
  return /\b(error|scope|realm)\s*=/i.test(header);
}

/**
 * Add or override resource_metadata in WWW-Authenticate header.
 */
export function addResourceMetadata(header: string, resource: string): string {
  const trimmed = header.trim();

  // If resource_metadata already exists, replace it
  if (/resource_metadata\s*=/i.test(trimmed)) {
    return trimmed.replace(
      /resource_metadata\s*=\s*"[^"]*"/gi,
      `resource_metadata="${resource}"`,
    );
  }

  // Add resource_metadata to the header
  // Format: Bearer error="...", resource_metadata="..."
  // If header ends with quotes, add comma and parameter
  // Otherwise just append it
  if (trimmed.endsWith('"') || trimmed.endsWith("'")) {
    return `${trimmed}, resource_metadata="${resource}"`;
  }

  // If there are existing parameters, add comma
  if (trimmed.includes("=")) {
    return `${trimmed}, resource_metadata="${resource}"`;
  }

  // Otherwise, add it after "Bearer"
  return `${trimmed} resource_metadata="${resource}"`;
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
    // Fallback for non-URL resource values; keep behavior predictable.
    return `${resource.replace(/\/+$/, "")}/.well-known/oauth-protected-resource`;
  }
}
