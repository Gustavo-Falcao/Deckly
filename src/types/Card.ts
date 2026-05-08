

type Context = "adjective" | "adverb" | "figurative" | "formal" | "informal" | "literal" | "modal verb" | "noun"
| "phrase" | "preposition" | "slang" | "verb"

export type Example = {
    id: string;
    text: string;
}

type Meaning = {
    id: string;
    definition: string;
    contexts?: Context[];
    examples: Example[];
};

export type MeaningFormData = {
    id: string;
    definition: string;
    contexts: string;
    examples: Example[];
}

export type Card = {
    id: string;
    name: string;
    context?: Context;
    synonym: string;
    phonetic: string;
    meanings: Meaning[]
};

export type CardFormData = {
    name: string;
    context: string;
    synonym: string;
    phonetic: string;
    meanings: MeaningFormData[]
}

export type HelperCard = {
    create: CardFormData;
    edit?: CardFormData;
}

