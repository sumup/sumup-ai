export function serializeToolResult(value: unknown): string {
  const seen = new WeakSet<object>();

  try {
    return JSON.stringify(
      value,
      (_key, current: unknown) => {
        if (typeof current === "bigint") {
          return current.toString();
        }

        if (current instanceof Error) {
          return {
            name: current.name,
            message: current.message,
            stack: current.stack,
          };
        }

        if (typeof current === "object" && current !== null) {
          if (seen.has(current)) {
            return "[Circular]";
          }
          seen.add(current);
        }

        return current;
      },
      2,
    );
  } catch (error) {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}`;
    }

    return String(value);
  }
}
