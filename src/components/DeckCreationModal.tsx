import { useState } from "react"
import type { Deck } from "../types/Deck"
import { createDeck } from "../helpers/objectsCreation"
import type { ToastInfo } from "../pages/App"

type DeckCreationModalProps = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (deck: Deck) => void
    mode: "create" | "edit" | ""
    deck: Deck | undefined
    setPropsToastInfo: ({ msg, type, isOpen }: ToastInfo) => void;
    onDelete: () => void
}

function DeckCreationModal({ isOpen, onClose, onSubmit, mode, deck, setPropsToastInfo, onDelete }: DeckCreationModalProps) {
    const [inputNome, setInputNome] = useState<string>((): string => {
        return deck ? deck.name : ""
    })
    const [inputEmoji, setInputEmoji] = useState<string>((): string => {
        return deck ? deck.emoji : ""
    })

    function submitDeckWithSimpleValidation() {
        if(inputNome.trim().length < 1) {
            setPropsToastInfo({
                msg: "O deck deve ter um nome!",
                type: "error",
                isOpen: true
            })
            return
        }

        if(mode === "edit") {
            if(!deck) {
                setPropsToastInfo({
                    msg: "O deck para editar é inválido!",
                    type: "error",
                    isOpen: true
                })
                return
            }
            onSubmit(atualizarDeck(deck))
        } else {
            onSubmit(createDeck(inputNome, inputEmoji))
        }

        setPropsToastInfo({
            msg: `Deck ${mode === "create" ? "criado" : "atualizado"} com sucesso!`,
            type: "success",
            isOpen: true
        })
    }

    function atualizarDeck(deck: Deck): Deck {
        return {...deck, name: inputNome, emoji: inputEmoji}
    }

    if(!isOpen) return null
    
    return (

        <div className="sheet">
            <h2>{mode === "create" ? "Novo deck" : mode === "edit" ? "Editar deck" : ""}</h2>
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
                onClick={submitDeckWithSimpleValidation}
                >
                    {mode === "create" ? "Criar" : "Salvar"} deck
                </button>
                <button 
                className="secondary-btn" 
                id="closeDeckModal"
                onClick={onClose}
                >
                    Cancelar
                </button>
                {mode === "edit" && (
                    <button 
                    className="danger-btn" 
                    type="button" 
                    id="deleteDeckBtn"
                    onClick={onDelete}
                    >Excluir deck</button>
                )}
            </div>
        </div>
    )
}

export default DeckCreationModal
