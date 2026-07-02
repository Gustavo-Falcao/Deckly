import type { ContextOption } from "../pages/CriarCard"
import type { DeckOption } from "../types/Deck"

type SelectProps = {
    idSelect: string;
    value: string | undefined
    label: string
    options: ContextOption[] | DeckOption[]
    onChangeMethod: (event: React.ChangeEvent<HTMLSelectElement>, field?: "tempoVerbal" | "modoVerbal", value?: string, meaningId?: string, exampleId?: string) => void
}

function Select({ idSelect, value, label, options, onChangeMethod }: SelectProps) {
    return(
        <>
        <label htmlFor={idSelect}>{label}</label>
        <select
        id={idSelect}
        value={value}
        onChange={onChangeMethod}
        >
            <option value="">{label}</option>
                {options.map(op => 
                    <option key={op.value} value={op.value}>
                        {op.name}
                    </option>)}
        </select>
        </>
    )
}

export default Select