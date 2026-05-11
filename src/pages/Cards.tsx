function Cards() {
    return (
    <>
        <section className="screen active" id="screen-cards">
            <header className="topbar">
                <button className="icon-btn" id="backToDecks" aria-label="Voltar para decks">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                        d="M15 18l-6-6 6-6" 
                        stroke="currentColor" 
                        strokeWidth="2.4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        />
                    </svg>
                </button>
                <div style={{flex: 1}}>
                    <p className="eyebrow">Deck aberto</p>
                    <h1 className="page-title" id="currentDeckTitle">Inglês</h1>
                </div>
                <button className="icon-btn" id="newCardFromDeck" aria-label="Criar card">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                        d="M12 5v14M5 12h14" 
                        stroke="currentColor" 
                        strokeWidth="2.4" 
                        strokeLinecap="round" 
                        />
                    </svg>
                </button>
            </header>

            <input className="search-box" id="cardSearch" type="search" placeholder="Buscar palavra no deck..." />

            <h2 className="section-title">Cards</h2>
            <div className="cards-list" id="cardsList"></div>
        </section>
    </>
    )
}

export default Cards