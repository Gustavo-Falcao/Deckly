import { useState, type JSX } from "react";
import type { Deck } from "../types/Deck";

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
    const [nomeDeckEscolhido, setNomeDeckEscolhido] = useState("")
    const optionDecks: DeckOption[] = decks.map((deck) => {
        return {
            id: deck.id,
            name: deck.name
        }
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
                value={nomeDeckEscolhido}
                onChange={(e) => setNomeDeckEscolhido(e.target.value)}
                >
                    <option value="" hidden>Deck</option>
                    {optionDecks.map((deck) : JSX.Element => 
                        <option key={deck.id} value={deck.name}>{deck.name}</option>
                    )}
                </select>
            </div>

            <div className="field">
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
            <button className="primary-btn" type="submit">Salvar card</button>
            <div style={{height: "10px"}}></div>
            <button className="danger-btn" type="button" id="deleteCardBtn">Excluir card</button>
        </form>
    </section>
    </>
    )
}

export default CriarCard