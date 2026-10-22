import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BlocoEstado } from './BlocoEstado';
import styles from './RankingPecas.module.css';

const formatarNumero = (valor) => new Intl.NumberFormat('pt-BR').format(valor ?? 0);

export function RankingPecas({ titulo, subtitulo, itens, campo, rotuloValor, detalhe, formatar, caminhoVerMais, rotuloVerMais, caminhoItem, carregando, erro }) {
    const navigate = useNavigate();
    const vazio = itens.length === 0;

    return (
        <section className={styles.card}>
            <header className={styles.cabecalho}>
                <div>
                    <h3 className={styles.titulo}>{titulo}</h3>
                    <p className={styles.subtitulo}>{subtitulo}</p>
                    {caminhoVerMais && (
                        <button type="button" className={styles.link} onClick={() => navigate(caminhoVerMais)}>
                            {rotuloVerMais} <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </header>

            {carregando || erro || vazio ? (
                <BlocoEstado carregando={carregando} erro={erro} vazio={vazio} altura={200} />
            ) : (
                <ol className={styles.lista}>
                    {itens.map((item, i) => {
                        const caminho = caminhoItem?.(item);
                        const Conteudo = caminho ? 'button' : 'div';

                        return (
                            <li key={`${item.nome}-${i}`} className={styles.item}>
                                <Conteudo
                                    {...(caminho ? { type: 'button', onClick: () => navigate(caminho) } : {})}
                                    className={caminho ? styles.itemClicavel : styles.itemConteudo}
                                >
                                    <div className={styles.info}>
                                        <span className={styles.nome}>{item.nome}</span>
                                        {detalhe && <span className={styles.detalhe}>{detalhe(item)}</span>}
                                    </div>
                                    <span className={styles.valor}>
                                        {formatar ? formatar(item) : (
                                            <>{formatarNumero(item[campo])} <small>{rotuloValor}</small></>
                                        )}
                                    </span>
                                </Conteudo>
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
}
