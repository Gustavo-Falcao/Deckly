import { useEffect, useRef, useState } from "react";
import type { Deck, DeckOption } from "../types/Deck";
import type { CardFormData, Context, Card, CardEdit, Meaning, TempoVerbal, ModoVerbal } from "../types/Card";
import { createEmptyCardFormData, createEmptyMeaning, createContextObject, createEmptyExample } from "../helpers/objectsCreation"  
import ModalBackGround from "../components/ModalBackGround";
import CardPreview from "../components/CardPreview";
import HideWordModal from "../components/HideWordModal";
import { useParams, useNavigate } from "react-router-dom";
import { useHideOnScroll } from "../hooks/useHideOnScroll";
import type { ToastInfo } from "./App";
import Select from "../components/Select";
import FieldSelectModoAndTempoVerbal from "../components/FieldSelectModoAndTempoVerbal";

type CriarCardMode = "criar" | "editar"

type CriarCardProps = {
    mode: CriarCardMode,
    setPropsToastInfo: ({ msg, type, isOpen }: ToastInfo) => void
}

export type ContextOption = {
    value: string;
    name: string;
}

type ExampleTextHide = {
    idExample: string
    idMeaning: string
    text: string
    wordCurrentlyHide: string
}

type MostrarModoAndTempoVerbalObject = {
    isTypePalavraVerb: boolean;
    meaningsComVerb: MeaningComVerb[]
}

type MeaningComVerb = {
    idMeaning: string
    hasVerbAsContext: boolean
}

const contextOptions: ContextOption[] = [
    {value: "adjective", name: "Adjective"},
    {value: "adverb", name: "Adverb"},
    {value: "figurative", name: "Figurative"},
    {value: "formal", name: "Formal"},
    {value: "informal", name: "Informal"},
    {value: "literal", name: "Literal"},
    {value: "modal verb", name: "Modal Verb"},
    {value: "noun", name: "Noun"},
    {value: "phrase", name: "Phrase"},
    {value: "preposition", name: "Preposition"},
    {value: "slang", name: "Slang"},
    {value: "verb", name: "Verb"}
]

const tempoVerbalOptions: ContextOption [] = [
    {value: "Pres. Simple", name: "Pres. Simple"},
    {value: "Pres. Continuous", name: "Pres. Continuous"},
    {value: "Pres. Perfect", name: "Pres. Perfect"},
    {value: "Pres. Participle", name: "Pres. Participle"},
    {value: "Pres. Perf. Cont.", name: "Pres. Perf. Cont."},
    {value: "Past Simple", name: "Past Simple"},
    {value: "Past Participle", name: "Past Participle"},
    {value: "Past Continuous", name: "Past Continuous"},
    {value: "Past Perfect", name: "Past Perfect"},
    {value: "Past Perf. Cont.", name: "Past Perf. Cont."},
    {value: "Fut. Simple", name: "Fut. Simple"},
    {value: "Fut. Continuous", name: "Fut. Continuous"},
    {value: "Fut. Perfect", name: "Fut. Perfect"},
    {value: "Fut. Perf. Cont.", name: "Fut. Perf. Cont."}
]

const modoVerbalOptions: ContextOption [] = [
    {value: "imperative", name: "Imperative"},
    {value: "conditional", name: "Conditional"},
    {value: "subjunctive", name: "Subjunctive"},
    // {value: "passive voice", name: "Passive Voice"},
    {value: "infinitive", name: "Infinitive"},
    {value: "indicative", name: "Indicative"}
]

