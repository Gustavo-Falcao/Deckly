export type Context = "adjective" | "adverb" | "figurative" | "formal" | "informal" | "literal" | "modal verb" | "noun"
| "phrase" | "preposition" | "slang" | "verb"

export type ContextObject = {
    id: string;
    context: Context;
}

export type Example = {
    id: string;
    text: string;
    targetToBeHidden: string
}

export type Meaning = {
    id: string;
    definition: string;
    contexts: ContextObject[];
    examples: Example[];
    nextReviewDate: string;
    interval: number;
    repetitions: number;
    easeFactor: number;
};

export type MeaningFormData = {
    id: string;
    definition: string;
    contexts: ContextObject[];
    examples: Example[];
}

export type Card = {
    id: string;
    name: string;
    context?: Context;
    synonym: string;
    phonetic: string;
    creationDate: string;
    meanings: Meaning[]
};

export type CardFormData = {
    name: string;
    context: string;
    synonym: string;
    phonetic: string;
    meanings: MeaningFormData[]
}

export type CardEdit = {
    id: string;
    name: string;
    context?: Context;
    synonym: string;
    phonetic: string;
    creationDate: string;
    meanings: MeaningFormData[]
}

export type HelperCard = {
    create: CardFormData;
    edit?: CardEdit;
}

