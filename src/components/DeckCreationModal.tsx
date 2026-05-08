import { useState } from "react"
import type { Deck } from "../types/Deck"
import { createDeck } from "../helpers/objectsCreation"

type DeckCreationModalProps = {
    onClose: () => void
    onCreateDeck: (deck: Deck) => void
}

function DeckCreationModal({ onClose, onCreateDeck }: DeckCreationModalProps) {
//colocar state dos inputs e pegar parametro da funcao de setar os decks
    const [inputNome, setInputNome] = useState("")
    const [inputEmoji, setInputEmoji] = useState("")

    function createDeckWithSimpleValidation() {
        if(inputNome.trim().length < 1) {
            alert("O card deve ter um nome")
            return
        }

        onCreateDeck(createDeck(inputNome, inputEmoji))
    }

    return (
        <div className="sheet">
            <h2>Novo deck</h2>
            <div className="field">
                <label htmlFor="deckNameInput">Nome</label>
                <input
                id="deckNameInput" 
                type="text" 
                placeholder="Ex: Inglês avançado" 
                value={inputNome}
                onChange={(e) => setInputNome(e.target.value)}
                />
            </div>
            <div className="field">
                <label htmlFor="deckEmojiInput">
                    Emoji
                </label>
                <input 
                id="deckEmojiInput" 
                type="text" 
                maxLength={2} 
                placeholder="📚" 
                value={inputEmoji}
                onChange={(e) => setInputEmoji(e.target.value)}
                />
            </div>
            <div className="sheet-actions">
                <button 
                className="primary-btn" 
                id="saveDeckBtn"
                onClick={createDeckWithSimpleValidation}
                >
                    Criar deck
                </button>
                <button 
                className="secondary-btn" 
                id="closeDeckModal"
                onClick={onClose}
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}

export default DeckCreationModal
