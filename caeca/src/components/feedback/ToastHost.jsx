import { useCallback, useEffect, useState } from 'react';
import { Toast } from '../../components/ui/Toast';
import { assinarToast } from '../../utils/toastBus';
import style from '../../styles/Toast.module.css';

export function ToastHost() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => assinarToast((toast) => {
        setToasts((atuais) => [...atuais, toast]);
    }), []);

    const remover = useCallback((id) => {
        setToasts((atuais) => atuais.filter((toast) => toast.id !== id));
    }, []);

    if (!toasts.length) {
        return null;
    }

    return (
        <div className={style.container}>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => remover(toast.id)}
                />
            ))}
        </div>
    );
}
