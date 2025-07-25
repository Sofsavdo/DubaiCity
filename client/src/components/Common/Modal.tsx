import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../Icons';

const Modal = ({ show, onClose, children, title }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (!show) {
            setIsClosing(false);
        }
    }, [show]);
    
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 300); // match animation duration
    };

    if (!show && !isClosing) return null;

    return (
        <div className={`fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4 transition-opacity duration-300 ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`} onClick={handleClose}>
            <div className={`glass-card p-6 rounded-2xl w-full max-w-md animate-slideInUp`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gradient-gold">{title}</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white"><CloseIcon/></button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;