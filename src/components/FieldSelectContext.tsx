import { useState, type ReactNode } from "react";
import type { Context, MeaningFormData } from "../types/Card";

type ContextOption = {
    value: string;
    name: string;
}

type FieldSelectProps = {
    meaning: MeaningFormData;
    addContextToMeaning: (idMeaning: string, selectedContext: Context, contextType: "context" | "tempo verbal" | "modo verbal") => void;
    removerMeaningContext: (idMeaning: string, contextId: string, isContextVerb: boolean) => void;
}

type FieldSelectTypeContext = {    
    meaning: MeaningFormData;
    addContextToMeaning: (idMeaning: string, selectedContext: Context, contextType: "context" | "tempo verbal" | "modo verbal") => void;
    removerMeaningContext: (idMeaning: string, contextId: string, isContextVerb: boolean) => void;
    setarMeaningContextVerb: (idMeaning: string, mode: "add" | "remove") => void
}

type FieldSelectPaiProps = {
    children?: ReactNode;
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

const tempoVerbalOption: ContextOption [] = [
    {value: "Pres. Simple", name: "Pres. Simple"},
    {value: "Pres. Continuous", name: "Pres. Continuous"},
    {value: "Pres. Perfect", name: "Pres. Perfect"},
    {value: "Pres. Perf. Cont.", name: "Pres. Perf. Cont."},
    {value: "Past Simple", name: "Past Simple"},
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
    {value: "passive voice", name: "Passive Voice"},
    {value: "infinitive", name: "Infinitive"}
]

function FieldSelectContext({ children }: FieldSelectPaiProps) {
    return <>{children}</>
}
//continuar ajustando cada componente filho e exportar o pai no final e testar 
function FieldSelectTypeContext({ meaning, addContextToMeaning, removerMeaningContext, setarMeaningContextVerb }: FieldSelectTypeContext) {
    const [selectedContextByMeaningId, setSelectedContextByMeaningId] = useState<Record<string, Context | "">>({});
    const contexts = meaning.contexts.filter((context) => !context.id.includes("modo") && !context.id.includes("tempo"))

    return (
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
                onClick={() => {
                    const selectedContext = selectedContextByMeaningId[meaning.id]

                    if(!selectedContext)
                        return

                    if(selectedContext === "verb") {
                        setarMeaningContextVerb(meaning.id, "add")
                    }
                    addContextToMeaning(meaning.id, selectedContext, "context")

                    setSelectedContextByMeaningId((prev) => ({
                        ...prev, [meaning.id]: ""
                    }))
                }}
                >Adicionar</button>
            </div>
            <div className="selected-tags">
                {
                contexts.length === 0 ?
                    <span className="empty-tags">Sem tag</span>
                :
                    contexts.map(context => 
                        <button 
                        key={context.id}
                        className={`tag tag-chip ${context.context}`}
                        type="button"
                        aria-label="Remover tag"
                        onClick={() => {
                            if(context.context === "verb") {
                                setarMeaningContextVerb(meaning.id, "remove")
                            }
                            removerMeaningContext(meaning.id, context.id, context.context === "verb")
                        }}
                        >
                            {context.context}
                            <span aria-hidden="true">x</span>
                        </button>
                    )
                }
            </div>
        </div>
    )
}

function FieldSelectTypeTempoVerbal({ meaning, addContextToMeaning, removerMeaningContext }: FieldSelectProps) {
    const [selectedTempoVerbalByMeaningId, setSelectedTempoVerbalByMeaningId] = useState<Record<string, Context | "">>({})
    const temposVerbais = meaning.contexts.filter((context) => context.id.includes("tempo"))

    return(
        <div className="field">
            <label>Tempo Verbal</label>
            <div className="context-tools">
                <select className="meaning-tag-select"
                value={selectedTempoVerbalByMeaningId[meaning.id] ?? ""}
                onChange={(event) => {
                    setSelectedTempoVerbalByMeaningId((prev) => ({
                        ...prev,
                        [meaning.id]: event.target.value as Context | "",
                    }))
                }}
                >
                <option value="" hidden>Adicionar contexto</option>
                {tempoVerbalOption.map(tempOption => 
                    <option key={meaning.id + tempOption.value + "option"} value={tempOption.value}>{tempOption.name}</option>
                )}

                </select>
                <button 
                className="inline-action add-tag" type="button"
                onClick={() => {
                    const selectedTempoVerbal = selectedTempoVerbalByMeaningId[meaning.id]

                    if(!selectedTempoVerbal)
                        return

                    addContextToMeaning(meaning.id, selectedTempoVerbal, "tempo verbal")

                    setSelectedTempoVerbalByMeaningId((prev) => ({
                        ...prev, [meaning.id]: ""
                    }))
                }}
                >Adicionar</button>
            </div>
            <div className="selected-tags">
                {
                temposVerbais.length === 0 ?
                    <span className="empty-tags">Sem tag</span>
                :
                    temposVerbais.map(temp => 
                        <button 
                        key={temp.id}
                        className="tag tag-chip tempo-verbal"
                        type="button"
                        aria-label="Remover tag"
                        onClick={() => removerMeaningContext(meaning.id, temp.id, false)}
                        >
                            {temp.context}
                            <span aria-hidden="true">x</span>
                        </button>
                    )
                }
            </div>
        </div>
    )
}

function FieldSelectTypeModoVerbal({ meaning, addContextToMeaning, removerMeaningContext }: FieldSelectProps) {
    const [selectedModoVerbalByMeaningId, setSelectedModoVerbalByMeaningId] = useState<Record<string, Context | "">>({})
    const modosVerbais = meaning.contexts.filter((context) => context.id.includes("modo"))

    return (
        <div className="field">
            <label>Modo Verbal</label>
            <div className="context-tools">
                <select className="meaning-tag-select"
                value={selectedModoVerbalByMeaningId[meaning.id] ?? ""}
                onChange={(event) => {
                    setSelectedModoVerbalByMeaningId((prev) => ({
                        ...prev,
                        [meaning.id]: event.target.value as Context | "",
                    }))
                }}
                >
                <option value="" hidden>Adicionar contexto</option>
                {modoVerbalOptions.map(modOption => 
                    <option key={meaning.id + modOption.value + "option"} value={modOption.value}>{modOption.name}</option>
                )}

                </select>
                <button 
                className="inline-action add-tag" type="button"
                onClick={() => {
                    const selectedContext = selectedModoVerbalByMeaningId[meaning.id]

                    if(!selectedContext)
                        return

                    addContextToMeaning(meaning.id, selectedContext, "modo verbal")

                    setSelectedModoVerbalByMeaningId((prev) => ({
                        ...prev, [meaning.id]: ""
                    }))
                }}
                >Adicionar</button>
            </div>
            <div className="selected-tags">
                {
                modosVerbais.length === 0 ?
                    <span className="empty-tags">Sem tag</span>
                :
                    modosVerbais.map(mod => 
                        <button 
                        key={mod.id}
                        className={`tag tag-chip ${mod.context}`}
                        type="button"
                        aria-label="Remover tag"
                        onClick={() => removerMeaningContext(meaning.id, mod.id, false)}
                        >
                            {mod.context}
                            <span aria-hidden="true">x</span>
                        </button>
                    )
                }
            </div>
        </div>
    )
}

export const FieldsSelectContext = Object.assign(FieldSelectContext, {
    FieldSelectTypeContext,
    FieldSelectTypeTempoVerbal,
    FieldSelectTypeModoVerbal,
});