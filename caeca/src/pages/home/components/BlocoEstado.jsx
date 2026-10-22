import styles from './BlocoEstado.module.css';

// Estado de carregamento, erro ou vazio para um bloco da Home.
export function BlocoEstado({ carregando, erro, vazio, altura = 200 }) {
    if (carregando) return <div className={styles.skeleton} style={{ height: altura }} aria-busy="true" />;
    if (erro) return <p className={styles.mensagem}>Não foi possível carregar estes dados.</p>;
    if (vazio) return <p className={styles.mensagem}>Sem dados para exibir.</p>;
    return null;
}
