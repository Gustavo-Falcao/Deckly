function DeckCreationModal() {
    return (
        <div className="sheet">
            <h2>Novo deck</h2>
            <div className="field">
                <label htmlFor="deckNameInput">Nome</label>
                <input id="deckNameInput" type="text" placeholder="Ex: Inglês avançado" />
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
                />
            </div>
            <div className="sheet-actions">
                <button 
                className="primary-btn" 
                id="saveDeckBtn"
                >
                    Criar deck
                </button>
                <button 
                className="secondary-btn" id="closeDeckModal"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}

export default DeckCreationModal