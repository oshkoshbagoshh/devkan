# devkan

TypeScript utilities for everyday development. Includes **Lorenipsem** placeholder text generation and a small `greet` helper.

## Install (for consumers)

```bash
npm install devkan
```

## Usage

### Lorenipsem

Generate classic-style filler text for layouts, fixtures, and demos:

```ts
import { lorenipsem } from "devkan";

// One paragraph (default)
lorenipsem();

// Twelve words, starting with "Lorem ipsum…"
lorenipsem({ count: 12, unit: "words" });

// Three sentences, deterministic
lorenipsem({ count: 3, unit: "sentences", seed: 42 });

// Two paragraphs without the classic opening
lorenipsem({ count: 2, unit: "paragraphs", startWithLorem: false });
```

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `count` | `number` | `1` | How many units to generate |
| `unit` | `"words" \| "sentences" \| "paragraphs"` | `"paragraphs"` | Unit of `count` |
| `startWithLorem` | `boolean` | `true` | Begin with the classic opening |
| `seed` | `number` | `Date.now()` | Seed for repeatable output |

### Greet

```ts
import { greet } from "devkan";

console.log(greet("AJ")); // "Hello, AJ"
```

## Development

```bash
npm install
npm test
npm run build
```
