import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import styles from './FilterBar.module.css';

// Busca de texto com debounce: digitar não dispara uma requisição por tecla.
export function SearchFilter({ rotulo, placeholder, valor, onChange }) {
    const [texto, setTexto] = useState(valor);
    const textoDebounced = useDebouncedValue(texto);
    const ultimoEnviado = useRef(valor);

    useEffect(() => {
        if (textoDebounced !== ultimoEnviado.current) {
            ultimoEnviado.current = textoDebounced;
            onChange(textoDebounced);
        }
    }, [textoDebounced, onChange]);

    // Acompanha mudanças externas da URL (botão voltar, "Limpar filtros").
    useEffect(() => {
        if (valor !== ultimoEnviado.current) {
            ultimoEnviado.current = valor;
            setTexto(valor);
        }
    }, [valor]);

    return (
        <label className={styles.search}>
            <span className={styles.srOnly}>{rotulo}</span>
            <Search size={16} aria-hidden="true" className={styles.searchIcon} />
            <input
                type="search"
                placeholder={placeholder}
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
                className={styles.searchInput}
            />
        </label>
    );
}
