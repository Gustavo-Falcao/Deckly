import Decks from "./Decks"
import Cards from "./Cards"
import { useState } from "react"
import CriarCard from "./CriarCard"

function App() {
  const [page, setPage] = useState("decks")

  return (
    <>
      <main className="app">
        {page === "decks" ? <Decks/> : page === "cards" ? <Cards/> : <CriarCard/>}
      </main>
      <nav className="bottom-nav" aria-label="Menu inferior">
        <button 
        className={`nav-item ${page === "decks" && "active"}`}  
        data-screen="screen-decks"
        onClick={() => {setPage("decks")}}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path 
            d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" 
            stroke="currentColor" 
            strokeWidth={2} 
            />
            <path 
            d="M8 9h8M8 13h5" 
            stroke="currentColor" 
            strokeWidth={2} 
            strokeLinecap="round" 
            />
          </svg>
          Decks
        </button>
        <button 
        className={`nav-item ${page === "cards" && "active"}`} 
        id="navCards"
        onClick={() => {setPage("cards")}}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path 
            d="M7 7.5h10M7 12h7M7 16.5h5" 
            stroke="currentColor" 
            strokeWidth={2}
            strokeLinecap="round" 
            />
            <path 
            d="M5.5 3.5h13A2.5 2.5 0 0 1 21 6v12a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18V6a2.5 2.5 0 0 1 2.5-2.5Z" 
            stroke="currentColor" 
            strokeWidth={2}
            />
          </svg>
          Cards
        </button>
        <button 
        className={`nav-item ${page === "criarCard" && "active"}`} 
        id="navCreate"
        onClick={() => {setPage("criarCard")}}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path 
            d="M12 5v14M5 12h14" 
            stroke="currentColor" 
            strokeWidth={2.4} 
            strokeLinecap="round" 
            />
          </svg>
          Novo
        </button>
      </nav>
    </>
  )
}

export default App
