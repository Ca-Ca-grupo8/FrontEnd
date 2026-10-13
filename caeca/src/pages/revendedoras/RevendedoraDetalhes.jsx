import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { Table } from "../../components/ui/Table";
import { Toast } from "../../components/ui/Toast";
import { vendaApi } from "../../service/maletasApi";
import { revendedoraApi } from "../../service/revendedoraApi";
import { StatusMaletaBadge } from "../Maletas/StatusMaletaBadge";
import styles from "./RevendedoraDetalhes.module.css";

const colunas = ["CÓDIGO", "DATA", "TOTAL (R$)", "REVENDEDORA", "STATUS"];
const POR_PAGINA = 10;

function formatarData(data) {
    if (!data) return "-";
    const dataValida = new Date(data);
    if (Number.isNaN(dataValida.getTime())) return "-";

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(dataValida);
}

function formatarMoeda(valor) {
    if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "-";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor));
}

function obterEndereco(revendedora) {
    const endereco = revendedora?.endereco;
    if (typeof endereco === "string") return endereco || "-";

    const logradouro = endereco?.logradouro ?? revendedora?.logradouro;
    const numero = endereco?.numero ?? revendedora?.numero;
    const complemento = endereco?.complemento ?? revendedora?.complemento;
    const bairro = endereco?.bairro ?? revendedora?.bairro;
    const cidade = endereco?.cidade ?? revendedora?.cidade;
    const uf = endereco?.uf ?? revendedora?.uf;
    const linha = [logradouro, numero].filter(Boolean).join(", ");
    const complementoBairro = [complemento, bairro].filter(Boolean).join(" - ");
    const cidadeEstado = [cidade, uf].filter(Boolean).join(" - ");

    return [linha, complementoBairro, cidadeEstado].filter(Boolean).join(", ") || "-";
}

function obterAtividade(revendedora) {
    if (typeof revendedora?.isAtivo === "boolean") return revendedora.isAtivo;
    if (typeof revendedora?.ativo === "boolean") return revendedora.ativo;

    const status = String(revendedora?.status ?? "").toLowerCase();
    if (["ativo", "ativa", "active"].includes(status)) return true;
    if (["inativo", "inativa", "inactive"].includes(status)) return false;
    return null;
}

