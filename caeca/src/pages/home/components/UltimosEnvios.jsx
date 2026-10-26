import { BlocoEstado } from './BlocoEstado';
import styles from './UltimosEnvios.module.css';

const ROTULO_REFERENCIA = {
    MALETA: 'Maleta',
    REVENDEDORA: 'Revendedora',
    ESTOQUE: 'Estoque',
    USUARIO: 'Usuário',
};

const formatarData = (valor) =>
    new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        .format(new Date(valor));

export function UltimosEnvios({ dados, carregando, erro }) {
    const vazio = dados.length === 0;

    return (
        <section className={styles.card}>
            <header className={styles.cabecalho}>
                <h3 className={styles.titulo}>Últimos envios</h3>
                <p className={styles.subtitulo}>Notificações registradas pela aplicação</p>
            </header>

            {carregando || erro || vazio ? (
                <BlocoEstado carregando={carregando} erro={erro} vazio={vazio} altura={200} />
            ) : (
                <ul className={styles.lista}>
                    {dados.map((envio) => (
                        <li key={envio.id} className={styles.item}>
                            <div className={styles.info}>
                                <span className={styles.template}>{envio.nomeTemplate ?? 'Sem template'}</span>
                                <span className={styles.detalhe}>
                                    {ROTULO_REFERENCIA[envio.tipoReferencia] ?? envio.tipoReferencia} #{envio.referenciaId}
                                </span>
                            </div>
                            <span className={styles.data}>{formatarData(envio.dataEnvio)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
