import { useEffect, useState } from "react"
import ModalBackGround from "../components/ModalBackGround"
import DeckCreationModal from "../components/DeckCreationModal"
import type { Deck } from "../types/Deck"

function Decks() {

    const [backGroundModalIsOpen, setBackGroundModalIsOpen] = useState(false)
    const [decks, setDecks] = useState<Deck[]>(() :Deck[] => {
        const valorLocalStorage = localStorage.getItem("_DECKS_")

        if(!valorLocalStorage)
            return []

        return JSON.parse(valorLocalStorage);
    })

    function handleCreateDeck(deck: Deck) {
        setDecks((prev) => [...prev, deck])
        setBackGroundModalIsOpen(false)
    }

    useEffect(() => {
        console.log(decks)
        localStorage.setItem("_DECKS_", JSON.stringify(decks))

    },[decks])

    const msgNoDecks = (
        <div 
        className="empty-state" 
        style={{gridColumn: "1 / -1"}}
        >
            <strong>Nenhum deck encontrado</strong>
            <p>Crie uma coleção para começar.</p>
        </div>
    )

    function escapeHtml(value: string) {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    const listOfDeck = decks.map(deck => 
        <button 
        className="deck-card" 
        data-deck-id={deck.id}
        key={deck.id}
        >
            <span className="deck-emoji">
                {escapeHtml(deck.emoji || "📚")}
            </span>
            <span>
            <h3 className="deck-name">{escapeHtml(deck.name)}</h3>
            <p className="deck-count">{deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}</p>
            </span>
        </button>
    )
    

    return (
    <>
        <section className="screen active" id="screen-decks">
            <header className="topbar">
                <div>
                    <p className="eyebrow">Vocabulário</p>
                    <h1 className="page-title">Meus decks</h1>
                </div>
                <button 
                className="icon-btn" 
                id="openDeckModal" 
                aria-label="Criar deck"
                onClick={() => setBackGroundModalIsOpen(true)}
                >
                    <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    aria-hidden="true"
                    >
                        <path 
                        d="M12 5v14M5 12h14" 
                        stroke="currentColor" 
                        strokeWidth={2.4} 
                        strokeLinecap="round" 
                        />
                    </svg>
                </button>
            </header>

            <input
             className="search-box" 
             id="deckSearch" 
             type="search" 
             placeholder="Buscar deck..." 
             />

            <h2 className="section-title">Coleções</h2>
            <div className="deck-grid" id="deckGrid">
                {
                    decks.length === 0 ? 
                        msgNoDecks
                    :
                    listOfDeck
                }
            </div>
        </section>

        <ModalBackGround isOpen={backGroundModalIsOpen} onClose={() => setBackGroundModalIsOpen(false)}> 
            <DeckCreationModal 
            onClose={() => setBackGroundModalIsOpen(false)}
            onCreateDeck={handleCreateDeck}
            />
        </ModalBackGround>
    </>
    )
}

export default Decks