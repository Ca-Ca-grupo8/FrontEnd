import styles from './FilterBar.module.css';

export function DateRangeFilter({ dataInicio, dataFim, onChange, erro }) {
    const invalido = Boolean(erro);

    return (
        <>
            <label className={styles.date}>
                <span>De</span>
                <input
                    type="date"
                    value={dataInicio}
                    aria-invalid={invalido}
                    onChange={(event) => onChange('dataInicio', event.target.value)}
                />
            </label>
            <label className={styles.date}>
                <span>Até</span>
                <input
                    type="date"
                    value={dataFim}
                    aria-invalid={invalido}
                    onChange={(event) => onChange('dataFim', event.target.value)}
                />
            </label>
            {invalido && <p role="alert" className={styles.erro}>{erro}</p>}
        </>
    );
}
