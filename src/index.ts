export function greet(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "Hello";
  return `Hello, ${trimmed}`;
}

