function Decks() {
    return (
    <>
        <section className="screen active" id="screen-decks">
            <header className="topbar">
                <div>
                    <p className="eyebrow">Vocabulário</p>
                    <h1 className="page-title">Meus decks</h1>
                </div>
                <button className="icon-btn" id="openDeckModal" aria-label="Criar deck">
                    <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    aria-hidden="true"
                    >
                        <path 
                        d="M12 5v14M5 12h14" 
                        stroke="currentColor" 
                        stroke-width="2.4" 
                        stroke-linecap="round" 
                        />
                    </svg>
                </button>
            </header>

            <input
             className="search-box" 
             id="deckSearch" 
             type="search" 
             placeholder="Buscar deck..." 
             />

            <h2 className="section-title">Coleções</h2>
            <div className="deck-grid" id="deckGrid"></div>
        </section>
    </>
    )
}

export default Decks