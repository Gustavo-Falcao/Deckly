import { useState, type JSX } from "react";
import type { Deck } from "../types/Deck";
import type { CardFormData } from "../types/Card";
import { createEmptyCardFormData } from "../helpers/objectsCreation"  

function CriarCard() {

    type DeckOption = {
        id: string
        name: string
    }

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
                            />
                    </div>

                    <div className="two-cols">
                        <div className="field">
                            <label htmlFor="typeInput">Tipo</label>
                            <input 
                                id="typeInput" 
                                type="text" 
                                placeholder="adjective" 
                                value={cardCriacao.context}
                                />
                        </div>
                        <div className="field">
                            <label htmlFor="synonymInput">Sinônimo</label>
                            <input 
                                id="synonymInput" 
                                type="text" 
                                placeholder="loud" 
                                value={cardCriacao.synonym}
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
                            />
                    </div>

                    <div className="meaning-form">
                        <div className="meaning-form-title">
                            <span>Significado index</span>
                            <button className="remove-meaning" type="button">Remover</button>
                        </div>

                        <div className="field">
                            <label>Definição</label>
                            <textarea 
                            className="meaning-definition"
                            placeholder="Explique o significado"
                            >
                            {/* value aqui */}
                            </textarea>
                        </div>

                        <div className="field">
                            <label>Contexto</label>
                            <div className="context-tools">
                                <select className="meaning-tag-select">
                                <option value="literal">literal</option>
                                <option value="figurative">figurative</option>
                                </select>
                                <button className="inline-action add-tag" type="button">Adicionar</button>
                            </div>
                            <div className="selected-tags"></div>
                        </div>

                        <div className="examples-container">
                            <div className="example-field">
                            <div className="example-title">
                                <label>Exemplo index</label>
                                <button 
                                    className="remove-example" 
                                    type="button" 
                                    data-example-index="${index}" 
                                    // ${canRemove ? "" : "disabled"}
                                    >
                                        Remover
                                </button>
                            </div>
                            <textarea 
                                className="meaning-example" 
                                placeholder="Exemplo"
                                >
                                    {/* exemplo aqui */}
                            </textarea>
                            </div>
                        </div>
                        <button 
                        className="secondary-btn add-example" 
                        type="button"
                        >
                            + Adicionar exemplo
                        </button>
                    </div>



                    <button className="secondary-btn" type="button" id="addMeaning">
                        + Adicionar significado
                    </button>
                    <div style={{height: "12px"}}></div>
                    <button
                    className="primary-btn" 
                    type="submit"
                    >Salvar card</button>
                    <div style={{height: "10px"}}></div>
                    <button className="danger-btn" type="button" id="deleteCardBtn">Excluir card</button>
                    </>
                        
                }
                

            {/* <div className="field">
                <label htmlFor="wordInput">Palavra</label>
                <input id="wordInput" type="text" placeholder="Ex: Strident" required />
            </div>

            <div className="two-cols">
                <div className="field">
                    <label htmlFor="typeInput">Tipo</label>
                    <input id="typeInput" type="text" placeholder="adjective" />
                </div>
                <div className="field">
                    <label htmlFor="synonymInput">Sinônimo</label>
                    <input id="synonymInput" type="text" placeholder="loud" />
                </div>
            </div>

            <div className="field">
                <label htmlFor="phoneticInput">Pronúncia</label>
                <input id="phoneticInput" type="text" placeholder="/ STRAI-dənt /" />
            </div>

            <div id="meaningsContainer"></div>

            <button className="secondary-btn" type="button" id="addMeaning">
                + Adicionar significado
            </button>
            <div style={{height: "12px"}}></div>
            <button
            className="primary-btn" 
            type="submit"
            onClick={mostrarQualDeckFoiEscolhido}
            >Salvar card</button>
            <div style={{height: "10px"}}></div>
            <button className="danger-btn" type="button" id="deleteCardBtn">Excluir card</button> */}
        </form>
    </section>
    </>
    )
}

export default CriarCard