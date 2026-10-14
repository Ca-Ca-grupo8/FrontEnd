import { useEffect } from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import style from '../../styles/Toast.module.css';

const ICONES = {
    error: XCircle,
    success: CheckCircle2,
    info: Info
};

export function Toast({ message, type = 'error', onClose, duration = 4000 }) {
    useEffect(() => {
        if (!duration) {
            return undefined;
        }

        const timeout = setTimeout(onClose, duration);
        return () => clearTimeout(timeout);
    }, [duration, onClose]);

    const Icone = ICONES[type] || ICONES.info;

    return (
        <div className={`${style.toast} ${style[type] || ''}`} role="alert">
            <Icone className={style.icon} size={18} strokeWidth={2} />
            <span>{message}</span>
            <button type="button" className={style.close} onClick={onClose} aria-label="Fechar aviso">
                &times;
            </button>
        </div>
    );
}
