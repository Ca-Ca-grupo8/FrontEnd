import { useMemo } from 'react';
import styles from '../../styles/Pagination.module.css';

export function Pagination({ paginaAtual, totalPaginas, aoMudarPagina, quantidadeVizinhos = 1 }) {
    const totalPaginasSeguras = Math.max(1, totalPaginas || 1);
    const paginaAtualSegura = Math.min(Math.max(1, paginaAtual || 1), totalPaginasSeguras);

    const paginasVisiveis = useMemo(() => {
        if (totalPaginasSeguras <= 7) {
            return Array.from({ length: totalPaginasSeguras }, (_, indice) => indice + 1);
        }

        const paginas = new Set([1, totalPaginasSeguras]);
        const inicio = Math.max(2, paginaAtualSegura - quantidadeVizinhos);
        const fim = Math.min(totalPaginasSeguras - 1, paginaAtualSegura + quantidadeVizinhos);

        for (let pagina = inicio; pagina <= fim; pagina += 1) {
            paginas.add(pagina);
        }

        const paginasOrdenadas = [...paginas].sort((a, b) => a - b);
        const listaPaginas = [];

        for (let indice = 0; indice < paginasOrdenadas.length; indice += 1) {
            const pagina = paginasOrdenadas[indice];
            const paginaAnterior = paginasOrdenadas[indice - 1];

            if (paginaAnterior !== undefined && pagina - paginaAnterior > 1) {
                listaPaginas.push('reticencias');
            }

            listaPaginas.push(pagina);
        }

        return listaPaginas;
    }, [paginaAtualSegura, totalPaginasSeguras, quantidadeVizinhos]);

    const alterarPagina = (pagina) => {
        if (pagina >= 1 && pagina <= totalPaginasSeguras && pagina !== paginaAtualSegura) {
            aoMudarPagina?.(pagina);
        }
    };

    if (totalPaginasSeguras <= 1) {
        return null;
    }

    return (
        <nav className={styles.pagination} aria-label="Paginação de resultados">
            <button
                type="button"
                className={styles['page-nav']}
                onClick={() => alterarPagina(paginaAtualSegura - 1)}
                disabled={paginaAtualSegura === 1}
                aria-label="Página anterior"
            >
                ← Anterior
            </button>

            {paginasVisiveis.map((pagina, indice) => {
                if (pagina === 'reticencias') {
                    return (
                        <span key={`reticencias-${indice}`} className={styles['page-dots']} aria-hidden="true">
                            ...
                        </span>
                    );
                }

                const paginaAtiva = pagina === paginaAtualSegura;

                return (
                    <button
                        key={pagina}
                        type="button"
                        className={`${styles['page-num']} ${paginaAtiva ? styles.active : ''}`.trim()}
                        onClick={() => alterarPagina(pagina)}
                        aria-current={paginaAtiva ? 'page' : undefined}
                        aria-label={`Ir para a página ${pagina}`}
                    >
                        {pagina}
                    </button>
                );
            })}

            <button
                type="button"
                className={styles['page-nav']}
                onClick={() => alterarPagina(paginaAtualSegura + 1)}
                disabled={paginaAtualSegura === totalPaginasSeguras}
                aria-label="Próxima página"
            >
                Próximo →
            </button>
        </nav>
    );
}