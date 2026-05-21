import { useEffect, useRef, useState, type JSX } from "react"
import type { DeckOption, Deck } from "../types/Deck"
import ModalBackGround from "../components/ModalBackGround"
import type { Card } from "../types/Card"
import CardComponent from "../components/CardComponent"
import { useParams, useNavigate } from "react-router-dom"
import RemoveCardModal from "../components/RemoveCardModal"

function Cards() {
    const navigate = useNavigate()
    const { idDeck } = useParams<{idDeck: string}>()
    const [decks, setDecks] = useState<Deck[]>(() :Deck[] => {
                const valorLocalStorage = localStorage.getItem("_DECKS_")
        
                return valorLocalStorage ? JSON.parse(valorLocalStorage) : []
            })
    const [idDeckEscolhido, setIdDeckEscolhido] = useState<string>((): string => {
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
    const [cardModalIsOpen, setCardModalIsOpen] = useState(false)
    const [deleteCardModalIsOpen, setDeleteCardModalIsOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem("_DECKS_", JSON.stringify(decks))
    }, [decks])

    function findCard(): Card | undefined {
        const idCard = idCardAtivo.current

        return deckEscolhido?.cards.find(card => card.id === idCard)
    }

    function voltarParaDecks() {
        navigate(`/`)
    }

    function abrirCriarCard() {
        if(!idDeckEscolhido) return

        navigate(`/decks/${idDeckEscolhido}/cards/novo`)
    }

    function openCardModal(cardId: string) {
        idCardAtivo.current = cardId
        setBackGroundModalIsOpen(true)
        setCardModalIsOpen(true)
    }

    function fecharCardModal() {
        setBackGroundModalIsOpen(false)
        setCardModalIsOpen(false)
    }

    function fecharDeleteCardModal() {
        setDeleteCardModalIsOpen(false)
    }

    function deletarCard() {
        const idCurrentCard = idCardAtivo.current
        const idCurrentDeck = idDeckEscolhido
        
        idCardAtivo.current = ""

        setDecks((prevDecks) => prevDecks.map((deck) => 
            deck.id === idCurrentDeck ?
                {...deck, cards: deck.cards.filter((card) => card.id !== idCurrentCard)}
            :
                deck
            ))

        setDeleteCardModalIsOpen(false)
        setCardModalIsOpen(false)
        setBackGroundModalIsOpen(false)
    }

    return (
    <>
        <section className="screen active" id="screen-cards">
            <header className="topbar">
                <button 
                className="icon-btn" 
                id="backToDecks" 
                aria-label="Voltar para decks"
                onClick={() => voltarParaDecks()}
                >
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
                <button className="icon-btn" id="newCardFromDeck" aria-label="Criar card"
                onClick={() => abrirCriarCard()}
                >
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
                        onClick={() => openCardModal(card.id)}
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
    
        <ModalBackGround isOpen={backGroundModalIsOpen} onClose={() => {
            if(cardModalIsOpen) {
                fecharCardModal()   
            }

            if(deleteCardModalIsOpen) {
                fecharDeleteCardModal()
            }}}
            modalOpen={cardModalIsOpen ? "card" : deleteCardModalIsOpen ? "delete" : ""}
            >
            <CardComponent 
            card={findCard()} 
            onClose={() => fecharCardModal()} 
            isOpen={cardModalIsOpen}
            openDeleteCard={() => {
                setDeleteCardModalIsOpen(true) 
                setCardModalIsOpen(false)
            }}
            />

            <RemoveCardModal 
            onClose={() => {
                fecharDeleteCardModal()
                setCardModalIsOpen(true)
                }} 
            isOpen={deleteCardModalIsOpen}
            onDelete={deletarCard}
            />
        </ModalBackGround>
    </>

    )
}

export default Cards