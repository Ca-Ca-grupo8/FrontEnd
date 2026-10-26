import styles from './FilterBar.module.css';

export function SelectFilter({ rotulo, valor, onChange, opcoes }) {
    return (
        <label className={styles.select}>
            <span>{rotulo}</span>
            <select value={valor} onChange={(event) => onChange(event.target.value)}>
                {opcoes.map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>{opcao.label}</option>
                ))}
            </select>
        </label>
    );
}
