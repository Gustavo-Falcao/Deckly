import { useEffect, useState, type JSX } from "react"
import type { DeckOption, Deck } from "../types/Deck"
import ModalBackGround from "../components/ModalBackGround"
import type { Card, CardEdit } from "../types/Card"
import CardComponent from "../components/CardComponent"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import RemoveCardModal from "../components/RemoveCardModal"
import { useHideOnScroll } from "../hooks/useHideOnScroll"
import ModalEditWarning from "../components/ModalEditWarning"

type FilterMode = "recente" | "antigo"

function getCardsFiltrados(deckAtual: Deck | null, inputSearch: string, filterMode: FilterMode): Card[] {
    if(!deckAtual || deckAtual.cards.length === 0) return []

    const filteredCardsByName = deckAtual.cards.filter(card => card.name.toLowerCase().includes(inputSearch.toLowerCase()))

    if(filterMode === "antigo") {
        return [...filteredCardsByName].reverse()
    }

    return filteredCardsByName
}

function Cards() {
    const { idDeck } = useParams<{ idDeck: string }>()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    
    const backGroundModalIsOpen = searchParams.get("backgroundModal") === "true"
    const modalMode = searchParams.get("modalMode")
    const idCardAtivo = searchParams.get("idCard")
    const cardModalIsOpen = modalMode === "card"
    const deleteCardModalIsOpen = modalMode === "deleteCard"
    const showTopArea = useHideOnScroll(80)
    const isModalEditWarningOpen = modalMode === "editWarning"

    const[idDeckAtivo, setIdDeckAtivo] = useState(() => {
        return idDeck ? idDeck : ""
    })

    const [decks, setDecks] = useState<Deck[]>(() :Deck[] => {
                const valorLocalStorage = localStorage.getItem("_DECKS_")
        
                return valorLocalStorage ? JSON.parse(valorLocalStorage) : []
            })

    const optionDecks: DeckOption[] = decks.map((deck) => {
        return {
            id: deck.id,
            name: deck.name
        }
    })

    const [filterModeCard, setFilterModeCard] = useState<FilterMode>("recente")
    const deckEscolhido = decks.find(deck => deck.id === idDeckAtivo) ?? null
    const nomeDeckAtivo: string = deckEscolhido?.name || "Nenhum"
    const nomeCardAtivo: string = deckEscolhido?.cards.find(card => card.id === idCardAtivo)?.name || ""
    const nomeEditCard = deckEscolhido?.helperCard.edit?.name 
    const [inputSearchCard, setInputSearchCard] = useState("")
    const filteredCards: Card[] = getCardsFiltrados(deckEscolhido, inputSearchCard, filterModeCard)

    useEffect(() => {
        localStorage.setItem("_DECKS_", JSON.stringify(decks))
    }, [decks])

    useEffect(() => {
        console.log(decks)
    }, [])

    function findCard(): Card | undefined {
        const idCard = idCardAtivo

        return deckEscolhido?.cards.find(card => card.id === idCard)
    }

    function voltarParaDecks() {
        navigate(`/decks`)
    }

    function abrirCriarCard() {
        if(!idDeckAtivo) return

        navigate(`/decks/${idDeckAtivo}/cards/novo`)
    }

    function openCardModal(cardId: string) {
        setSearchParams((params) => {
            const newParams = new URLSearchParams(params)

            newParams.set("backgroundModal", "true")
            newParams.set("modalMode", "card")
            newParams.set("idCard", cardId)

            return newParams
        })
    }

    function fecharCardModal() {
        setSearchParams({})
    }

    function changeModalMode(newModalMode: "card" | "deleteCard" | "editWarning") {
        const newSearchParams = new URLSearchParams(searchParams)

        newSearchParams.set("modalMode", newModalMode)

        setSearchParams(newSearchParams)
    }

    function openDeleteCardModal() {
        changeModalMode("deleteCard")
    }
 
    function fecharDeleteCardModal() {
        changeModalMode("card")
    }

    function openWarningEditModal() {
        changeModalMode("editWarning")
    }

    function fecharWarningEditModal() {
        changeModalMode("card")
    }

    function deletarCard() {
        const idCurrentCard = idCardAtivo
        const idCurrentDeck = idDeckAtivo

        setDecks((prevDecks) => prevDecks.map((deck) => 
            deck.id === idCurrentDeck ?
                {...deck, cards: deck.cards.filter((card) => card.id !== idCurrentCard)}
            :
                deck
            ))

        fecharCardModal()
    }

    function abrirEdicaoCard() {
        const cardAtivo = idCardAtivo || ""
        const idDeckAtual = idDeckAtivo

        const card = findCard()

        if(!card) return

        if(!isActiveCardPresentOnEditOrEditIsUndefined(cardAtivo)) {
            openWarningEditModal()
            return
        }

        const cardEdit: CardEdit = {
            id: card.id,
            name: card.name,
            context: card.context,
            synonym: card.synonym,
            phonetic: card.phonetic,
            creationDate: card.creationDate,
            meanings: card.meanings
        }

        setDecks((prevDecks) => prevDecks.map((deck) => 
            deck.id === idDeckAtual ?
                {...deck, helperCard: {...deck.helperCard, edit: cardEdit}}
            :
                deck
        ))

        navigate(`/decks/${idDeckAtivo}/cards/${cardAtivo}/editar`)
    }
    
    //para o card ativo ser editado 
        //deck edit undefined 
        //deck ativo ser igual ao presente no edit
    function isActiveCardPresentOnEditOrEditIsUndefined(idCardAtivo: string): boolean {
       const cardEdit = deckEscolhido?.helperCard.edit

       if(!cardEdit) return true

       if(cardEdit.id === idCardAtivo) return true

       return false
    }

    function alterarDeck(deckId: string) {
        setIdDeckAtivo(deckId)
        !deckId ? navigate(`/cards`) : navigate(`/decks/${deckId}/cards`)
    }

    //Futuramente validar o formulario antes de salvar
    function saveChangesEditCardAndOpenCurrentCardToEdit() {
        if(!deckEscolhido) return

        const cardEdit = deckEscolhido.helperCard.edit
        const cardToEdit = deckEscolhido.cards.find(card => card.id === idCardAtivo)
        const cardToBeEdited = deckEscolhido.cards.find(card => card.id === cardEdit?.id);

        if(!cardEdit || !cardToEdit || !cardToBeEdited) return

        const updatedCard: Card = {
            id: cardEdit.id,
            name: cardEdit.name,
            context: cardEdit.context,
            synonym: cardEdit.synonym,
            phonetic: cardEdit.phonetic,
            creationDate: cardEdit.creationDate,
            nextReviewDate: cardToBeEdited.nextReviewDate,
            interval: cardToBeEdited.interval,
            repetitions: cardToBeEdited.repetitions,
            easeFactor: cardToBeEdited.easeFactor,
            meanings: cardEdit.meanings
        }

        setDecks((prevDecks) => prevDecks.map((deck) => 
            deck.id === deckEscolhido.id ?
                {...deck, cards: deck.cards.map(card => 
                    card.id === cardEdit.id ?
                        updatedCard
                    :
                        card
                    ),
                    helperCard: {...deck.helperCard, edit: cardToEdit}
                }
            :
                deck
            ))

        navigate(`/decks/${idDeckAtivo}/cards/${cardToEdit.id}/editar`)
    }

    //descartar alterações
        //atribuir o card que o usuário quer editar no card edit descartando as alterazções do outro presente
        //setar o modo do modal para card
        //nevegar para editar 

    function discardChangesAndOpenCurrentCardToEdit() {
        if(!deckEscolhido) return

        const cardToEdit = deckEscolhido.cards.find(card => card.id === idCardAtivo)

        if(!cardToEdit) return

        setDecks((prevDecks) => prevDecks.map((deck) => 
            deck.id === deckEscolhido.id ?
                {...deck, helperCard: {...deck.helperCard, edit: cardToEdit}
                }
            :
                deck
            ))

        navigate(`/decks/${idDeckAtivo}/cards/${cardToEdit.id}/editar`)
    }

    return (
    <>
        <section className="screen active" id="screen-cards">
            <div className={`top-area ${showTopArea ? "show" : "hide"}`}>
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
                <div className="search-wrapper">
                    <input 
                    className="search-box" 
                    id="cardSearch" 
                    type="search" 
                    placeholder="Buscar palavra no deck..." 
                    value={inputSearchCard}
                    onChange={(e) => setInputSearchCard(e.target.value)}
                    />
                    <button 
                    className={`search-clear ${inputSearchCard.length > 0 ? 'visible' : ''}`} 
                    id="deckSearchClear" 
                    aria-label="Limpar busca"
                    onClick={() => setInputSearchCard("")}
                    >
                        <svg viewBox="0 0 14 14" aria-hidden="true">
                            <path d="M2 2l10 10M12 2L2 12" />
                        </svg>
                    </button>
                    <div className="filter-chips" id="filterChips" role="group" aria-label="Ordenar cards">
                        <button 
                        className={`filter-chip ${filterModeCard === "recente" ? 'active' : ''}`} 
                        data-filter="recent"
                        onClick={() => setFilterModeCard("recente")}
                        >Mais recente</button>
                        <button 
                        className={`filter-chip ${filterModeCard === "antigo" ? 'active' : ''}`} 
                        data-filter="oldest"
                        onClick={() => setFilterModeCard("antigo")}
                        >Mais antigo</button>
                    </div>
                </div>
            </div>

            <div className="choose-deck">
                <div className="field">
                    <label htmlFor="cardDeck">Deck</label>
                    <select 
                    id="cardDeck" 
                    required
                    value={idDeckAtivo}
                    onChange={(e) => alterarDeck(e.target.value)}
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
                    filteredCards.length === 0 ?
                                <div 
                                className="empty-state" 
                                style={{gridColumn: "1 / -1"}}
                                >
                                    <strong>Nenhum deck encontrado</strong>
                                </div>
                    :
                    filteredCards.map((card) :JSX.Element =>  
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
            modalOpen={cardModalIsOpen ? "card" : "info"}
            >
            <CardComponent 
            card={findCard()} 
            onClose={() => fecharCardModal()} 
            isOpen={cardModalIsOpen}
            openDeleteCard={openDeleteCardModal}
            openEditCard={abrirEdicaoCard}
            />

            <RemoveCardModal 
            onClose={() => {
                fecharDeleteCardModal()
                }} 
            isOpen={deleteCardModalIsOpen}
            onDelete={deletarCard}
            nomeDeck={nomeDeckAtivo}
            nomeCard={nomeCardAtivo}
            />

            <ModalEditWarning 
            isOpen={isModalEditWarningOpen}
            nomeEditCard={nomeEditCard}
            onClose={fecharWarningEditModal}
            saveChanges={saveChangesEditCardAndOpenCurrentCardToEdit}
            discardChanges={discardChangesAndOpenCurrentCardToEdit}
            />
        </ModalBackGround>
    </>

    )
}

export default Cards