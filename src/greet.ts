/**
 * Simple greeting helper kept from the library boilerplate.
 */

export function greet(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "Hello";
  return `Hello, ${trimmed}`;
}
