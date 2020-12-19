import React, { useState } from 'react'

interface ModalProps {
    isVisible: boolean
    setIsVisible: (isVisible: boolean) => void
}

const Modal: React.FC<ModalProps> = (props) => {
    return props.isVisible ? (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center w-full max-w-3xl mx-auto overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                <div className="relative p-4 mx-auto card">{props.children}</div>
            </div>
            <div onClick={() => props.setIsVisible(false)} className="fixed inset-0 z-40 bg-black opacity-50"></div>
        </>
    ) : null
}

export default Modal
