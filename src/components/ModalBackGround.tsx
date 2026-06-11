import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalBackGroundProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    modalOpen?: string
}

function ModalBackGround({ isOpen, onClose, modalOpen, children}: ModalBackGroundProps) {
    
    useEffect(() => {
        if(isOpen) {
            document.body.style.overflow = "hidden"
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])
    
    const modalRoot = document.getElementById("modal-root")

    if(!modalRoot || !isOpen) return null
    
    return createPortal (         
        <div 
        className={`modal-backdrop ${modalOpen === "info" ? 'modal-info' : 'active'}`}
        onClick={() => {
            if(modalOpen === "delete") {
                return
            }
            onClose()
        }}
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

export default ModalBackGround