/**
 * Lorenipsem — placeholder text generation for layouts and demos.
 *
 * Produces classic-style Latin filler text with configurable
 * word, sentence, or paragraph counts. Pass `seed` for stable output.
 */

export type LorenipsemUnit = "words" | "sentences" | "paragraphs";

export interface LorenipsemOptions {
  /** How many units to generate. Defaults to 1. */
  count?: number;
  /** Unit of `count`. Defaults to `"paragraphs"`. */
  unit?: LorenipsemUnit;
  /** Begin with the classic "Lorem ipsum dolor sit amet…" opening. Defaults to true. */
  startWithLorem?: boolean;
  /** Seed for deterministic, repeatable output. */
  seed?: number;
}

const WORD_BANK = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum"
] as const;

const CLASSIC_OPENING = [
  "Lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit"
] as const;

const MIN_SENTENCE_WORDS = 5;
const MAX_SENTENCE_WORDS = 14;
const MIN_PARAGRAPH_SENTENCES = 3;
const MAX_PARAGRAPH_SENTENCES = 6;

/**
 * Mulberry32 — tiny seeded PRNG for stable, testable text.
 */
function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

function capitalize(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function nextWord(rng: () => number): string {
  return WORD_BANK[randomInt(rng, 0, WORD_BANK.length - 1)]!;
}

function buildWords(
  rng: () => number,
  count: number,
  startWithLorem: boolean
): string[] {
  const words: string[] = [];
  if (startWithLorem) {
    for (const word of CLASSIC_OPENING) {
      if (words.length >= count) break;
      words.push(word);
    }
  }
  while (words.length < count) {
    words.push(nextWord(rng));
  }
  return words;
}

function wordsToSentence(words: string[]): string {
  if (words.length === 0) return "";
  const body = [capitalize(words[0]!), ...words.slice(1)].join(" ");
  return `${body}.`;
}

function buildSentence(
  rng: () => number,
  startWithLorem: boolean,
  remainingClassic: string[]
): string {
  const length = randomInt(rng, MIN_SENTENCE_WORDS, MAX_SENTENCE_WORDS);
  const words: string[] = [];

  while (words.length < length && remainingClassic.length > 0) {
    words.push(remainingClassic.shift()!);
  }
  while (words.length < length) {
    words.push(nextWord(rng));
  }

  if (startWithLorem && words[0] === "Lorem") {
    return `${words.join(" ")}.`;
  }
  return wordsToSentence(words);
}

function buildParagraph(
  rng: () => number,
  startWithLorem: boolean,
  remainingClassic: string[]
): string {
  const sentenceCount = randomInt(
    rng,
    MIN_PARAGRAPH_SENTENCES,
    MAX_PARAGRAPH_SENTENCES
  );
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(
      buildSentence(rng, startWithLorem && i === 0, remainingClassic)
    );
  }
  return sentences.join(" ");
}

function normalizeCount(count: number | undefined): number {
  if (count === undefined || Number.isNaN(count)) return 1;
  return Math.max(0, Math.floor(count));
}

/**
 * Generate Lorenipsem placeholder text.
 *
 * @example
 * lorenipsem() // one classic-style paragraph
 * lorenipsem({ count: 12, unit: "words" })
 * lorenipsem({ count: 3, unit: "sentences", seed: 42 })
 */
export function lorenipsem(options: LorenipsemOptions = {}): string {
  const count = normalizeCount(options.count);
  const unit: LorenipsemUnit = options.unit ?? "paragraphs";
  const startWithLorem = options.startWithLorem ?? true;
  const seed = options.seed ?? Date.now();
  const rng = createRng(seed);

  if (count === 0) return "";

  switch (unit) {
    case "words": {
      return buildWords(rng, count, startWithLorem).join(" ");
    }
    case "sentences": {
      const remainingClassic = startWithLorem ? [...CLASSIC_OPENING] : [];
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(
          buildSentence(rng, startWithLorem && i === 0, remainingClassic)
        );
      }
      return sentences.join(" ");
    }
    case "paragraphs": {
      const remainingClassic = startWithLorem ? [...CLASSIC_OPENING] : [];
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(
          buildParagraph(rng, startWithLorem && i === 0, remainingClassic)
        );
      }
      return paragraphs.join("\n\n");
    }
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}
