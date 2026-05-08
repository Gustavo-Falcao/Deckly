import { useState } from "react"
import ModalBackGround from "../components/ModalBackGround"
import DeckCreationModal from "../components/DeckCreationModal"

function Decks() {

    const [backGroundModalIsOpen, setBackGroundModalIsOpen] = useState(false)

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
            <div className="deck-grid" id="deckGrid"></div>
        </section>

        <ModalBackGround isOpen={backGroundModalIsOpen} onClose={() => setBackGroundModalIsOpen(false)}> 
            <DeckCreationModal onClose={() => setBackGroundModalIsOpen(false)}/>
        </ModalBackGround>
    </>
    )
}

export default Decks