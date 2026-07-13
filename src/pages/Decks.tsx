import { useEffect, useState } from "react"
import ModalBackGround from "../components/ModalBackGround"
import DeckCreationModal from "../components/DeckCreationModal"
import type { Deck } from "../types/Deck"
import { useNavigate } from "react-router-dom"
import { useHideOnScroll } from "../hooks/useHideOnScroll"
import type { ToastInfo } from "./App"
import RemoverDeckModal from "../components/RemoverDeckModal"


type DecksProps = {
    setPropsToastInfo: ({ msg, type, isOpen }: ToastInfo) => void;
}

function Decks( { setPropsToastInfo }: DecksProps ) {
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
    const [modeFormDeck, setModeFormDeck] = useState<"" | "create" | "edit">("")
    const [deckToEdit, setDeckToEdit] = useState<Deck | undefined>(undefined)
    const [isFormDeckModalOpen, setIsFormDeckModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"" | "deckForm" | "delete">("")

    console.log("modal mode => " + modalMode)
    console.log("mode form deck => " + modeFormDeck)

    function handleCreateDeck(deck: Deck) {
        setDecks((prev) => [...prev, deck])
        setIsFormDeckModalOpen(false)
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

    function abrirFormCreateDeck() {
        setModeFormDeck("create")
        setModalMode("deckForm")
        setIsFormDeckModalOpen(true)
        setBackGroundModalIsOpen(true)
    }

    function abrirFormEditDeck(deckId: string, event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation()
        const deck = decks.find(dk => dk.id === deckId)
        setDeckToEdit(deck)
        setModeFormDeck("edit")
        setModalMode("deckForm")
        setIsFormDeckModalOpen(true)
        setBackGroundModalIsOpen(true)
    }

    function saveChangesDeck(updatedDeck: Deck) {
        setDecks((prevDecks) => 
            prevDecks.map(deck => 
                deck.id === updatedDeck.id ? 
                    updatedDeck 
                : 
                    deck
        ))
        setDeckToEdit(undefined)
        setIsFormDeckModalOpen(false)
        setBackGroundModalIsOpen(false)
    }

    function abrirDeleteWarning() {
        setIsFormDeckModalOpen(false)
        setIsDeleteModalOpen(true)
        setModalMode("delete")
    }

    function fecharDeleteWarning() {
        setIsFormDeckModalOpen(true)
        setIsDeleteModalOpen(false)
        setModalMode("deckForm")
    }

    function deletarDeck() {
        setDecks((prevDecks) => prevDecks.filter(deck => deck.id !== deckToEdit?.id))
        setIsDeleteModalOpen(false)
        setBackGroundModalIsOpen(false)
        setPropsToastInfo({
            msg: "Deck deletado com sucesso!",
            type: "success",
            isOpen: true
        })
    }
    
    const listOfDeck = filteredDecks.map(deck => 
    <button 
    className="deck-card" 
    data-deck-id={deck.id}
    key={deck.id}
    onClick={() => abrirDeck(deck.id)}
    >
        <div 
        className="deck-card-edit" 
        data-edit-deck-id="${deck.id}" 
        aria-label="Editar deck" 
        
        onClick={(event) => abrirFormEditDeck(deck.id, event)}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="1.8" fill="currentColor" />
                <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                <circle cx="12" cy="19" r="1.8" fill="currentColor" />
            </svg>
        </div>
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
                    onClick={abrirFormCreateDeck}
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
        modalOpen={modalMode}
        onClose={() => {
            setBackGroundModalIsOpen(false)
            setDeckToEdit(undefined)
            setIsFormDeckModalOpen(false)
            }}> 
            <DeckCreationModal 
            isOpen={isFormDeckModalOpen}
            onClose={() => {
                setBackGroundModalIsOpen(false)
                setModeFormDeck("")
                setDeckToEdit(undefined)
            }}
            onSubmit={modeFormDeck === "create" ? handleCreateDeck : saveChangesDeck}
            mode={modeFormDeck}
            deck={deckToEdit}
            setPropsToastInfo={setPropsToastInfo}
            onDelete={abrirDeleteWarning}
            />
            <RemoverDeckModal 
            isOpen={isDeleteModalOpen}
            deck={deckToEdit}
            onDelete={deletarDeck}
            onClose={fecharDeleteWarning}
            />
        </ModalBackGround>
    </>
    )
}

export default Decks