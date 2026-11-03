import styles from './FilterBar.module.css';
import { InputData } from '../InputData';

export function DateRangeFilter({ dataInicio, dataFim, onChange, erro }) {
    const invalido = Boolean(erro);

    return (
        <>
            <label className={styles.date}>
                <span>De</span>
                <InputData
                    value={dataInicio}
                    aria-invalid={invalido}
                    onChange={(iso) => onChange('dataInicio', iso)}
                />
            </label>
            <label className={styles.date}>
                <span>Até</span>
                <InputData
                    value={dataFim}
                    aria-invalid={invalido}
                    onChange={(iso) => onChange('dataFim', iso)}
                />
            </label>
            {invalido && <p role="alert" className={styles.erro}>{erro}</p>}
        </>
    );
}
