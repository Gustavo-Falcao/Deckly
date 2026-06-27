import { useEffect, useRef } from "react";
import { createPortal } from "react-dom"

type ToastInfoProps = {
    msg: string;
    type: "error" | "sucess";
    isOpen: boolean;
    onClose: () => void
}

function ToastInfo({ msg, type, isOpen, onClose }: ToastInfoProps) {
    const popupElement = document.getElementById("toast");
    const keyTimeOut = useRef<ReturnType<typeof setTimeout> | null>(null)
    
    useEffect(() => {
        if(!popupElement) return
        
        if(!isOpen) {
            popupElement.className = "toast"
            return
        }
        
        popupElement.className = `toast ${type} show`
        
        keyTimeOut.current = setTimeout(() => {
            popupElement.className = 'toast'

            if(onClose) {
                onClose()
            }
        }, 5000)
        
        return () => {
            if(keyTimeOut.current) {
                clearTimeout(keyTimeOut.current)
            }
        }

    }, [isOpen, type, popupElement, onClose])

    if(!popupElement || !isOpen) {
        return null
    }

    return createPortal(
        <span>{msg}</span>, 
        popupElement
    );
}


export default ToastInfo