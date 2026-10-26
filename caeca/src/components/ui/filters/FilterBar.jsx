import styles from './FilterBar.module.css';

export function FilterBar({ ariaLabel, temFiltrosAtivos, onLimpar, children }) {
    return (
        <div className={styles.filterBar} role="search" aria-label={ariaLabel}>
            <div className={styles.controls}>{children}</div>
            <button type="button" className={styles.clear} onClick={onLimpar} disabled={!temFiltrosAtivos}>
                Limpar filtros
            </button>
        </div>
    );
}
