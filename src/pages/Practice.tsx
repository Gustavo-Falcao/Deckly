import { useNavigate, useParams } from "react-router-dom"
import type { MeaningPractice, Card, Example } from "../types/Card"
import type { Deck } from "../types/Deck"
import { useEffect, useState, Fragment, useRef } from "react"
import { createEmptyMeaningPractice } from "../helpers/objectsCreation"

type TrainSession = {
    total: number
    current: number
    done: number
}

type Quality = "wrong" | "hard" | "good" | "easy"

function Practice() {

    const navigate = useNavigate()
    const { idDeck } = useParams<{ idDeck: string }>()
    const [decks, setDecks] = useState<Deck[]>(() :Deck[] => {
        const valorLocalStorage = localStorage.getItem("_DECKS_")

        return valorLocalStorage ? JSON.parse(valorLocalStorage) : []
    })
    const deckEscolhido = decks.find(deck => deck.id === idDeck) ?? null
    const [meaningsToPractice, setMeaningsToPractice] = useState<MeaningPractice[]>(() => carregarMeaninsPractice())
    const [currentMeaningPractice, setCurrentMeaningPractice] = useState<MeaningPractice>(() => carregarCurrentMeaningPractice(meaningsToPractice) ?? createEmptyMeaningPractice())
    const [isPracticeDone, setIsPracticeDone] = useState(false)
    const [trainSession, setTrainSession] = useState<TrainSession>({
            total: meaningsToPractice.length,
            current: 0,
            done: 0
    })
    const [inputPalavra, setInputPalavra] = useState("")
    const [isRespostaErrada, setIsRespostaErrada] = useState(false)
    const [isRespostaCorreta, setIsRespostaCorreta] = useState(false)
    const keyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        console.log(decks)

    }, [])

    useEffect(() => {
        localStorage.setItem("_DECKS_", JSON.stringify(decks))

    }, [decks])

    useEffect(() => {
        if((trainSession.total === trainSession.done)) {
            setIsPracticeDone(true)
        }
        console.log("Train session abaixo")
        console.log(trainSession)
    }, [trainSession])

    console.log("PRACTICE DONE => " + isPracticeDone)

    function carregarCurrentMeaningPractice(meaningsPractice: MeaningPractice[]): MeaningPractice {
        const randomIndex = Math.floor(Math.random() * meaningsPractice.length)

        return meaningsPractice[randomIndex]
    }

    //funcao carregar meanings practice aqui

    function carregarMeaninsPractice(): MeaningPractice[] {
        if(!deckEscolhido) return []

        const cardsCurrentDeck: Card[] = deckEscolhido.cards
        let meaningsPracticeArray: MeaningPractice[] = []

        for(const card of cardsCurrentDeck) {
            const meanings = card.meanings
            const now = Date.now();
            const meaningsToBePracticed = meanings.filter(m => {
                const reviewDate = new Date(m.nextReviewDate).getTime()

                return reviewDate <= now
            })
            
            if(meaningsToBePracticed.length > 0) {

                for(let i = 0; i < meaningsToBePracticed.length; i++) {
                    
                    const exemplos = meaningsToBePracticed[i].examples
    
                    const exemplosValidos = exemplos.filter(ex => ex.targetToBeHidden && ex.targetToBeHidden !== "")
    
                    let isExampleComTargeToBeHidden = false
                    let example: Example | undefined
                    
                    if(exemplosValidos.length > 0) {
                        const randomIndex = Math.floor(Math.random() * exemplosValidos.length)
                        example = exemplosValidos[randomIndex]
                        isExampleComTargeToBeHidden = true
                    }
                    
    
                    if(isExampleComTargeToBeHidden) {
                        const meaningPracticeObject: MeaningPractice = {
                            id: meaningsToBePracticed[i].id,
                            idCard: card.id,
                            generalContext: card.context,
                            meaningContexts: meaningsToBePracticed[i].contexts,
                            meaningDefinition: meaningsToBePracticed[i].definition,
                            sentence: example?.text || "",
                            targetResult: example?.targetToBeHidden || "",
                            nextReviewDate: meaningsToBePracticed[i].nextReviewDate,
                            interval: meaningsToBePracticed[i].interval,
                            repetitions: meaningsToBePracticed[i].repetitions,
                            easeFactor: meaningsToBePracticed[i].easeFactor,
                            done: false
                        }
                        
                        meaningsPracticeArray.push(meaningPracticeObject)
                    }
                }
            }
        }

        const arrayEmbaralhado = shuffleArray(meaningsPracticeArray)

        return arrayEmbaralhado
    }

    function shuffleArray(meaningPractice: MeaningPractice[]): MeaningPractice[] {
        const arr = [...meaningPractice]

        for (let i = arr.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }

    function buildMaskedSentence(text: string, target: string): string {
        if (!target || !text) return "";

        const blanked = text.replace(new RegExp(`\\b${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), "______");

        return blanked;
    }

    const maskedText = buildMaskedSentence(currentMeaningPractice.sentence, currentMeaningPractice.targetResult)

    const parts = maskedText.split('______')

    const trainSentence = (
        <p className="train-sentence">
            {parts.map((part, index) => (
                <Fragment key={index}>
                    {part}

                    {index < parts.length - 1 && (
                        <span className="train-blank">______</span>
                    )}
                </Fragment>
            ))}  
        </p>
    )

    function verificarResposta() {
        const resposta = inputPalavra.trim()
        
        if(resposta === currentMeaningPractice.targetResult) {
            if(keyTimeout.current) {
                clearTimeout(keyTimeout.current)
            }

            keyTimeout.current = setTimeout(() => {
                setIsRespostaCorreta(true)
            }, 160)
        } else {
            setIsRespostaErrada(true)
            if(keyTimeout.current) {
                clearTimeout(keyTimeout.current)
            }

            keyTimeout.current = setTimeout(() => {
                handleQualityChoice("wrong")
            }, 4000)
        }
    }

    function addDays(days: number) {
      const d = new Date();
      d.setDate(d.getDate() + days);
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    }

    function applySrsResult(quality: Quality) {
        const updated = { ...currentMeaningPractice };

        if (quality === "wrong") {
            updated.repetitions = 0;
            updated.interval = 1;
            updated.nextReviewDate = addDays(1);
            updated.done = true;
            return updated;
        }

        if (quality === "hard") {
            updated.easeFactor = Math.max(1.3, (currentMeaningPractice.easeFactor ?? 2.5) - 0.15);
        } else if (quality === "good") {
            updated.easeFactor = currentMeaningPractice.easeFactor ?? 2.5;
        } else if (quality === "easy") {
            updated.easeFactor = Math.min(5.0, Math.max(1.3, currentMeaningPractice.easeFactor + 0.15));
        }

        const newReps = (currentMeaningPractice.repetitions ?? 0) + 1;
        updated.repetitions = newReps;

        let newInterval;
        if (newReps === 1) {
            newInterval = 1;
        } else if (newReps === 2) {
            newInterval = 4;
        } else {
            const prevInterval = currentMeaningPractice.interval ?? 1;
            newInterval = Math.round(prevInterval * (updated.easeFactor ?? 2.5));
        }

        updated.interval = newInterval;
        updated.nextReviewDate = addDays(newInterval);
        updated.done = true;
        return updated;
    }

    function handleQualityChoice(quality: Quality) {
        const currentMeaningPracticeUpdated: MeaningPractice = applySrsResult(quality)

        const updatedDeck = decks.map(deck => deck.id === idDeck ?
            {...deck, cards: deck.cards.map(card => card.id === currentMeaningPracticeUpdated.idCard ? 
                {...card, meanings: card.meanings.map(meaning => meaning.id === currentMeaningPracticeUpdated.id ?
                    {...meaning, nextReviewDate: currentMeaningPracticeUpdated.nextReviewDate, interval: currentMeaningPracticeUpdated.interval, repetitions: currentMeaningPracticeUpdated.repetitions, easeFactor: currentMeaningPracticeUpdated.easeFactor} 
                    : 
                    meaning
                )}
                :
                card
            )}
            :
            deck
        )

        const newCurrentMeaningPractice: MeaningPractice = meaningsToPractice.find(meaning => meaning.done !== true && meaning.id !== currentMeaningPractice.id) ?? createEmptyMeaningPractice()

        const newMeaningsToPractice: MeaningPractice[] = meaningsToPractice.map(meaning => meaning.id === currentMeaningPracticeUpdated.id ? 
                {...currentMeaningPracticeUpdated}
            :
                meaning
        )

        console.log("New MeaningPractice abaixo")
        console.log(newCurrentMeaningPractice)
        console.log("Array meaningsToPractice abaixo")
        console.log(meaningsToPractice)

        setDecks(updatedDeck)
        setCurrentMeaningPractice(newCurrentMeaningPractice)
        setMeaningsToPractice(newMeaningsToPractice)
        setTrainSession((prevTrainSession) => ({
            ...prevTrainSession,
            current: prevTrainSession.current + 1, 
            done: prevTrainSession.done + 1, 
        }))
        setIsRespostaCorreta(false)
        setIsRespostaErrada(false)
        setInputPalavra("")
    }

    return (
        <section className="screen active" id="screen-train">
            <header className="train-header">
                <button 
                className="icon-btn" 
                id="exitTrainBtn" 
                aria-label="Sair do treino"
                onClick={() => {navigate(`/decks/${idDeck}/cards`)}}
                >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
                </button>
                <div className="train-progress-wrap">
                <div className="train-progress-label">
                    <span id="trainProgressText">{trainSession?.done} / {trainSession?.total}</span>
                    <span id="trainDeckName">{deckEscolhido?.name}</span>
                </div>
                <div className="train-progress-bar">
                    <div className="train-progress-fill" id="trainProgressFill" style={{width: `${trainSession.total ? Math.round((trainSession.done / trainSession.total) * 100) : 0}%`}}></div>
                </div>
                </div>
            </header>

            <div id="trainContent">
                {isPracticeDone ?
                    <div className="train-done">
                        <div className="train-done-emoji">🎉</div>
                        <h2>Sessão concluída!</h2>
                        <p>Você revisou {trainSession.total} {trainSession.total > 1 ? "cards" : "card"} hoje.<br/>Continue praticando para fixar o vocabulário.</p>
                        <button 
                        className="primary-btn" 
                        id="trainFinishBtn" 
                        style={{maxWidth:"280px"}}
                        onClick={() => navigate(`/decks/${idDeck}/cards`)}
                        >
                            Voltar ao deck
                        </button>
                    </div>
                :
                    <Fragment>
                        <div className="train-sentence-card">
                            <div className="train-meta">
                                {currentMeaningPractice.meaningDefinition ?
                                    <span 
                                    className="tag neutral" 
                                    style={{fontSize: "0.7rem"}}
                                    >
                                        {currentMeaningPractice.meaningDefinition}
                                    </span> 
                                : 
                                    ""
                                }
                                <div className="box-meanings">
                                    <span className="train-pos">
                                        {currentMeaningPractice.generalContext || ""}
                                    </span>
                                    {currentMeaningPractice.meaningContexts.length > 0 &&
                                    <div style={{display: "flex",gap: "2px"}}>
                                        {currentMeaningPractice.meaningContexts.map(cont => 
                                            <span
                                            key={cont.id}
                                            className={`tag ${cont.context}`}
                                            >{cont.context}</span>
                                        )}
                                    </div>}
                                </div>
                            </div>
                            {trainSentence}

                        </div>
                        <div 
                        className={`train-wrong-answer ${isRespostaErrada ? "visible" : ""}`}
                        id="trainWrongMsg">
                            <span>✗</span>
                            <span id="trainWrongText">
                                A resposta correta era {currentMeaningPractice?.targetResult}
                            </span>
                        </div>

                        <div className="train-input-area">
                            <input
                            className={`train-input ${isRespostaErrada ? 'is-wrong' : isRespostaCorreta ? 'is-correct' : ''}`}
                            id="trainInput"
                            type="text"
                            placeholder="Digite a palavra..."
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            onChange={(e) => setInputPalavra(e.target.value)}
                            value={inputPalavra}
                            />
                            <button 
                            className={`train-check-btn ${isRespostaCorreta || isRespostaErrada ? 'hide' : ''}`}
                            id="trainCheckBtn"
                            onClick={verificarResposta}
                            
                            >Verificar</button>
                        </div>

                        <div className={`train-feedback-section ${isRespostaCorreta ? 'visible' : ''}`} id="trainFeedback">
                            <p className="train-feedback-question">Como foi recuperar essa palavra da memória?</p>
                            <div className="train-feedback-btns">
                                <button 
                                className="feedback-btn hard" 
                                data-quality="hard"
                                onClick={() => handleQualityChoice("hard")}
                                >Difícil
                                <small>Quase não lembrei</small>
                                </button>
                                <button 
                                className="feedback-btn good" 
                                data-quality="good"
                                onClick={() => handleQualityChoice("good")}
                                >
                                    Bom<small>Esforcei um pouco</small>
                                </button>
                                <button 
                                className="feedback-btn easy"
                                data-quality="easy"
                                onClick={() => handleQualityChoice("easy")}
                                >
                                    Fácil<small>Lembrei na hora</small>
                                </button>
                            </div>
                        </div>
                    </Fragment>
                }
            </div>
        </section>
    )
}

export default Practice