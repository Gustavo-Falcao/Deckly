import Decks from "./Decks"
import Cards from "./Cards"
import CriarCard from "./CriarCard"
import { Route, Routes } from "react-router-dom"
import BottomNav from "../components/BottomNav"

function App() {

  return (
    <>
      <main className="app">
        <Routes>
          <Route path="/" element={<Decks/>} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/decks/:idDeck/cards" element={<Cards/>} />
          <Route path="/novo" element={<CriarCard/>} />
          <Route path="/decks/:idDeck/cards/novo" element={<CriarCard/>}/>
          <Route path="/decks/:idDeck/cards/:idCard/editar" element={<CriarCard/>} />
        </Routes>
      </main>
      
      <BottomNav />
    </>
  )
}

export default App
