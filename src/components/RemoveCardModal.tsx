type RemoverCardProps = {
    onClose: () => void
    isOpen: boolean
    onDelete: () => void
}

function RemoveCardModal({onClose, isOpen, onDelete}: RemoverCardProps) {
    if(!isOpen) return
    
    return (
        <div className="box-delete-card">
            <div className="campo-info">
                <h2>Deseja deletar o card ?</h2>
                <p>
                    Ao clicar em confirmar a ação não poderá ser desfeita.
                </p>
            </div>
            <div className="options-delete-card">
                <button 
                className="bot-modal-delete-card"
                onClick={onClose}
                >Cancel</button>
                <button 
                className="bot-modal-delete-card fechar"
                onClick={onDelete}
                >Confirmar</button>
            </div>
        </div>
    )
}

export default RemoveCardModal