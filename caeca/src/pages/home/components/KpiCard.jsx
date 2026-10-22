import { ArrowDownRight, ArrowUpRight, Info } from 'lucide-react';
import styles from './KpiCard.module.css';

// `dica` aparece como tooltip ao passar o mouse sobre o card.
export function KpiCard({ label, valor, variacao = null, dica, rodape }) {
    const sobe = variacao >= 0;
    const Seta = sobe ? ArrowUpRight : ArrowDownRight;

    return (
        <section className={styles.card} title={dica}>
            <span className={styles.label}>
                {label}
                {dica && <Info size={14} className={styles.info} aria-hidden="true" />}
            </span>
            <strong className={styles.valor}>{valor}</strong>
            <div className={styles.rodape}>
                {variacao !== null && (
                    <span className={`${styles.trend} ${sobe ? styles.bom : styles.ruim}`}>
                        <Seta size={14} /> {Math.abs(variacao)}%
                    </span>
                )}
                <span className={styles.comparacao}>{rodape}</span>
            </div>
        </section>
    );
}
