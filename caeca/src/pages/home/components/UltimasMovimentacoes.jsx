import { ArrowRight, Gem } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BlocoEstado } from './BlocoEstado';
import styles from './UltimasMovimentacoes.module.css';

const ROTULO_TIPO = { ENTRADA: 'Entrada', SAIDA: 'Saída', REENTRADA: 'Reentrada' };

const formatarData = (valor) =>
    new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
        .format(new Date(valor));

export function UltimasMovimentacoes({ dados, carregando, erro }) {
    const navigate = useNavigate();
    const vazio = dados.length === 0;

    return (
        <section className={styles.card}>
            <header className={styles.cabecalho}>
                <div>
                    <h3 className={styles.titulo}>Últimas movimentações</h3>
                    <p className={styles.subtitulo}>As 5 operações mais recentes</p>
                </div>
                <button type="button" className={styles.link} onClick={() => navigate('/joias/movimentacoes')}>
                    Ver histórico <ArrowRight size={16} />
                </button>
            </header>

            {carregando || erro || vazio ? (
                <BlocoEstado carregando={carregando} erro={erro} vazio={vazio} altura={200} />
            ) : (
                <ul className={styles.lista}>
                    {dados.map((mov, i) => {
                        const tipo = mov.motivoMovimentacao?.tipoMovimentacao?.nome;
                        const entrada = tipo === 'ENTRADA';
                        return (
                            <li key={mov.id ?? i} className={styles.item}>
                                <div className={styles.foto}>
                                    {mov.joia?.arquivo ? (
                                        <img src={mov.joia.arquivo.url} alt="" />
                                    ) : (
                                        <Gem size={18} />
                                    )}
                                </div>
                                <div className={styles.info}>
                                    <span className={styles.nome}>{mov.joia?.nome}</span>
                                    <span className={styles.detalhe}>
                                        {formatarData(mov.data)} · {ROTULO_TIPO[tipo] ?? tipo}
                                    </span>
                                </div>
                                <span className={`${styles.quantidade} ${entrada ? styles.positiva : styles.negativa}`}>
                                    {mov.quantidade ? `${entrada ? '+' : '-'}${mov.quantidade}` : '-'}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
