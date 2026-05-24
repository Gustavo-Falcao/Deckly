
type ModalEditWarningProps = {
    isOpen: boolean
    nomeEditCard: string | undefined
    onClose: () => void
    saveChanges: () => void
    discardChanges: () => void
}

function ModalEditWarning({isOpen, nomeEditCard, onClose, saveChanges, discardChanges}: ModalEditWarningProps) {
    if(isOpen) {
            return (
            <div className="box-modal-info">
                <div className="icon-wrap" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <div className="campo-info">
                    <div className="title-info">
                        Você tem alterações não salvas
                    </div>
                    <p>
                        O card <strong>{nomeEditCard}</strong> tem alterações pendentes.
                        <br></br>
                        O que deseja fazer com elas ?
                    </p>
                </div>
                <div className="options-delete-card">
                    <button 
                    className="bot-modal-delete-card"
                    onClick={saveChanges}
                    >Salvar alterações</button>
                    <button 
                    className="bot-modal-delete-card fechar"
                    onClick={discardChanges}
                    >Descartar alterações</button>
                    <button 
                    className="bot-modal-delete-card"
                    onClick={onClose}
                    >Voltar</button>
                </div>
            </div>
        )
    }
}

export default ModalEditWarning