function CriarCard({ mode, setPropsToastInfo }: CriarCardProps) {
    const { idDeck, idCard } = useParams<{idDeck: string, idCard: string}>()
    const navigate = useNavigate()
    const [decks, setDecks] = useState<Deck[]>(() :Deck[] => {
            const valorLocalStorage = localStorage.getItem("_DECKS_")
    
            if(!valorLocalStorage)
                return []
    
            return JSON.parse(valorLocalStorage);
        })
    const [idDeckEscolhido, setIdDeckEscolhido] = useState((): string => {
        return idDeck ? idDeck : ""
    })
    const optionDecks: DeckOption[] = decks.map((deck) => {
        return {
            value: deck.id,
            name: deck.name
        }
    })
    const [cardForm, setCardForm] = useState<CardFormData | CardEdit>(() :CardFormData | CardEdit => {
        if(decks.length === 0)
            return createEmptyCardFormData();

        const deck = decks.find((deck) => deck.id === idDeckEscolhido)

        if(!deck)
            return createEmptyCardFormData();

        if(mode === "criar")
            return deck.helperCard.create

        if(mode === "editar" && deck.helperCard.edit) 
            return deck.helperCard.edit

        return createEmptyCardFormData()
    })
    const [backGroundModalIsOpen, setBackGroundModalIsOpen] = useState(false)
    const [isModalCardPreviewOpen, setIsModalCardPreviewOpen] = useState(false)
    const [isModalHideWordOpen, setIsModalHideWordOpen] = useState(false)
    const debounceSaveFormTimeoutKey = useRef<ReturnType<typeof setTimeout> | null>(null)
    const titlePage = !mode || mode === "criar" ? "Criar" : "Editar"
    const showTopArea = useHideOnScroll(80)
    const exampleTextToHideModalWord = useRef<ExampleTextHide>({
        idExample: "",
        idMeaning: "",
        text: "",
        wordCurrentlyHide: ""
    })
    const [mostrarModoAndTempoVerbal, setMostrarModoAndTempoVerbal] = useState<MostrarModoAndTempoVerbalObject>(() => {
        let mostrarModoAndTempoVerbalObject: MostrarModoAndTempoVerbalObject = {
            isTypePalavraVerb: false, 
            meaningsComVerb: []
        }

        if(cardForm.context === "verb") {
            mostrarModoAndTempoVerbalObject = {...mostrarModoAndTempoVerbalObject, isTypePalavraVerb: true}
        }
        
        const meanings = cardForm.meanings

        for(let i = 0; i < meanings.length; i++) {

            if(meanings[i].contexts.length === 0) {
                continue
            }

            const objetVerb = meanings[i].contexts.find(cont => cont.context === "verb")

            if(objetVerb) {
                mostrarModoAndTempoVerbalObject = {...mostrarModoAndTempoVerbalObject, meaningsComVerb: [...mostrarModoAndTempoVerbalObject.meaningsComVerb, {idMeaning: meanings[i].id, hasVerbAsContext: true}]}
            }
        }

        return mostrarModoAndTempoVerbalObject
    })
    const [selectedContextByMeaningId, setSelectedContextByMeaningId] = useState<Record<string, Context | "">>({});

    console.log("Card form abaixo")
    console.log(cardForm)

    console.log("ObjecMostrarModoAndTempoVerbal abaixo")
    console.log(mostrarModoAndTempoVerbal)

    useEffect(() => {
        localStorage.setItem("_DECKS_", JSON.stringify(decks))
        console.log("Decks salvos no local storage abaixo")
        console.log(decks)
    }, [decks])


    useEffect(() => {
        console.log(cardForm)
    }, [])

    function separarPalavras(text: string): string[] {
        return String(text).trim().split(/\s+/).filter(Boolean);
    }

    function updateCardForm(updater: (prevCardForm: CardFormData | CardEdit) => CardFormData | CardEdit) {
        if(!idDeckEscolhido) return

        setCardForm((prevCardForm) => {
            const updatedCardForm = updater(prevCardForm)

            if(debounceSaveFormTimeoutKey.current) {
                clearTimeout(debounceSaveFormTimeoutKey.current)
            }

            const currentDeckId = idDeckEscolhido
            const currentMode = mode

            debounceSaveFormTimeoutKey.current = setTimeout(() => {
                setDecks((prevDecks) => prevDecks.map((deck) => 
                    deck.id === currentDeckId ?
                        {...deck, helperCard: {...deck.helperCard, [currentMode === "criar" ? "create" : "edit"]: updatedCardForm}}
                    :
                        deck
                    ))
            }, 600)

            return updatedCardForm
        })
    }

    function handleSelectedDeck(idDeck: string) {
        const selectedDeck = decks.find(deck => deck.id === idDeck)

        if(!selectedDeck) {
            navigate(`/novo`)
            setCardForm(createEmptyCardFormData())
        } else {
            navigate(`/decks/${idDeck}/cards/novo`)
            setCardForm(selectedDeck!.helperCard.create)
        }
            
        setIdDeckEscolhido(idDeck)
    }

    function addContextToMeaning(idMeaning: string, selectedContext: Context) {

        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === idMeaning ? 
                    {...meaning, contexts: [...meaning.contexts, createContextObject(selectedContext)]}
                    :
                    meaning
                )
            }
        ))
 
    }

    function handleSimpleChange(field: keyof CardFormData, value: string) {        
        const currentValue = field === "context" ? value.trim() as Context : value

        updateCardForm((prev) => (
            {...prev, [field]: currentValue}
        ))
    }

    function handleNestedChange(field: string, value: string, meaningId: string, exampleId?: string) {
            
        switch(field) {
            case "definition":
                updateCardForm((prev) => (
                    {...prev, meanings: prev.meanings.map(meaning => 
                        meaning.id === meaningId ?
                            {...meaning, definition: value}
                        :
                            meaning
                        )}
                ))
            break
            case "example":
                updateCardForm((prev) => (
                    {...prev, meanings: prev.meanings.map(meaning => 
                        meaning.id === meaningId ?
                            {...meaning, examples: meaning.examples.map(example => 
                                example.id === exampleId ?
                                    {...example, text: value}
                                :
                                    example
                            )}
                        :
                            meaning
                    )}
                ))
            break
            default: return
        }
    }

    function adicionarSignificado() {
        updateCardForm((prev) => (
            {...prev, meanings: [...prev.meanings, createEmptyMeaning()]}
        ))
    }

    function removerSignificado(significadoId: string) {
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.filter(meaning => 
                meaning.id !== significadoId)}
        ))
    }

    function removerMeaningContext(significadoId: string, contextId: string) {
  
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === significadoId ?
                    {...meaning, contexts: meaning.contexts.filter(context => 
                        context.id !== contextId)
                    }
                : 
                meaning
            )}
        ))
    }

    function adicionarExemplo(significadoId: string) {
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === significadoId ?
                    {...meaning, examples: [...meaning.examples, createEmptyExample()]}
                :
                meaning
            )}
        )) 
    }

    function removerExemplo(significadoId: string, exampleId: string) {
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === significadoId ?
                    {...meaning, examples: meaning.examples.filter(example => 
                        example.id !== exampleId
                    )}
                :
                meaning
            )}
        ))
    }

    function handleTempoAndModoVerbalCardForm(event: React.ChangeEvent<HTMLSelectElement>, field: "tempoVerbal" | "modoVerbal", meaningId: string, exampleId: string) {
        const value = event.target.value
        const valor: TempoVerbal | ModoVerbal | undefined = (value as TempoVerbal | ModoVerbal) || undefined
        
        updateCardForm((prev) => (
            {...prev, meanings: prev.meanings.map(meaning => 
                meaning.id === meaningId ?
                    {...meaning, examples: meaning.examples.map(example => 
                        example.id === exampleId ?
                            {...example, [field]: valor}
                        :
                            example
                    )}
                :
                    meaning
            )}
        ))
    }

    function isCardEdit(card: CardFormData | CardEdit): card is CardEdit {
        return "id" in card
    }

    function salvarCard() {
        const cardToCreate: CardFormData | CardEdit = cardForm;

        if(!cardToCreate.name){
            setPropsToastInfo({
                msg: "O nome do card é obrigatório",
                type: "error",
                isOpen: true
            })
            return
        }

        let isErroEncontrado = false
        for(const meaning of cardToCreate.meanings) {
            if(!meaning.definition || meaning.definition.length < 1) {
                setPropsToastInfo({
                    msg: "A palavra deve ter pelo menos 1 significado!",
                    type: "error",
                    isOpen: true 
                })
                
                return
            }

            const examples = meaning.examples.filter(ex => ex.text.length > 0)

            if(examples.length <= 1) {
                setPropsToastInfo({
                    msg: "Deve ter pelo menos 2 exemplos por significado!",
                    type: "error",
                    isOpen: true
                })
                isErroEncontrado = true
                break
            }
        }

        if(isErroEncontrado) return

        const currentMode = mode

        if(currentMode === "criar") {
            if(!isCardEdit(cardToCreate)) {
                criarCard(cardToCreate)
                voltarParaCardsDoModeCreate()
            } else {
                alert("Não foi possível criar: id já existe.")
            }
        }
        else {
            if(isCardEdit(cardToCreate)) {
                salvarEdicaoCard(cardToCreate)
                voltarParaCardsDoModeEdit()
            } else {
                alert("Não foi possível editar: card sem id.")
            }
        }
    }

    function criarCard(cardFormCreate: CardFormData) {

        const meanings: Meaning[] = cardFormCreate.meanings.map(meaning => ({
            id: meaning.id,
            definition: meaning.definition,
            contexts: meaning.contexts,
            examples: meaning.examples,
            nextReviewDate: new Date().toISOString(),
            interval: 0,
            repetitions: 0,
            easeFactor: 2.5,
            isInReview: false
        }))

        const card: Card = {
            id: crypto.randomUUID(),
            name: cardFormCreate.name,
            context: cardFormCreate.context as Context || undefined,
            synonym: cardFormCreate.synonym,
            phonetic: cardFormCreate.phonetic,
            creationDate: new Date().toISOString(),
            meanings: meanings
        }


        const emptyCardCriacao = createEmptyCardFormData()

        setDecks((prevDecks) => prevDecks.map((deck) => 
            deck.id === idDeckEscolhido ?
                {...deck, cards: [card, ...deck.cards], helperCard: {...deck.helperCard, create: emptyCardCriacao}}
            :
                deck
        ))

        setPropsToastInfo({
            msg: "Card criado com sucesso!",
            type: "success",
            isOpen: true
        })

    }

    function salvarEdicaoCard(cardFormEdit: CardEdit) {
        console.log("ENtrou na funcao")
        const cardToBeEdited = decks.find(deck => deck.id === idDeck)?.cards.find(card => card.id === cardFormEdit.id);

        if(!cardToBeEdited) return
        
        let meaningsAtualizado: Meaning[] = []

        const meaningsForm = cardFormEdit.meanings
        const meanings = cardToBeEdited.meanings

        for(const meaningForm of meaningsForm) {
            let meaningInserido = false
            
            for(const meaning of meanings) {
                if(meaningForm.id === meaning.id) {
                    meaningsAtualizado.push({
                        ...meaningForm, 
                        nextReviewDate: meaning.nextReviewDate, 
                        interval: meaning.interval, 
                        repetitions: meaning.repetitions, 
                        easeFactor: meaning.easeFactor,
                        isInReview: meaning.isInReview
                    })
                    meaningInserido = true
                    break
                }
            }

            if(!meaningInserido) {
                meaningsAtualizado.push({
                    ...meaningForm,
                    nextReviewDate: new Date().toISOString(),
                    interval: 0,
                    repetitions: 0,
                    easeFactor: 2.5,
                    isInReview: false
                })
            }
        }

        const cardAtualizado: Card = {
            id: cardFormEdit.id,
            name: cardFormEdit.name,
            context: cardFormEdit.context,
            synonym: cardFormEdit.synonym,
            phonetic: cardFormEdit.phonetic,
            creationDate: cardFormEdit.creationDate,
            meanings: [...meaningsAtualizado]
        }


        setDecks((prevDecks) => prevDecks.map((deck) => 
            deck.id === idDeckEscolhido ?
                {...deck, 
                    cards: deck.cards.map((card) => 
                        card.id === cardFormEdit.id ?
                            cardAtualizado
                        :
                            card),
                    helperCard: {...deck.helperCard, edit: undefined}}
            :
                deck
        ))

        setPropsToastInfo({
            msg: "Alterações salvas com sucesso!",
            type: "success",
            isOpen: true
        })
    }

    function voltarParaCardsDoModeCreate() {
        if(!idDeckEscolhido) return

        navigate(`/decks/${idDeckEscolhido}/cards`)
    }

    function voltarParaCardsDoModeEdit() {
        if(!idDeckEscolhido) return

        navigate(`/decks/${idDeckEscolhido}/cards?backgroundModal=true&modalMode=card&idCard=${idCard}`)
    }

    function abrirModalCardPreview() {
        setIsModalCardPreviewOpen(true)
        setBackGroundModalIsOpen(true)
    }

    function fecharModalCardPreview() {
        setIsModalCardPreviewOpen(false)
        setBackGroundModalIsOpen(false)
    }

    function abrirModalHideWord(exampleText: string, idExample: string, idMeaning: string, wordCurrentlyHide: string) {
        exampleTextToHideModalWord.current = {
            idExample: idExample, 
            idMeaning: idMeaning, 
            text: exampleText,
            wordCurrentlyHide: wordCurrentlyHide
        }
        setIsModalHideWordOpen(true)
        setBackGroundModalIsOpen(true)
    }

    function fecharModalHideWord() {
        exampleTextToHideModalWord.current = {
            idExample: "", 
            idMeaning: "", 
            text: "",
            wordCurrentlyHide: ""
        }
        setIsModalHideWordOpen(false)
        setBackGroundModalIsOpen(false)
    }

    function ocultarPalavra(wordToHide: string) {
        const meaningId = exampleTextToHideModalWord.current.idMeaning
        const exampleId = exampleTextToHideModalWord.current.idExample

        updateCardForm((prevCardForm) => (
            {...prevCardForm, meanings: prevCardForm.meanings.map((meaning) => 
                meaning.id === meaningId ? 
                    {...meaning, examples: meaning.examples.map((example) => 
                        example.id === exampleId ?
                            {...example, targetToBeHidden: wordToHide}
                        :
                            example
                    )}
                    :
                        meaning
                )
            }
        ))

        fecharModalHideWord()
    }

    function setarMeaningContextVerb(idMeaning: string, mode: "add" | "remove") {
        if(mode === "add") {
            setMostrarModoAndTempoVerbal((prev) => ({...prev, meaningsComVerb: [...prev.meaningsComVerb, 
                {
                    idMeaning: idMeaning,
                    hasVerbAsContext: true
                }]
            }))
        } else if(mode === "remove") {
            setMostrarModoAndTempoVerbal((prev) => ({...prev, meaningsComVerb: prev.meaningsComVerb.filter(meaning => meaning.idMeaning !== idMeaning)
            }))
        }
    }

    function handleAddContextToMeaning(idMeaning: string) {
        const selectedContext = selectedContextByMeaningId[idMeaning]

        if(!selectedContext)
            return

        if(selectedContext === "verb") {
            setarMeaningContextVerb(idMeaning, "add")
        }
        addContextToMeaning(idMeaning, selectedContext)

        setSelectedContextByMeaningId((prev) => ({
            ...prev, [idMeaning]: ""
        }))
    }

    function handleOnChangeTypePalavra(event: React.ChangeEvent<HTMLSelectElement>) {
        
        if(event.target.value === "verb") {
            if(!mostrarModoAndTempoVerbal.isTypePalavraVerb) {
                setMostrarModoAndTempoVerbal((prev) => ({...prev, isTypePalavraVerb: true}))
            }
        } else {
            if(mostrarModoAndTempoVerbal.isTypePalavraVerb) {
                setMostrarModoAndTempoVerbal((prev) => ({...prev, isTypePalavraVerb: false}))
            }
        }
        handleSimpleChange("context", event.target.value)
    }

    

    return (
    <>
        <section className="screen active" id="screen-form">
        <div className={`top-area ${showTopArea ? "show" : "hide"}`}>
            <header className="topbar">
                <button className="icon-btn" id="cancelForm" aria-label="Cancelar"
                onClick={() => {
                    mode === "criar" ? voltarParaCardsDoModeCreate() : voltarParaCardsDoModeEdit()
                }}
                >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path 
                        d="M18 6 6 18M6 6l12 12" 
                        stroke="currentColor" 
                        strokeWidth="2.4" 
                        strokeLinecap="round" 
                        />
                    </svg>
                </button>
                <div style={{flex: 1}}>
                <p className="eyebrow">Card</p>
                <h1 className="page-title" id="formTitle">{titlePage} card</h1>
                </div>
            </header>
        </div>

        <form className="form-card" id="cardForm">
            {mode === "criar" && 
                <div className="field">
                    <Select 
                    idSelect="cardDeck"
                    value={idDeckEscolhido}
                    onChangeMethod={(e) => handleSelectedDeck(e.target.value)}
                    options={optionDecks}
                    label="Deck"
                    />
                </div>
            }
                {
                    idDeckEscolhido.length === 0 ? 
                        <div className="empty-state">
                            <strong>Nenhum Deck selecionado</strong>Escolha um deck para criar o card
                        </div>
                    : 
                    <>
                    <div className="field">
                        <label htmlFor="wordInput">Palavra</label>
                        <input 
                            id="wordInput" 
                            type="text" 
                            placeholder="Ex: Strident" 
                            value={cardForm.name}
                            onChange={(e) => handleSimpleChange("name", e.target.value)}
                            />
                    </div>

                    <div className="two-cols">
                        <div className="field">
                            <Select 
                            idSelect="typeInput" 
                            value={cardForm.context} label="Tipo" 
                            options={contextOptions} onChangeMethod={handleOnChangeTypePalavra}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="synonymInput">Sinônimo</label>
                            <input 
                                id="synonymInput" 
                                type="text" 
                                placeholder="loud" 
                                value={cardForm.synonym}
                                onChange={(e) => handleSimpleChange("synonym", e.target.value)}
                                />
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="phoneticInput">Pronúncia</label>
                        <input 
                            id="phoneticInput" 
                            type="text" 
                            placeholder="/ STRAI-dənt /" 
                            value={cardForm.phonetic}
                            onChange={(e) => handleSimpleChange("phonetic", e.target.value)}
                            />
                    </div>

                    <div>

                        {cardForm.meanings.map((meaning, index: number) => 
                            <div 
                            className="meaning-form"
                            key={meaning.id}
                            data-meaning-id={meaning.id}
                            >
                                <div className="meaning-form-title">
                                    <span>Significado {index+1}</span>
                                    <button 
                                    className="remove-meaning" type="button"
                                    disabled={cardForm.meanings.length < 2}
                                    onClick={() => removerSignificado(meaning.id)}
                                    >Remover</button>
                                </div>

                                <div className="field">
                                    <label>Definição</label>
                                    <textarea 
                                    className="meaning-definition"
                                    placeholder="Explique o significado"
                                    value={meaning.definition}
                                    onChange={(e) => handleNestedChange("definition", e.target.value, meaning.id)}
                                    >
                                    </textarea>
                                </div>

                                <div className="field">
                                    <label>Contexto</label>
                                    <div className="context-tools">
                                        <select
                                        value={selectedContextByMeaningId[meaning.id] ?? ""}
                                        onChange={(event) => {
                                            setSelectedContextByMeaningId((prev) => ({
                                                ...prev,
                                                [meaning.id]: event.target.value as Context | "",
                                            }))
                                        }}
                                        >
                                        <option value="" hidden>Adicionar contexto</option>
                                        {contextOptions.map(contOption => 
                                            <option key={meaning.id + contOption.value + "option"} value={contOption.value}>{contOption.name}</option>
                                        )}
                        
                                        </select>
                                        <button 
                                        className="inline-action add-tag" type="button"
                                        onClick={() => handleAddContextToMeaning(meaning.id)}
                                        >Adicionar</button>
                                    </div>
                                    <div className="selected-tags">
                                        {
                                        meaning.contexts.length === 0 ?
                                            <span className="empty-tags">Sem tag</span>
                                        :
                                            meaning.contexts.map(context => 
                                                <button 
                                                key={context.id}
                                                className={`tag tag-chip ${context.context}`}
                                                type="button"
                                                aria-label="Remover tag"
                                                onClick={() => {
                                                    if(context.context === "verb") {
                                                        setarMeaningContextVerb(meaning.id, "remove")
                                                    }
                                                    removerMeaningContext(meaning.id, context.id)
                                                }}
                                                >
                                                    {context.context}
                                                    <span aria-hidden="true">x</span>
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="examples-container">
                                    {
                                    meaning.examples.map((example, index) =>

                                        <div className="example-field" key={example.id}>
                                            <div className="example-title">
                                                <label>Exemplo {index+1}</label>
                                                <button
                                                className="remove-example"
                                                type="button"
                                                disabled={meaning.examples.length < 3}
                                                onClick={() => removerExemplo(meaning.id, example.id)}
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                            
                                            {(mostrarModoAndTempoVerbal.isTypePalavraVerb === true || mostrarModoAndTempoVerbal.meaningsComVerb.some(mean => mean.idMeaning === meaning.id)) &&
                                            
                                                <FieldSelectModoAndTempoVerbal>
                                                    <>
                                                        <div className="field">
                                                            <Select 
                                                            idSelect={example.id + "tempo"}
                                                            value={example.tempoVerbal}
                                                            label="Tempo Verbal"
                                                            options={tempoVerbalOptions}
                                                            onChangeMethod={(e) => handleTempoAndModoVerbalCardForm(e, "tempoVerbal", meaning.id, example.id)}
                                                            />
                                                        </div>
                                                        <div className="field">
                                                                <Select 
                                                                idSelect={example.id + "modo"}
                                                                value={example.modoVerbal}
                                                                label="Modo Verbal"
                                                                options={modoVerbalOptions}
                                                                onChangeMethod={(e) => handleTempoAndModoVerbalCardForm(e, "modoVerbal", meaning.id, example.id)}
                                                                />
                                                        </div>
                                                    </>
                                                </FieldSelectModoAndTempoVerbal>
                                            }
                        
                                            <div className="example-main-row">
                                                <textarea 
                                                className="meaning-example" 
                                                placeholder="Frase de exemplo"
                                                value={example.text}
                                                onChange={(e) => handleNestedChange("example", e.target.value, meaning.id, example.id)}
                                                >
                                                </textarea>
                                                <button 
                                                className="hide-words-action" 
                                                type="button" 
                                                aria-label="Ocultar palavras do exemplo"
                                                disabled={example.text.length < 1}
                                                onClick={() => abrirModalHideWord(example.text, example.id, meaning.id, example.targetToBeHidden)}
                                                >🙈</button>
                                            </div>
                                            <div className="hidden-preview">
                                                {example.targetToBeHidden ? 
                                                    separarPalavras(example.targetToBeHidden).map((word, index) => <span 
                                                        className="hidden-word-chip"
                                                        key={index}
                                                        >
                                                            {word}
                                                        </span>)
                                                :
                                                <span className="hidden-preview-empty">Nenhuma palavra oculta</span>
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button 
                                className="secondary-btn add-example" 
                                type="button"
                                onClick={() => adicionarExemplo(meaning.id)}
                                >
                                    + Adicionar exemplo
                                </button>
                            </div>
                        )}
                    </div>


                    <button 
                    className="secondary-btn" 
                    type="button" 
                    id="addMeaning"
                    onClick={() => adicionarSignificado()}
                    >
                        + Adicionar significado
                    </button>
                    <div style={{height: "12px"}}></div>
                    <button 
                    className="primary-btn" 
                    type="submit"
                    onClick={() => salvarCard()}
                    >Salvar card</button>
                    <div style={{height: "10px"}}></div>
                    <button 
                    className="preview-btn" 
                    type="button" 
                    onClick={abrirModalCardPreview}
                    >Pré-visualizar card</button>
                    </>   

                }
        </form>
        </section>

        <ModalBackGround 
        isOpen={backGroundModalIsOpen} 
        onClose={() => isModalCardPreviewOpen ? fecharModalCardPreview() : fecharModalHideWord()}
        modalOpen="card"
        >
            <CardPreview card={cardForm} onClose={fecharModalCardPreview} isOpen={isModalCardPreviewOpen}/>
            <HideWordModal isOpen={isModalHideWordOpen} onClose={fecharModalHideWord} exampleText={exampleTextToHideModalWord.current.text} onSave={ocultarPalavra} wordCurrentlyHide={exampleTextToHideModalWord.current.wordCurrentlyHide}/>
        </ModalBackGround>

    </>
    )
}

export default CriarCard