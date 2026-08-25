import { useEffect } from 'react';
import style from '../../styles/Toast.module.css';

export function Toast({ message, onClose, duration = 4000 }) {
    useEffect(() => {
        const timeout = setTimeout(onClose, duration);
        return () => clearTimeout(timeout);
    }, [duration, onClose]);

    return (
        <div className={style.toast} role="alert">
            <span>{message}</span>
            <button type="button" className={style.close} onClick={onClose} aria-label="Fechar aviso">
                &times;
            </button>
        </div>
    );
}
