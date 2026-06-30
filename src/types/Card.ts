export type Context = "adjective" | "adverb" | "figurative" | "formal" | "informal" | "literal" | "modal verb" | "noun" | "phrase" | "preposition" | "slang" | "verb"

export type TempoVerbal = "Pres. Simple" | "Pres.Continuous" | "Pres.Perfect" | "Pres Perf. Cont." | "Past Simple" | "Past.Continuous" | "Past Perfect" | "Past Perf. Cont." | "Fut. Simple" | "Fut. Continuous" | "Fut. Perfect" | "Fut. Perf. Cont."

export type ModoVerbal = "imperative" | "conditional" | "subjunctive" | "passive voice" | "infinitive"

export type ContextObject = {
    id: string;
    context: Context;
}

export type Example = {
    id: string;
    text: string;
    targetToBeHidden: string
    tempoVerbal: TempoVerbal | undefined
    modoVerbal: ModoVerbal | undefined
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

export type MeaningPractice = {
    id: string
    idCard: string
    generalContext: Context | undefined
    meaningContexts: ContextObject[]
    meaningDefinition: string
    sentence: string
    targetResult: string
    nextReviewDate: string;
    interval: number;
    repetitions: number;
    easeFactor: number;
    done: boolean
}
