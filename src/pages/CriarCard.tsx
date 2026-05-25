import { useEffect, useRef, useState, type JSX } from "react";
import type { Deck, DeckOption } from "../types/Deck";
import type { CardFormData, Context, Card, CardEdit } from "../types/Card";
import { createEmptyCardFormData, createEmptyMeaning, createContextObjectWithContext, createEmptyExample } from "../helpers/objectsCreation"  
import ModalBackGround from "../components/ModalBackGround";
import CardPreview from "../components/CardPreview";
import { useParams, useNavigate } from "react-router-dom";
import { useHideOnScroll } from "../hooks/useHideOnScroll";

type CriarCardMode = "criar" | "editar"

type CriarCardProps = {
    mode: CriarCardMode
}

function CriarCard({ mode }: CriarCardProps) {
    const { idDeck, idCard } = useParams<{idDeck: string, idCard: string}>()
    const navigate = useNavigate()
    const [decks, setDecks] = useState<Deck[]>(() :Deck[] => {
            const valorLocalStorage = localStorage.getItem("_DECKS_")
    
            if(!valorLocalStorage)
                return []
    
            return JSON.parse(valorLocalStorage);
        })
    const [idDeckEscolhido, setIdDeckEscolhido] = useState((): string => {
        return idDeck ? idDeck : ""
    })
    const optionDecks: DeckOption[] = decks.map((deck) => {
        return {
            id: deck.id,
            name: deck.name
        }
    })

    const [cardForm, setCardForm] = useState<CardFormData | CardEdit>(() :CardFormData | CardEdit => {
        if(decks.length === 0)
            return createEmptyCardFormData();

        const deck = decks.find((deck) => deck.id === idDeckEscolhido)

        if(!deck)
            return createEmptyCardFormData();

        if(mode === "criar")
            return deck.helperCard.create

        if(mode === "editar" && deck.helperCard.edit) 
            return deck.helperCard.edit

        return createEmptyCardFormData()
            
    })

    type ContextOption = {
        value: string;
        name: string;
    }

    const contextOptions: ContextOption[] = [
        {value: "adjective", name: "Adjective"},
        {value: "adverb", name: "Adverb"},
        {value: "figurative", name: "Figurative"},
        {value: "formal", name: "Formal"},
        {value: "informal", name: "Informal"},
        {value: "literal", name: "Literal"},
        {value: "modal verb", name: "Modal Verb"},
        {value: "noun", name: "Noun"},
        {value: "phrase", name: "Phrase"},
        {value: "preposition", name: "Preposition"},
        {value: "slang", name: "Slang"},
        {value: "verb", name: "Verb"}
    ]

    const [backGroundModalIsOpen, setBackGroundModalIsOpen] = useState(false)
    const [selectedContextByMeaningId, setSelectedContextByMeaningId] = useState<Record<string, Context | "">>({});
    const debounceSaveFormTimeoutKey = useRef<ReturnType<typeof setTimeout> | null>(null)
    const titlePage = !mode || mode === "criar" ? "Criar" : "Editar"
    const showTopArea = useHideOnScroll(80)

    useEffect(() => {
        localStorage.setItem("_DECKS_", JSON.stringify(decks))
        console.log("Decks salvos no local storage abaixo")
        console.log(decks)
    }, [decks])


    function updateCardForm(updater: (prevCardForm: CardFormData | CardEdit) => CardFormData | CardEdit) {
        if(!idDeckEscolhido) return

        setCardForm((prevCardForm) => {
            const updatedCardForm = updater(prevCardForm)

            if(debounceSaveFormTimeoutKey.current) {
                clearTimeout(debounceSaveFormTimeoutKey.current)
            }

            const currentDeckId = idDeckEscolhido
            const currentMode = mode

            debounceSaveFormTimeoutKey.current = setTimeout(() => {
                setDecks((prevDecks) => prevDecks.map((deck) => 
                    deck.id === currentDeckId ?
                        {...deck, helperCard: {...deck.helperCard, [currentMode === "criar" ? "create" : "edit"]: updatedCardForm}}
                    :
                        deck
                    ))
            }, 600)

            return updatedCardForm
        })
    }

    function handleSelectedDeck(idDeck: string) {
        const selectedDeck = decks.find(deck => deck.id === idDeck)

        if(!selectedDeck)
            return

        setIdDeckEscolhido(idDeck)
        //setCardForm(selectedDeck.helperCard.create)
        navigate(`/decks/${idDeck}/cards/novo`)
    }

    function addContextToMeaning(idMeaning: string, selectedContext: Context) {
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === idMeaning ? 
                    {...meaning, contexts: [...meaning.contexts, createContextObjectWithContext(selectedContext)]}
                    :
                    meaning
                )
            }
        ))
    }

    function handleSimpleChange(field: keyof CardFormData, value: string) {        
        const currentValue = field === "context" ? value.trim() as Context : value

        updateCardForm((prev) => (
            {...prev, [field]: currentValue}
        ))
    }

    function handleNestedChange(field: string, value: string, meaningId: string, exampleId?: string) {
            
        switch(field) {
            case "definition":
                updateCardForm((prev) => (
                    {...prev, meanings: prev.meanings.map(meaning => 
                        meaning.id === meaningId ?
                            {...meaning, definition: value}
                        :
                            meaning
                        )}
                ))
            break
            case "example":
                updateCardForm((prev) => (
                    {...prev, meanings: prev.meanings.map(meaning => 
                        meaning.id === meaningId ?
                            {...meaning, examples: meaning.examples.map(example => 
                                example.id === exampleId ?
                                    {...example, text: value}
                                :
                                    example
                            )}
                        :
                            meaning
                    )}
                ))
            break
            default: return
        }
    }

    function adicionarSignificado() {
        updateCardForm((prev) => (
            {...prev, meanings: [...prev.meanings, createEmptyMeaning()]}
        ))
    }

    function removerSignificado(significadoId: string) {
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.filter(meaning => 
                meaning.id !== significadoId)}
        ))
    }

    function removerMeaningContext(significadoId: string, contextId: string) {
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === significadoId ?
                    {...meaning, contexts: meaning.contexts.filter(context => 
                        context.id !== contextId)
                    }
                : 
                meaning
            )}
        ))
    }

    function adicionarExemplo(significadoId: string) {
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === significadoId ?
                    {...meaning, examples: [...meaning.examples, createEmptyExample()]}
                :
                meaning
            )}
        )) 
    }

    function removerExemplo(significadoId: string, exampleId: string) {
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === significadoId ?
                    {...meaning, examples: meaning.examples.filter(example => 
                        example.id !== exampleId
                    )}
                :
                meaning
            )}
        ))
    }

    function isCardEdit(card: CardFormData | CardEdit): card is CardEdit {
        return "id" in card
    }

    function salvarCard() {
        const cardToCreate: CardFormData | CardEdit = cardForm;

        if(!cardToCreate.name){
            alert("Informe um nome ao card")
            return
        }

        for(const meaning of cardToCreate.meanings) {
            if(!meaning.definition) {
                alert("Informe uma definição para o significado " + meaning.id)
                return
            }

            for(const ex of meaning.examples) {
                if(!ex.text) {
                    alert("informe uma frase de exemplo para o exemplo " + ex.id)
                    return
                }
            }
        }

        const currentMode = mode

        if(currentMode === "criar") {
            if(!isCardEdit(cardToCreate)) {
                criarCard(cardToCreate)
                voltarParaCardsDoModeCreate()
            } else {
                alert("Não foi possível criar: id já existe.")
            }
        }
        else {
            if(isCardEdit(cardToCreate)) {
                salvarEdicaoCard(cardToCreate)
                voltarParaCardsDoModeEdit()
            } else {
                alert("Não foi possível editar: card sem id.")
            }
        }

    }

    function criarCard(cardFormCreate: CardFormData) {

        const card: Card = {
            id: crypto.randomUUID(),
            name: cardFormCreate.name,
            context: cardFormCreate.context as Context || undefined,
            synonym: cardFormCreate.synonym,
            phonetic: cardFormCreate.phonetic,
            creationDate: new Date().toISOString(),
            meanings: cardFormCreate.meanings
        }

        const emptyCardCriacao = createEmptyCardFormData()

        setDecks((prevDecks) => prevDecks.map((deck) => 
            deck.id === idDeckEscolhido ?
                {...deck, cards: [card, ...deck.cards], helperCard: {...deck.helperCard, create: emptyCardCriacao}}
            :
                deck
        ))

        setCardForm(emptyCardCriacao)
    }

    function salvarEdicaoCard(cardFormEdit: CardEdit) {

        const cardAtualizado: Card = {
            id: cardFormEdit.id,
            name: cardFormEdit.name,
            context: cardFormEdit.context,
            synonym: cardFormEdit.synonym,
            phonetic: cardFormEdit.phonetic,
            creationDate: cardFormEdit.creationDate,
            meanings: cardFormEdit.meanings
        }

        setDecks((prevDecks) => prevDecks.map((deck) => 
            deck.id === idDeckEscolhido ?
                {...deck, 
                    cards: deck.cards.map((card) => 
                        card.id === cardFormEdit.id ?
                            cardAtualizado
                        :
                            card),
                    helperCard: {...deck.helperCard, edit: undefined}}
            :
                deck
        ))
    }

    function voltarParaCardsDoModeCreate() {
        if(!idDeckEscolhido) return

        navigate(`/decks/${idDeckEscolhido}/cards`)
    }

    function voltarParaCardsDoModeEdit() {
        if(!idDeckEscolhido) return

        navigate(`/decks/${idDeckEscolhido}/cards?backgroundModal=true&modalMode=card&idCard=${idCard}`)
    }

    return (
    <>
        <section className="screen active" id="screen-form">
        <div className={`top-area ${showTopArea ? "show" : "hide"}`}>
            <header className="topbar">
                <button className="icon-btn" id="cancelForm" aria-label="Cancelar"
                onClick={() => {
                    mode === "criar" ? voltarParaCardsDoModeCreate() : voltarParaCardsDoModeEdit()
                }}
                >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path 
                        d="M18 6 6 18M6 6l12 12" 
                        stroke="currentColor" 
                        strokeWidth="2.4" 
                        strokeLinecap="round" 
                        />
                    </svg>
                </button>
                <div style={{flex: 1}}>
                <p className="eyebrow">Card</p>
                <h1 className="page-title" id="formTitle">{titlePage} card</h1>
                </div>
            </header>
        </div>

        <form className="form-card" id="cardForm">
            {mode === "criar" && 
                <div className="field">
                    <label htmlFor="cardDeck">Deck</label>
                    <select 
                    id="cardDeck" 
                    required
                    value={idDeckEscolhido}
                    onChange={(e) => handleSelectedDeck(e.target.value)}
                    >
                        <option value="" hidden>Deck</option>
                        {optionDecks.map((deck) : JSX.Element => 
                            <option key={deck.id} value={deck.id}>{deck.name}</option>
                        )}
                    </select>
                </div>
            }
                {
                    idDeckEscolhido.length === 0 ? 
                        <div className="empty-state">
                            <strong>Nenhum Deck selecionado</strong>Escolha um deck para criar o card
                        </div>
                    : 
                    <>
                    <div className="field">
                        <label htmlFor="wordInput">Palavra</label>
                        <input 
                            id="wordInput" 
                            type="text" 
                            placeholder="Ex: Strident" 
                            value={cardForm.name}
                            onChange={(e) => handleSimpleChange("name", e.target.value)}
                            />
                    </div>

                    <div className="two-cols">
                        <div className="field">
                            <label htmlFor="typeInput">Tipo</label>
                            <select 
                            className="meaning-tag-select" 
                            value={cardForm.context}
                            onChange={(e) => handleSimpleChange("context", e.target.value)}
                            >
                            <option value="" hidden>Tipo</option>
                                        {contextOptions.map(contOption => 
                                            <option key={contOption.value} value={contOption.value}>{contOption.name}</option>
                                        )}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="synonymInput">Sinônimo</label>
                            <input 
                                id="synonymInput" 
                                type="text" 
                                placeholder="loud" 
                                value={cardForm.synonym}
                                onChange={(e) => handleSimpleChange("synonym", e.target.value)}
                                />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="phoneticInput">Pronúncia</label>
                        <input 
                            id="phoneticInput" 
                            type="text" 
                            placeholder="/ STRAI-dənt /" 
                            value={cardForm.phonetic}
                            onChange={(e) => handleSimpleChange("phonetic", e.target.value)}
                            />
                    </div>

                    <div>

                        {cardForm.meanings.map((meaning, index: number) => 
                            <div 
                            className="meaning-form"
                            key={meaning.id}
                            data-meaning-id={meaning.id}
                            >
                                <div className="meaning-form-title">
                                    <span>Significado {index+1}</span>
                                    <button 
                                    className="remove-meaning" type="button"
                                    disabled={cardForm.meanings.length < 2}
                                    onClick={() => removerSignificado(meaning.id)}
                                    >Remover</button>
                                </div>

                                <div className="field">
                                    <label>Definição</label>
                                    <textarea 
                                    className="meaning-definition"
                                    placeholder="Explique o significado"
                                    value={meaning.definition}
                                    onChange={(e) => handleNestedChange("definition", e.target.value, meaning.id)}
                                    >
                                    </textarea>
                                </div>

                                <div className="field">
                                    <label>Contexto</label>
                                    <div className="context-tools">
                                        <select className="meaning-tag-select"
                                        value={selectedContextByMeaningId[meaning.id] ?? ""}
                                        onChange={(event) => {
                                            setSelectedContextByMeaningId((prev) => ({
                                                ...prev,
                                                [meaning.id]: event.target.value as Context | "",
                                            }))
                                        }}
                                        >
                                        <option value="" hidden>Adicionar contexto</option>
                                        {contextOptions.map(contOption => 
                                            <option key={meaning.id + contOption.value + "option"} value={contOption.value}>{contOption.name}</option>
                                        )}

                                        </select>
                                        <button 
                                        className="inline-action add-tag" type="button"
                                        onClick={() => {
                                            const selectedContext = selectedContextByMeaningId[meaning.id]

                                            if(!selectedContext)
                                                return

                                            addContextToMeaning(meaning.id, selectedContext)

                                            setSelectedContextByMeaningId((prev) => ({
                                                ...prev, [meaning.id]: ""
                                            }))
                                        }}
                                        >Adicionar</button>
                                    </div>
                                    <div className="selected-tags">
                                        {
                                        meaning.contexts.length === 0 ?
                                            <span className="empty-tags">Sem tag</span>
                                        :
                                            meaning.contexts.map(context => 
                                                <button 
                                                key={context.id}
                                                className={`tag tag-chip ${context.context}`}
                                                type="button"
                                                aria-label="Remover tag"
                                                onClick={() => removerMeaningContext(meaning.id, context.id)}
                                                >
                                                    {context.context}
                                                    <span aria-hidden="true">x</span>
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="examples-container">
                                    {
                                    meaning.examples.map((example, index) =>

                                        <div className="example-field" key={example.id}>
                                            <div className="example-title">
                                                <label>Exemplo {index+1}</label>
                                                <button
                                                className="remove-example"
                                                type="button"
                                                disabled={meaning.examples.length < 3}
                                                onClick={() => removerExemplo(meaning.id, example.id)}
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                            <textarea 
                                            className="meaning-example" 
                                            placeholder="Frase de exemplo"
                                            value={example.text}
                                            onChange={(e) => handleNestedChange("example", e.target.value, meaning.id, example.id)}
                                            >
                                            </textarea>
                                        </div>
                                    )}
                                </div>
                                <button 
                                className="secondary-btn add-example" 
                                type="button"
                                onClick={() => adicionarExemplo(meaning.id)}
                                >
                                    + Adicionar exemplo
                                </button>
                            </div>
                        )}
                    </div>


                    <button 
                    className="secondary-btn" 
                    type="button" 
                    id="addMeaning"
                    onClick={() => adicionarSignificado()}
                    >
                        + Adicionar significado
                    </button>
                    <div style={{height: "12px"}}></div>
                    <button 
                    className="primary-btn" 
                    type="submit"
                    onClick={() => salvarCard()}
                    >Salvar card</button>
                    <div style={{height: "10px"}}></div>
                    <button 
                    className="preview-btn" 
                    type="button" 
                    onClick={() => setBackGroundModalIsOpen(true)}
                    >Pré-visualizar card</button>
                    </>   

                }
        </form>
        </section>

        <ModalBackGround 
        isOpen={backGroundModalIsOpen} 
        onClose={() => setBackGroundModalIsOpen(false)}
        modalOpen="card"
        >
            <CardPreview card={cardForm} onClose={() => setBackGroundModalIsOpen(false)}/>
        </ModalBackGround>

    </>
    )
}

export default CriarCard