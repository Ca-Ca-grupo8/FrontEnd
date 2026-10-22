import styles from './HeroHome.module.css';

const dataDeHoje = () =>
    new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        .format(new Date());

export function HeroHome() {
    const nome = localStorage.getItem('nome_usuario') || 'Visitante';

    return (
        <header className={styles.hero}>
            <span className={styles.data}>{dataDeHoje()}</span>
            <h1 className={styles.titulo}>Olá, {nome}</h1>
            <p className={styles.subtitulo}>Controle de estoque e movimentações das suas semijoias.</p>
        </header>
    );
}
