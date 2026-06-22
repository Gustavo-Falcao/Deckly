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

    //PROBLEMA
    //palavras já escondidas podem ocasionar em ocultacao de outras iguais sem pretencao
        //ex: 'first my'
        //separadas eles ficam 'first' 'my'
        //porem em uma frase pode ter mais de um 'my' e eu nao quero esconder os outros
    //SOLUCAO
        //se o target vier somente com uma palavra, todas as ocorrencias dela dentro da frase serao ocultadas
        //se o target vier com mais de uma palavra:
            //sera usado a primeira palavra para encontrar a primeira o correncia dela
            //em seguida, em monto a frase com o tamanho da string passada, pegando pelas posicoes do array
            //verifico se a frase montada bate com a frase do target
                //se sim sucesso
                    //marca as palavras da frase encontrada com true e sai do loop
                //se nao
                    //continua percorrendo o array comparando com a primeira palavra da frase repetindo o processo

        

    const [arrayWordsExampleText, setArrayWordsExampleText] = useState<WordTokenized[]>(() :WordTokenized[] => {
        const words = separarPalavras(exampleText)

        let wordsTokenized = words.map((word) => {return {id: crypto.randomUUID(), text: word, selected: false}})

        const wordsAlreadySelected: string[] = separarPalavras(wordCurrentlyHide)

        console.log("palavras escolhidas selecionadas abaixo")
        console.log(wordsAlreadySelected)

        console.log("palavras tokenizadas abaixo")
        console.log(wordsTokenized)

        if(wordsAlreadySelected.length > 1) {
            for(let i = 0; i < wordsTokenized.length; i++) {
                if(wordsAlreadySelected[0] === wordsTokenized[i].text) {
                    const wordSelecionados = wordsTokenized.slice(i, i + wordsAlreadySelected.length)

                    const wordSelecionadosText = wordSelecionados.map((wordToken) => wordToken.text);

                    let fraseMontada = ""

                    for(const word of wordSelecionadosText) {
                      if(word === ',' || word === ';' || word === '.') {
                          fraseMontada = fraseMontada.trim() + `${word} `
                          continue
                      }
                      fraseMontada = fraseMontada + `${word} `
                    }

                    fraseMontada = fraseMontada.trim()

                    if(fraseMontada === wordCurrentlyHide) {
                        let x = i
                        for(let j = 0; j < wordsAlreadySelected.length; j++) {
                            wordsTokenized[x++].selected = true;
                        }
                        break
                    }
                    
                }
            }
            return [...wordsTokenized]
        }

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

    console.log("Words selected abaixo")
    console.log(wordsSelected)

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
            if(word.text === ',' || word.text === ';' || word.text === '.') {
                words = words.trim() + `${word.text} `
                continue
            }
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