import type { Deck } from "../types/Deck"
import type { CardFormData, Example, HelperCard, MeaningFormData } from "../types/Card"
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

function createEmptyExample(): Example {
    return {
        id: crypto.randomUUID(),
        text: ""
    }
}

function createEmptyMeaning(): MeaningFormData  {
    return {
        id: crypto.randomUUID(),
        definition: "",
        contexts: "",
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
            createEmptyMeaning(), createEmptyMeaning()
        ]
    }
}

function createEmptyHelperCard(): HelperCard {
    return {
        create: createEmptyCardFormData(),
        edit: undefined
    }
}