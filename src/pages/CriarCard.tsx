import { useEffect, useRef, useState, type JSX } from "react";
import type { Deck, DeckOption } from "../types/Deck";
import type { CardFormData, Context } from "../types/Card";
import { createEmptyCardFormData, createEmptyMeaning, createContextObjectWithContext, createEmptyExample } from "../helpers/objectsCreation"  

function CriarCard() {

    const [decks, setDecks] = useState<Deck[]>(() :Deck[] => {
            const valorLocalStorage = localStorage.getItem("_DECKS_")
    
            if(!valorLocalStorage)
                return []
    
            return JSON.parse(valorLocalStorage);
        })
    const [idDeckEscolhido, setIdDeckEscolhido] = useState("")
    const optionDecks: DeckOption[] = decks.map((deck) => {
        return {
            id: deck.id,
            name: deck.name
        }
    })
    const [cardCriacao, setCardCriacao] = useState<CardFormData>(() :CardFormData => {
        if(decks.length === 0)
            return createEmptyCardFormData();

        const deck = decks.find((deck) => deck.id === idDeckEscolhido)

        if(!deck)
            return createEmptyCardFormData();

        return deck.helperCard.create;
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
        {value: "literale", name: "Literal"},
        {value: "modal verb", name: "Modal Verb"},
        {value: "noun", name: "Noun"},
        {value: "phrase", name: "Phrase"},
        {value: "preposition", name: "Preposition"},
        {value: "slang", name: "Slang"},
        {value: "verb", name: "Verb"}
    ]

    const [selectedContextByMeaningId, setSelectedContextByMeaningId] = useState<Record<string, Context | "">>({});
    const keyTimeOutInputText = useRef<number | null>(null)

    useEffect(() => {
        console.log("Decks atualizado abaixo")
        console.log(decks)
    }, [decks])

    useEffect(() => {
        if(keyTimeOutInputText.current) clearTimeout(keyTimeOutInputText.current)
        
        keyTimeOutInputText.current = setTimeout(() => {
            setDecks((prev) => (
                prev.map(deck => 
                    deck.id === idDeckEscolhido ?
                        {...deck, helperCard: {...deck.helperCard, create: cardCriacao}}
                        :
                        deck
                )
            ))
        }, 600)
    }, [cardCriacao])


    function addContextToMeaning(idMeaning: string, selectedContext: Context) {
        setCardCriacao((prev) => (
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

        setCardCriacao((prev) => (
            {...prev, [field]: currentValue}
        ))
    }

    function handleNestedChange(field: string, value: string, meaningId: string, exampleId?: string) {
            
        switch(field) {
            case "definition":
                setCardCriacao((prev) => (
                    {...prev, meanings: prev.meanings.map(meaning => 
                        meaning.id === meaningId ?
                            {...meaning, definition: value}
                        :
                            meaning
                        )}
                ))
            break
            case "example":
                setCardCriacao((prev) => (
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
        setCardCriacao((prev) => (
            {...prev, meanings: [...prev.meanings, createEmptyMeaning()]}
        ))
    }

    function removerSignificado(significadoId: string) {
        setCardCriacao((prev) => (
            {...prev, meanings: prev.meanings.filter(meaning => 
                meaning.id !== significadoId)}
        ))
    }

    function removerMeaningContext(significadoId: string, contextId: string) {
        setCardCriacao((prev) => (
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
        setCardCriacao((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === significadoId ?
                    {...meaning, examples: [...meaning.examples, createEmptyExample()]}
                :
                meaning
            )}
        )) 
    }

    function removerExemplo(significadoId: string, exampleId: string) {
        setCardCriacao((prev) => (
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

    return (
    <>
        <section className="screen active" id="screen-form">
        <header className="topbar">
            <button className="icon-btn" id="cancelForm" aria-label="Cancelar">
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
            <h1 className="page-title" id="formTitle">Criar card</h1>
            </div>
        </header>

        <form className="form-card" id="cardForm">
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
                            required 
                            value={cardCriacao.name}
                            onChange={(e) => handleSimpleChange("name", e.target.value)}
                            />
                    </div>

                    <div className="two-cols">
                        <div className="field">
                            <label htmlFor="typeInput">Tipo</label>
                            <select 
                            className="meaning-tag-select" 
                            value={cardCriacao.context}
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
                                value={cardCriacao.synonym}
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
                            value={cardCriacao.phonetic}
                            onChange={(e) => handleSimpleChange("phonetic", e.target.value)}
                            />
                    </div>

                    <div>

                        {cardCriacao.meanings.map((meaning, index: number) => 
                            <div 
                            className="meaning-form"
                            key={meaning.id}
                            data-meaning-id={meaning.id}
                            >
                                <div className="meaning-form-title">
                                    <span>Significado {index+1}</span>
                                    <button 
                                    className="remove-meaning" type="button"
                                    disabled={cardCriacao.meanings.length < 2}
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
                    >Salvar card</button>
                    <div style={{height: "10px"}}></div>
                    <button className="preview-btn" type="button" id="deleteCardBtn">Pré-visualizar card</button>
                    </>   
                }
                
        </form>
    </section>
    </>
    )
}

export default CriarCard