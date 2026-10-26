import { useEffect, useState } from 'react';

export function useDebouncedValue(valor, atraso = 400) {
    const [valorDebounced, setValorDebounced] = useState(valor);

    useEffect(() => {
        const timer = setTimeout(() => setValorDebounced(valor), atraso);
        return () => clearTimeout(timer);
    }, [valor, atraso]);

    return valorDebounced;
}
