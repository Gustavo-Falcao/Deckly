import Decks from "./Decks"
import Cards from "./Cards"
import CriarCard from "./CriarCard"
import { Route, Routes, Navigate } from "react-router-dom"
import BottomNav from "../components/BottomNav"
import { useState } from "react"
import ToastInfo from "../components/ToastInfo"

export type ToastInfo = {
  msg: string;
  type: "" | "error" | "success";
  isOpen: boolean
}

function App() {
    const [propsToastIno, setPropsToastIno] = useState<ToastInfo>({
        msg: "",
        type: "",
        isOpen: false
    })

    function setarToastInfo({ msg, type, isOpen }: ToastInfo) {
      setPropsToastIno({msg: msg, type: type, isOpen: isOpen})
    }
    
  return (
    <>
      <main className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/decks" replace />}/> 
          <Route path="/decks" element={<Decks/>} />
          <Route path="/cards" element={<Cards setPropsToastInfo={setarToastInfo}/>} />
          <Route path="/decks/:idDeck/cards" element={<Cards setPropsToastInfo={setarToastInfo}/>} />
          <Route path="/novo" element={<CriarCard mode="criar" setPropsToastInfo={setarToastInfo}/>} />
          <Route path="/decks/:idDeck/cards/novo" element={<CriarCard mode="criar" setPropsToastInfo={setarToastInfo}/>}/>
          <Route path="/decks/:idDeck/cards/:idCard/editar" element={<CriarCard mode="editar" setPropsToastInfo={setarToastInfo}/>} />
        </Routes>
      </main>
      
      <BottomNav />

      <ToastInfo msg={propsToastIno.msg} type={propsToastIno.type} isOpen={propsToastIno.isOpen} onClose={() => setPropsToastIno({msg: "", type: "", isOpen: false})}/>
    </>
  )
}

export default App