export function RevendedoraDetalhes() {
    const { id } = useParams();
    const [revendedora, setRevendedora] = useState(null);
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoVendas, setCarregandoVendas] = useState(false);
    const [erro, setErro] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function carregarRevendedora() {
            setCarregando(true);
            setErro(false);
            setRevendedora(null);

            try {
                const lista = await revendedoraApi.listarRevendedoras();
                const encontrada = lista.find((item) => String(item.id ?? item.idRevendedora) === id);
                if (!ignore) {
                    if (encontrada) {
                        setRevendedora(encontrada);
                    } else {
                        setErro(true);
                    }
                }
            } catch {
                if (!ignore) setErro(true);
            } finally {
                if (!ignore) setCarregando(false);
            }
        }

        carregarRevendedora();
        return () => { ignore = true; };
    }, [id]);

    useEffect(() => {
        if (!revendedora?.nome) return undefined;
        let ignore = false;

        async function carregarVendas() {
            setCarregandoVendas(true);
            try {
                const pagina = await vendaApi.buscarMaletas({
                    nomeRevendedora: revendedora.nome,
                    page: paginaAtual - 1,
                    size: POR_PAGINA,
                    sort: "data,desc"
                });
                const idRevendedora = String(revendedora.id ?? revendedora.idRevendedora);
                const vendasDaRevendedora = (pagina.content ?? []).filter(
                    (venda) => String(venda.revendedora?.id ?? venda.revendedora?.idRevendedora) === idRevendedora
                );

                if (!ignore) {
                    setVendas(vendasDaRevendedora);
                    setTotalPaginas(pagina.totalPages ?? 1);
                }
            } catch {
                if (!ignore) setToast({ message: "Não foi possível carregar as vendas da revendedora." });
            } finally {
                if (!ignore) setCarregandoVendas(false);
            }
        }

        carregarVendas();
        return () => { ignore = true; };
    }, [revendedora, paginaAtual]);

    const atividade = useMemo(() => revendedora && obterAtividade(revendedora), [revendedora]);

    const funcaoRender = {
        render: (venda, coluna) => {
            switch (coluna) {
                case "CÓDIGO":
                    return venda.idMovimentacaoRevendedora ?? venda.id ?? "-";
                case "DATA":
                    return formatarData(venda.data);
                case "TOTAL (R$)":
                    return <strong>{formatarMoeda(venda.totalVenda)}</strong>;
                case "REVENDEDORA":
                    return venda.revendedora?.nome ?? revendedora.nome;
                case "STATUS":
                    return <StatusMaletaBadge status={venda.status} />;
                default:
                    return null;
            }
        }
    };

    if (carregando || erro || !revendedora) {
        return (
            <div className={styles.page}>
                <PageHeader titulo="Informações sobre a revendedora" />
                <div className={styles.state}>
                    {carregando ? "Carregando informações da revendedora..." : "Não foi possível carregar a revendedora."}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
            <PageHeader titulo="Informações sobre a revendedora" />

            <main className={styles.content}>
                <section className={styles.profile} aria-label="Dados da revendedora">
                    <div className={styles.identity}>
                        <div className={styles.avatar} aria-hidden="true"><UserRound size={46} strokeWidth={1.4} /></div>
                        <h2>{revendedora.nome || "Revendedora"}</h2>
                        <span className={`${styles.activity} ${atividade === false ? styles.inactive : ""}`}>
                            <span className={styles.activityDot} />
                            {atividade === null ? "Atividade não informada" : atividade ? "Revendedora ativa" : "Revendedora inativa"}
                        </span>
                        <p className={styles.createdDate}>
                            <CalendarDays size={15} aria-hidden="true" />
                            {revendedora.dataCadastro ? `adicionada ${formatarData(revendedora.dataCadastro)}` : "Data de cadastro não informada"}
                        </p>
                    </div>

                    <div className={styles.contact}>
                        <h2>Informações de contato</h2>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}><Mail size={18} /></span>
                            <div><span>Email</span><a href={revendedora.email ? `mailto:${revendedora.email}` : undefined}>{revendedora.email || "-"}</a></div>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}><MapPin size={18} /></span>
                            <div><span>Endereço</span><p>{obterEndereco(revendedora)}</p></div>
                        </div>
                        <div className={styles.contactItem}>
                            <span className={styles.contactIcon}><Phone size={18} /></span>
                            <div><span>Telefone</span><a href={revendedora.telefone ? `tel:${revendedora.telefone}` : undefined}>{revendedora.telefone || "-"}</a></div>
                        </div>
                        {revendedora.telefoneReserva && (
                            <div className={styles.contactItem}>
                                <span className={styles.contactIcon}><Phone size={18} /></span>
                                <div><span>Telefone reserva</span><a href={`tel:${revendedora.telefoneReserva}`}>{revendedora.telefoneReserva}</a></div>
                            </div>
                        )}
                    </div>

                    <aside className={styles.activityPanel}>
                        <h2>Atividade recente</h2>
                        <div className={`${styles.activitySince} ${atividade === false ? styles.activitySinceInactive : ""}`}>
                            <span>Cadastro realizado em</span>
                            <strong>{formatarData(revendedora.dataCadastro)}</strong>
                        </div>
                    </aside>
                </section>

                <section className={styles.sales} aria-label="Vendas da revendedora">
                    {carregandoVendas ? (
                        <div className={styles.state}>Carregando vendas...</div>
                    ) : vendas.length > 0 ? (
                        <Table colunas={colunas} funcaoRender={funcaoRender} data={vendas} />
                    ) : (
                        <div className={styles.state}>Nenhuma venda encontrada para esta revendedora.</div>
                    )}
                    <Pagination
                        paginaAtual={paginaAtual}
                        totalPaginas={totalPaginas}
                        aoMudarPagina={setPaginaAtual}
                    />
                </section>
            </main>
        </div>
    );
}