import { useState } from "react"

type HideWordModalProps = {
    isOpen: boolean
    exampleText: string
    onClose: () => void
    onSave: (wordToHide: string) => void
    wordCurrentlyHide: string
}

type WordTokenized = {
    id: string
    text: string
    selected: boolean
}

function HideWordModal({isOpen, onClose, exampleText, onSave, wordCurrentlyHide}: HideWordModalProps) {

    if(!isOpen || !exampleText) return null


    const [arrayWordsExampleText, setArrayWordsExampleText] = useState<WordTokenized[]>(() :WordTokenized[] => {
        const words = separarPalavras(exampleText)

        let wordsTokenized = words.map((word) => {return {id: crypto.randomUUID(), text: word, selected: false}})

        const wordsAlreadySelected = separarPalavras(wordCurrentlyHide)

        for(const wordToken of wordsTokenized) {
            for(const wordAlreadySelected of wordsAlreadySelected) {
                if(wordToken.text === wordAlreadySelected) {
                    wordToken.selected = true
                }
            }
        }

        return [...wordsTokenized]
    })

    function separarPalavras(text: string): string[] {
        const textoPreparado = String(text).replace(/([.,!?])/g, ' $1 ');
        
        return textoPreparado.trim().split(/\s+/).filter(Boolean);
    }
    
    const wordsSelected: WordTokenized[] = arrayWordsExampleText.filter((word) => word.selected === true);

    function selecionarPalavra(idPalavra: string) {
        setArrayWordsExampleText((prevArray) => prevArray.map((word) => word.id === idPalavra ? {...word, selected: true} : word))
    }

    function limparSelecteds() {
        setArrayWordsExampleText((prevArray) => prevArray.map((word) => word.selected ? {...word, selected: false} : word))
    }

    function descartarPalavra(idPalavra: string) {
        setArrayWordsExampleText((prevArray) => prevArray.map((word) => word.id === idPalavra ? {...word, selected: false} : word))
    }

    function handleSave() {
        let words: string = ""

        for(const word of wordsSelected) {
            words = words + `${word.text} `
        }

        words = words.trim()
        
        onSave(words)
    }

    return(
        <article>
            <div className="hide-words-sheet" role="dialog" aria-modal="true" aria-label="Selecionar palavras ocultas">
                <h2>Ocultar palavras</h2>
                <p className="sheet-help">Toque nas palavras que devem ficar escondidas no treino. As palavras escolhidas ficam indisponíveis na frase original e aparecem abaixo como frase formada.</p>

                <div className="hide-words-body">
                    <div className="badge-sentence" id="hideWordsBadges">
                        {arrayWordsExampleText.map(wordTokenized => 
                            <button 
                            key={wordTokenized.id}
                            className={`word-badge ${wordTokenized.selected ? 'is-selected' : undefined}`} 
                            type="button" 
                            onClick={() => selecionarPalavra(wordTokenized.id)}
                            >
                                {wordTokenized.text}
                            </button>
                        )}
                    </div>

                    <div className="hidden-builder">
                    <span className="hidden-builder-label">Frase formada</span>
                    <div className="selected-hidden-phrase" id="selectedHiddenPhrase">
                        {wordsSelected.length ?
                            wordsSelected.map((word) => 
                                <span 
                                className="hidden-word-chip"
                                key={word.id}
                                onClick={() => descartarPalavra(word.id)}
                                >
                                    {word.text}
                                </span>
                            )
                        :
                            <span className="selected-hidden-empty">Nenhuma palavra selecionada ainda</span>
                        }
                    </div>
                    <button 
                    className="clear-hidden-btn" 
                    type="button" 
                    id="clearHiddenWordsBtn"
                    onClick={limparSelecteds}
                    >Limpar seleção</button>
                    </div>
                </div>

            </div>
            
            <div className="card-actions">
                <button className="secondary-btn" type="button" id="cancelHideWordsBtn" onClick={onClose}>Cancelar</button>
                <button 
                className="primary-btn" 
                type="button" 
                id="saveHideWordsBtn"
                onClick={handleSave}
                >Salvar</button>
            </div>
        </article>
    )
}

export default HideWordModal