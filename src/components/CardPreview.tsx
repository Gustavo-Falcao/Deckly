import type { CardEdit, CardFormData, Example } from "../types/Card";
import { Fragment } from "react/jsx-runtime"

type CardPreviewProps = {
    card: CardFormData | CardEdit | undefined
    onClose: () => void
    isOpen: boolean
}

function CardPreview({card, onClose, isOpen}: CardPreviewProps) {

    function isMostrarBackGroundExamples(examples: Example[]) {
        for(const ex of examples) {
            if(ex.text.trim())
                return true
        }

        return false
    }

    function gerarParagrafoExemploComPalavraDestacada(sentence: string, target: string) {
        const parts = sentence.split(target)
    
        const exampleSentence = parts.map((part, index) => (
            <Fragment key={index}>
                {part}
    
                {index < parts.length - 1 && (
                    <span className="hidden-word-chip">{target}</span>
                )}
            </Fragment>
        ))
    
        return exampleSentence
    }

    if(!card || !isOpen) return null

    return (
        <article>
          <div className="word-card card-modal-card">
            <h2 className="word-title">{card.name}</h2>
            <div className="word-desc">
              {card.context ? <span>{card.context}</span> : undefined}
              {card.synonym ? <span className="tag neutral">{card.synonym}</span> : undefined}
            </div>

            <div className="meanings-scroll">
                {card.meanings.map((meaning, index) => 
                    <div className="meaning" key={meaning.id}>
                        {meaning.definition || meaning.contexts.length > 0 ? <span className="meaning-number">{index + 1}</span> : undefined}
                        <p className="definition">
                            {meaning.definition}
                            {meaning.contexts.length > 0 ?
                                meaning.contexts.map(contx =>
                                    <span key={contx.id} className={`tag ${contx.context}`}>{contx.context}</span>
                                )
                            :
                                undefined
                            }
                        </p>
                        {isMostrarBackGroundExamples(meaning.examples) ? 
                            <div className="examples-box">
                                {meaning.examples.filter(example => example.text.length > 3).map(example => 
                                    <p key={example.id}>
                                        {example.targetToBeHidden ?
                                            gerarParagrafoExemploComPalavraDestacada(example.text, example.targetToBeHidden)    
                                        :
                                            example.text
                                        }  
                                    </p>
                                )}
                            </div>
                        :
                            undefined
                        }
                    </div>
                )}
            </div>

            <div className="pronunciation">
              <span className="pronunciation-label">Pronúncia</span>
              <span className="phonetic">{`/ ${card.phonetic || ' --- '} /`}</span>
            </div>
          </div>

          <div className="card-actions">
            <button 
            className="small-action" 
            id="closeCardModalBtn"
            onClick={onClose}
            >Fechar</button>
          </div>
        </article>
    )
}

export default CardPreview