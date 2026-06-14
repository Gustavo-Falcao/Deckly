import { useEffect, useState } from "react"
import ModalBackGround from "../components/ModalBackGround"
import DeckCreationModal from "../components/DeckCreationModal"
import type { Deck } from "../types/Deck"
import { useNavigate } from "react-router-dom"
import { useHideOnScroll } from "../hooks/useHideOnScroll"

function Decks() {
    const navigate = useNavigate()
    const [backGroundModalIsOpen, setBackGroundModalIsOpen] = useState(false)
    const [decks, setDecks] = useState<Deck[]>(() :Deck[] => {
        const valorLocalStorage = localStorage.getItem("_DECKS_")

        if(!valorLocalStorage)
            return []

        return JSON.parse(valorLocalStorage);
    })
    const showTopArea = useHideOnScroll(80)
    const [inputSearchDeck, setInputSearchDeck] = useState("")
    const filteredDecks: Deck[] = decks.filter(deck => deck.name.toLowerCase().includes(inputSearchDeck.toLowerCase())) || []


    function handleCreateDeck(deck: Deck) {
        setDecks((prev) => [...prev, deck])
        setBackGroundModalIsOpen(false)
    }

    useEffect(() => {
        console.log(decks)
        localStorage.setItem("_DECKS_", JSON.stringify(decks))

    },[decks])

    //fazer useEffect para atualizar os dados 
    //tirar os dados do modo treino da raiz do objeto card e colocar na raiz do objeto meaning

    useEffect(() => {
        const arrayDecks = decks

        const arrayDecksAtualizado :Deck[] = arrayDecks.map(deck => 
            ({...deck, cards: deck.cards.map(card => 
                ({
                    id: card.id,
                    name: card.name,
                    context: card.context,
                    synonym: card.synonym,
                    phonetic: card.phonetic,
                    creationDate: card.creationDate,
                    meanings: card.meanings.map(meaning =>
                        ({
                            ...meaning, 
                            nextReviewDate: card.creationDate,
                            interval: 0,
                            repetitions: 0,
                            easeFactor: 2.5
                        })
                    )
                })
            )})
        )

        setDecks(arrayDecksAtualizado)
    
    }, [])

    const msgNoDecks = (
        <div 
        className="empty-state" 
        style={{gridColumn: "1 / -1"}}
        >
            <strong>Nenhum deck encontrado</strong>
            <p>Crie uma coleção para começar.</p>
        </div>
    )

    const msgNoDecksFoundedBySearch = (
        <div 
        className="empty-state" 
        style={{gridColumn: "1 / -1"}}
        >
            <strong>Nenhum deck encontrado</strong>
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

    function abrirDeck(deckId: string) {
        navigate(`/decks/${deckId}/cards`);
    }

    const listOfDeck = filteredDecks.map(deck => 
        <button 
        className="deck-card" 
        data-deck-id={deck.id}
        key={deck.id}
        onClick={() => abrirDeck(deck.id)}
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
            <div className={`top-area ${showTopArea ? "show" : "hide"}`}>
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
                <div className="search-wrapper">
                    <input 
                    className="search-box" 
                    id="cardSearch" 
                    type="search" 
                    placeholder="Buscar palavra no deck..." 
                    value={inputSearchDeck}
                    onChange={(e) => setInputSearchDeck(e.target.value)}
                    />
                    <button 
                    className={`search-clear ${inputSearchDeck.length > 0 ? 'visible' : ''}`} 
                    id="deckSearchClear" 
                    aria-label="Limpar busca"
                    onClick={() => setInputSearchDeck("")}
                    >
                        <svg viewBox="0 0 14 14" aria-hidden="true">
                            <path d="M2 2l10 10M12 2L2 12" />
                        </svg>
                    </button>
                </div>
            </div>


            <h2 className="section-title">Coleções</h2>
            <div className="deck-grid" id="deckGrid">
                {
                    decks.length === 0 ? 
                        msgNoDecks
                    :
                    filteredDecks.length === 0 ?
                        msgNoDecksFoundedBySearch
                    :
                    listOfDeck
                }
            </div>
        </section>

        <ModalBackGround 
        isOpen={backGroundModalIsOpen} 
        modalOpen="deck-create"
        onClose={() => setBackGroundModalIsOpen(false)}> 
            <DeckCreationModal 
            onClose={() => setBackGroundModalIsOpen(false)}
            onCreateDeck={handleCreateDeck}
            />
        </ModalBackGround>
    </>
    )
}

export default Decks