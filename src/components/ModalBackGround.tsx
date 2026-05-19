import { createPortal } from "react-dom";

type ModalBackGroundProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

function ModalBackGround({ isOpen, onClose, children}: ModalBackGroundProps) {
    const modalRoot = document.getElementById("modal-root")

    if(!modalRoot) {
        return null
    }
    
    if(isOpen) {
        return createPortal (         
            <div 
            className="modal-backdrop active"
            onClick={onClose}
            >
                <div 
                className="sheet card-view-sheet"
                onClick={(e) => e.stopPropagation()}
                >
                    {children}   
                </div>
            </div>,
            modalRoot  
        );
    }
}

export default ModalBackGround