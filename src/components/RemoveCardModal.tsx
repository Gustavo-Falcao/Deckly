type RemoverCardProps = {
    onClose: () => void
    isOpen: boolean
    onDelete: () => void
    nomeDeck: string
    nomeCard: string
}

function RemoveCardModal({onClose, isOpen, onDelete, nomeDeck, nomeCard}: RemoverCardProps) {
    if(!isOpen) return
    
    return (
        <div className="box-modal-info">
            <div className="campo-info">
                <div className="title-info">
                    {`Deseja deletar "${nomeCard}"?`}
                </div>
                <p>
                    A exclusão deste card resultará em sua remoção definitiva do deck "{nomeDeck}".
                </p>
            </div>
            <div className="options-delete-card">
                <button 
                className="bot-modal-delete-card fechar"
                onClick={onDelete}
                >Deletar Card</button>
                <button 
                className="bot-modal-delete-card"
                onClick={onClose}
                >Cancelar</button>
            </div>
        </div>
    )
}

export default RemoveCardModal