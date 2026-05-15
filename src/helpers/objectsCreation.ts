import type { Deck } from "../types/Deck"
import type { CardFormData, Context, Example, HelperCard, MeaningFormData } from "../types/Card"
import { getCurrentDate } from "./handleDate"

export function createDeck(nome: string, emoji: string): Deck {
    return {
        id: crypto.randomUUID(),
        name: nome.trim(),
        emoji: emoji.trim(),
        helperCard: createEmptyHelperCard(),
        creationDate: getCurrentDate(),
        cards: []
    }
}

export function createEmptyExample(): Example {
    return {
        id: crypto.randomUUID(),
        text: ""
    }
}

export function createContextObjectWithContext(context: Context) {
    return {
        id: crypto.randomUUID(),
        context: context
    }
}

export function createEmptyMeaning(): MeaningFormData  {
    return {
        id: crypto.randomUUID(),
        definition: "",
        contexts: [],
        examples: [
            createEmptyExample(), createEmptyExample()
        ]
    }
}

export function createEmptyCardFormData(): CardFormData {
    return {
        name: "",
        context: "",
        synonym: "",
        phonetic: "",
        meanings: [
            createEmptyMeaning()
        ]
    }
}

function createEmptyHelperCard(): HelperCard {
    return {
        create: createEmptyCardFormData(),
        edit: undefined
    }
}