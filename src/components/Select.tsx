import type { ContextOption } from "../pages/CriarCard"

type SelectProps = {
    idSelect: string;
    value: string | undefined
    label: string
    options: ContextOption[]
    onChangeMethod: (event: React.ChangeEvent<HTMLSelectElement>) => void
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