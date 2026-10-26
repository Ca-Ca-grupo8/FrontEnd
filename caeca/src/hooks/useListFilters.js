import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const CHAVE_PAGINA = 'pagina';

// Filtros e página ficam na URL: sobrevivem a F5, ao botão voltar e a links.
// `padroes` precisa ser um objeto estável (constante do módulo).
export function useListFilters(padroes) {
    const [searchParams, setSearchParams] = useSearchParams();

    const valores = useMemo(
        () => Object.fromEntries(
            Object.entries(padroes).map(([chave, padrao]) => [chave, searchParams.get(chave) ?? padrao])
        ),
        [searchParams, padroes]
    );

    const pagina = Math.max(1, Number(searchParams.get(CHAVE_PAGINA)) || 1);

    const setFilter = useCallback((chave, valor) => {
        setSearchParams((atual) => {
            const proximo = new URLSearchParams(atual);

            if (valor === '' || valor === null || valor === undefined || valor === padroes[chave]) {
                proximo.delete(chave);
            } else {
                proximo.set(chave, valor);
            }

            proximo.delete(CHAVE_PAGINA);
            return proximo;
        }, { replace: true });
    }, [setSearchParams, padroes]);

    const setPagina = useCallback((novaPagina) => {
        setSearchParams((atual) => {
            const proximo = new URLSearchParams(atual);

            if (novaPagina > 1) {
                proximo.set(CHAVE_PAGINA, String(novaPagina));
            } else {
                proximo.delete(CHAVE_PAGINA);
            }

            return proximo;
        }, { replace: true });
    }, [setSearchParams]);

    const limpar = useCallback(() => {
        setSearchParams(new URLSearchParams(), { replace: true });
    }, [setSearchParams]);

    const temFiltrosAtivos = Object.keys(padroes).some((chave) => valores[chave] !== padroes[chave]);

    return { valores, pagina, setFilter, setPagina, limpar, temFiltrosAtivos };
}
