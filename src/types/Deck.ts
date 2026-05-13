import type { Card, HelperCard } from "./Card";

export type Deck = {
    id: string;
    name: string;
    emoji: string;
    helperCard: HelperCard;
    creationDate: string;
    cards: Card[];
};

export type DeckOption = {
    id: string
    name: string
}