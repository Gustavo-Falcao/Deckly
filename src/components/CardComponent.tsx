import type { Card, Example } from "../types/Card"

type CardProps = {
    card: Card | undefined
    onClose: () => void
    isOpen: boolean
    openDeleteCard: () => void
}

function isMostrarBackGroundExamples(examples: Example[]) {
    for(const ex of examples) {
        if(ex.text.trim())
            return true
    }

    return false
}

function CardComponent({card, onClose, isOpen, openDeleteCard}: CardProps) {
    
    if(!card || !isOpen) return
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
                            {meaning.contexts.map(contx =>
                                <span key={contx.id} className={`tag ${contx.context}`}>{contx.context}</span>
                            )}
                        </p>
                        {isMostrarBackGroundExamples(meaning.examples) ? 
                            <div className="examples-box">
                                {meaning.examples.filter(example => example.text.length > 3).map(example => 
                                    <p key={example.id}>{example.text}</p>
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
            data-edit-id={card.id}
            >
                Editar</button>
            <button 
            className="small-action delete" 
            data-delete-id={card.id}
            onClick={openDeleteCard}
            >
                Excluir</button>
            <button 
            className="small-action" 
            id="closeCardModalBtn"
            onClick={onClose}
            >
                Fechar</button>
          </div>
        </article>
    )
}

export default CardComponent