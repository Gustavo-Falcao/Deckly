
type FieldSelectModoAndTempoVerbalProps = {
    children: React.ReactNode
}

function FieldSelectModoAndTempoVerbal({ children }: FieldSelectModoAndTempoVerbalProps) {
    return (
        <div className="two-cols" style={{paddingTop: "7px"}}>
            {children}
        </div>
    )
}

export default FieldSelectModoAndTempoVerbal