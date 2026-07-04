import type { Deck } from "../types/Deck"

type RemoverDeckModalProps = {
    isOpen: boolean
    deck: Deck | undefined;
    onDelete: () => void
    onClose: () => void
}

function RemoverDeckModal({ isOpen, deck, onDelete, onClose }: RemoverDeckModalProps) {
    if(!isOpen) return null

    return (
        <div className="box-modal-info">
            <div className="campo-info">
                <div className="title-info">
                    {`Deseja deletar "${deck?.name}"?`}
                </div>
                <p>
                    Deseja excluir o deck "{deck?.name}" e seus {deck?.cards.length} {deck?.cards.length && deck?.cards.length > 1 ? "cards" : "card"} ?
                </p>
            </div>
            <div className="options-delete-card">
                <button 
                className="bot-modal-delete-card fechar"
                onClick={onDelete}
                >Deletar Deck</button>
                <button 
                className="bot-modal-delete-card"
                onClick={onClose}
                >Cancelar</button>
            </div>
        </div>
    )
}

export default RemoverDeckModal