type ModalBackGroundProps = {
    isOpen: boolean
}

function ModalBackGround({ isOpen }: ModalBackGroundProps) {
    if(isOpen) {
        return (         
            <div 
            className="modal-backdrop" 
            id="deckModal"
            ></div>  
        )
    }
}

export default ModalBackGround