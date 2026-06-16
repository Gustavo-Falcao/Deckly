import Decks from "./Decks"
import Cards from "./Cards"
import CriarCard from "./CriarCard"
import { Route, Routes, Navigate } from "react-router-dom"
import BottomNav from "../components/BottomNav"
import Practice from "./Practice"

function App() {

  return (
    <>
      <main className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/decks" replace />}/> 
          <Route path="/decks" element={<Decks/>} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/decks/:idDeck/cards" element={<Cards/>} />
          <Route path="/novo" element={<CriarCard mode="criar"/>} />
          <Route path="/decks/:idDeck/cards/novo" element={<CriarCard mode="criar"/>}/>
          <Route path="/decks/:idDeck/cards/:idCard/editar" element={<CriarCard mode="editar"/>} />
          <Route path="/decks/:idDeck/cards/practice" element={<Practice/>}/>
        </Routes>
      </main>
      
      <BottomNav />
    </>
  )
}

export default App
