import { useState } from 'react';
import '../../styles/novaCategoria.css'
import { useEffect } from 'react';

export function SucessoModal({ text, IsSuccess, error = false, onClose }) {
    const [progressWidth, setProgressWidth] = useState(0);

    const deveExibir = IsSuccess || error;


    useEffect(() => {
        if (!IsSuccess) return;

        const animacaoTimeout = setTimeout(() => {
            setProgressWidth(100);
        }, 50);

        const fechamentoTimeout = setTimeout(() => {
            onClose();
            setProgressWidth(0);
        }, 1550);

        return () => {
            clearTimeout(animacaoTimeout);
            clearTimeout(fechamentoTimeout);
        };
    }, [IsSuccess, onClose]);

    if(!IsSuccess) return(null)

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <p className={error ? 'error-message' : 'success-message'}>
                        {text}
                    </p>
                </div>
                <div className={`success-progress-bg ${error ? 'error-progress-bg' : ''}`}>
                    <div
                        className={`success-progress-fill ${error ? 'error-progress-fill' : ''}`}
                        style={{ width: `${progressWidth}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}