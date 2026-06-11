import { useState } from "react"

type HideWordModalProps = {
    isOpen: boolean
    exampleText: string
    onClose: () => void
}

type WordTokenized = {
    id: string
    text: string
    selected: boolean
}

function HideWordModal({isOpen, onClose, exampleText}: HideWordModalProps) {

    if(!isOpen || !exampleText) return null


    const [arrayWordsExampleText, setArrayWordsExampleText] = useState<WordTokenized[]>(() :WordTokenized[] => {
        const words = String(exampleText).trim().split(/\s+/).filter(Boolean);

        return words.map((word) => {return {id: crypto.randomUUID(), text: word, selected: false}})
    })
    
    //CONTINUAR IMPLEMENTANDO, NA PARTE DE SELECIONAR AS PALAVAR
    //HOT TAKE => FAZER POR VARIAVEL NORMAL E CRIAR UMA FUNCAO QUE RETORNE AS PALAVRAS FILTRADAS APENAS POR SELECIONADAS E INICIALIZAR A VARIAVEL COM ESSA FUNCAO
    
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
                            
                            >
                                {wordTokenized.text}
                            </button>
                        )}
                    </div>

                    <div className="hidden-builder">
                    <span className="hidden-builder-label">Frase formada</span>
                    <div className="selected-hidden-phrase" id="selectedHiddenPhrase"></div>
                    <button className="clear-hidden-btn" type="button" id="clearHiddenWordsBtn">Limpar seleção</button>
                    </div>
                </div>

            </div>
            
            <div className="card-actions">
                <button className="secondary-btn" type="button" id="cancelHideWordsBtn" onClick={onClose}>Cancelar</button>
                <button className="primary-btn" type="button" id="saveHideWordsBtn">Salvar</button>
            </div>
        </article>
    )
}

export default HideWordModal