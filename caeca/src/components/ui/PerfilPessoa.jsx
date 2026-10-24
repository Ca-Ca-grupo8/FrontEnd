import { CalendarDays, Check, Lock, RefreshCw } from "lucide-react";
import { formatarData } from "../../utils/formatarData";
import { PageHeader } from "./PageHeader";
import styles from "./PerfilPessoa.module.css";

export function PerfilPessoa({
    titulo,
    acoes,
    estado,
    icone: Icone,
    iniciais,
    nome,
    ativo,
    situacao,
    textoStatus,
    dataCadastro,
    dataAtualizacao,
    contatos = [],
    painel,
    ariaLabel,
    children
}) {
    if (estado) {
        return (
            <div className={styles.page}>
                <PageHeader titulo={titulo}>{acoes}</PageHeader>
                <div className={styles.state}>{estado}</div>
            </div>
        );
    }

    const inativo = ativo === false;
    const tomPainel = painel?.tom ?? (inativo ? "inativo" : "ok");
    const classesPainel = {
        ok: "",
        inativo: styles.activitySinceInactive,
        neutro: styles.activitySinceNeutro
    };

    return (
        <div className={styles.page}>
            <PageHeader titulo={titulo}>{acoes}</PageHeader>

            <main className={styles.content}>
                <section className={styles.profile} aria-label={ariaLabel}>
                    <div className={styles.identity}>
                        <div className={styles.avatar} aria-hidden="true">
                            {iniciais ? <span className={styles.iniciais}>{iniciais}</span> : <Icone size={46} strokeWidth={1.4} />}
                        </div>
                        <h2>{nome || titulo}</h2>
                        {situacao ? (
                            <span className={`${styles.activity} ${styles[situacao.tom]}`}>
                                <span className={styles.activityDot} />
                                {situacao.texto}
                            </span>
                        ) : ativo !== undefined && (
                            <span className={`${styles.activity} ${inativo ? styles.inactive : ""}`}>
                                <span className={styles.activityDot} />
                                {ativo === null ? textoStatus.indefinido : ativo ? textoStatus.ativo : textoStatus.inativo}
                            </span>
                        )}
                        {dataCadastro !== undefined && (
                            <p className={styles.createdDate}>
                                <CalendarDays size={15} aria-hidden="true" />
                                {dataCadastro ? `adicionada ${formatarData(dataCadastro)}` : "Data de cadastro não informada"}
                            </p>
                        )}
                        {dataAtualizacao !== undefined && (
                            <p className={styles.createdDate}>
                                <RefreshCw size={15} aria-hidden="true" />
                                {dataAtualizacao ? `atualizada ${formatarData(dataAtualizacao)}` : "Data de atualização não informada"}
                            </p>
                        )}
                    </div>

                    <div className={styles.contact}>
                        <h2>Informações de contato</h2>
                        {contatos.map(({ rotulo, valor, href, icone: IconeContato }) => (
                            <div className={styles.contactItem} key={rotulo}>
                                <span className={styles.contactIcon}><IconeContato size={18} /></span>
                                <div>
                                    <span>{rotulo}</span>
                                    {href && valor ? <a href={href}>{valor}</a> : <p>{valor || "-"}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {painel && (
                        <aside className={styles.activityPanel}>
                            <h2>{painel.titulo}</h2>
                            <div className={`${styles.activitySince} ${classesPainel[tomPainel]}`}>
                                <span>{painel.rotulo}</span>
                                <strong>{painel.valor}</strong>
                                {painel.descricao && <p className={styles.painelDescricao}>{painel.descricao}</p>}
                            </div>
                        </aside>
                    )}
                </section>

                {children && <section className={styles.sales}>{children}</section>}
            </main>
        </div>
    );
}

export function MensagemPerfil({ children }) {
    return <div className={styles.state}>{children}</div>;
}

export function AreasAcesso({ titulo, descricao, areas }) {
    return (
        <section className={styles.card} aria-label={titulo}>
            <h2 className={styles.cardTitulo}>{titulo}</h2>
            {descricao && <p className={styles.cardDescricao}>{descricao}</p>}
            <ul className={styles.areas}>
                {areas.map(({ nome, restrita }) => {
                    const IconeArea = restrita ? Lock : Check;
                    return (
                        <li className={`${styles.area} ${restrita ? styles.areaRestrita : ""}`} key={nome}>
                            <span className={styles.areaIcone}><IconeArea size={14} /></span>
                            {nome}
                            {restrita && <span className={styles.areaTag}>Restrito</span>}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
