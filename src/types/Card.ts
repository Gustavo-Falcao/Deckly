

type Context = "adjective" | "adverb" | "figurative" | "formal" | "informal" | "literal" | "modal verb" | "noun"
| "phrase" | "preposition" | "slang" | "verb"

type Example = {
    id: string;
    example: string;
}

type Meaning = {
    id: string;
    definition: string;
    contexts: Context[];
    examples: Example[];
};

export type Card = {
    id: string;
    name: string;
    context: Context;
    synonym: string;
    phonetic: string;
    meanings: Meaning[]
};

export type HelperCard = {
    create: Card;
    edit: Card;
}

