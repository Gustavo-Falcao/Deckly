import { useRef, useState, type JSX } from "react"
import type { DeckOption, Deck } from "../types/Deck"
import ModalBackGround from "../components/ModalBackGround"
import type { Card } from "../types/Card"
import CardComponent from "../components/CardComponent"
import { useParams } from "react-router-dom"

function Cards() {
    const { idDeck } = useParams<{idDeck: string}>()
    const [decks, setDecks] = useState<Deck[]>(() :Deck[] => {
                const valorLocalStorage = localStorage.getItem("_DECKS_")
        
                return valorLocalStorage ? JSON.parse(valorLocalStorage) : []
            })
    const [idDeckEscolhido, setIdDeckEscolhido] = useState<string>((): string => {
        console.log("Inicializando idDedckEscolhido com o id => " + idDeck)
        return idDeck ? idDeck : ""
    })
    const [backGroundModalIsOpen, setBackGroundModalIsOpen] = useState(false)
    const optionDecks: DeckOption[] = decks.map((deck) => {
        return {
            id: deck.id,
            name: deck.name
        }
    })
    const deckEscolhido = decks.find(deck => deck.id === idDeckEscolhido) ?? null
    const nomeDeckAtivo: string = deckEscolhido?.name || "Nenhum"
    const idCardAtivo = useRef("")


    function findCard(): Card | undefined {
        const idCard = idCardAtivo.current

        return deckEscolhido?.cards.find(card => card.id === idCard)
    }

    return (
    <>
        <section className="screen active" id="screen-cards">
            <header className="topbar">
                <button className="icon-btn" id="backToDecks" aria-label="Voltar para decks">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                        d="M15 18l-6-6 6-6" 
                        stroke="currentColor" 
                        strokeWidth="2.4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        />
                    </svg>
                </button>
                <div style={{flex: 1}}>
                    <p className="eyebrow">Deck aberto</p>
                    <h1 className="page-title" id="currentDeckTitle">{nomeDeckAtivo}</h1>
                </div>
                <button className="icon-btn" id="newCardFromDeck" aria-label="Criar card">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                        d="M12 5v14M5 12h14" 
                        stroke="currentColor" 
                        strokeWidth="2.4" 
                        strokeLinecap="round" 
                        />
                    </svg>
                </button>
            </header>

            <input className="search-box" id="cardSearch" type="search" placeholder="Buscar palavra no deck..." />
            <div className="choose-deck">
                <div className="field">
                    <label htmlFor="cardDeck">Deck</label>
                    <select 
                    id="cardDeck" 
                    required
                    value={idDeckEscolhido}
                    onChange={(e) => setIdDeckEscolhido(e.target.value)}
                    >
                        <option value="" hidden>Deck</option>
                        {optionDecks.map((deck) : JSX.Element => 
                            <option key={deck.id} value={deck.id}>{deck.name}</option>
                        )}
                    </select>
                </div>
            </div>

            <h2 className="section-title">Cards</h2>
            <div className="cards-list" id="cardsList">
                {
                    deckEscolhido === null ?
                        <div className="empty-state">
                            <strong>Nenhum Deck selecionado</strong>Escolha um deck para visualiazar os cards.
                        </div>
                    :
                    deckEscolhido.cards.length === 0 ?
                        <div className="empty-state">
                            <strong>Nenhum card por aqui</strong>Toque em + para cadastrar sua primeira palavra.
                        </div>
                    :
                    deckEscolhido.cards.map((card) :JSX.Element =>  
                        <article 
                        key={card.id}
                        onClick={() => {
                            idCardAtivo.current = card.id;
                            setBackGroundModalIsOpen(true)
                        }}
                        >
                            <div 
                            className="word-card is-closed" 
                            data-card-id={card.id} 
                            role="button" 
                            aria-haspopup="dialog">
                                <h2 className="word-title">
                                    {card.name}
                                </h2>
                            </div>
                        </article>        
                    )
                    
                    
                }
            </div>
        </section>
    
        <ModalBackGround isOpen={backGroundModalIsOpen} onClose={() => setBackGroundModalIsOpen(false)}>
            <CardComponent card={findCard()} onClose={() => setBackGroundModalIsOpen(false)} />
        </ModalBackGround>
    </>

    )
}

export default Cards