import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { Table } from "../../components/ui/Table";
import { Toast } from "../../components/ui/Toast";
import { revendedoraApi } from "../../service/revendedoraApi";
import styles from "./Revendedoras.module.css";

const colunas = ["NOME", "CONTATO", "ENDEREÇO", "ATIVIDADE"];
const POR_PAGINA = 10;

function formatarData(data) {
    if (!data) return "";

    const dataValida = new Date(data);
    if (Number.isNaN(dataValida.getTime())) return "";

    return new Intl.DateTimeFormat("pt-BR").format(dataValida);
}

function formatarEndereco(revendedora) {
    const endereco = revendedora.endereco;
    if (typeof endereco === "string") return endereco || "-";

    const logradouro = endereco?.logradouro ?? revendedora.logradouro;
    const numero = endereco?.numero ?? revendedora.numero;
    const bairro = endereco?.bairro ?? revendedora.bairro;
    const cidade = endereco?.cidade ?? revendedora.cidade;
    const uf = endereco?.uf ?? revendedora.uf;
    const linhaPrincipal = [logradouro, numero].filter(Boolean).join(" ");
    const cidadeEstado = [cidade, uf].filter(Boolean).join("/");
    const partes = [linhaPrincipal, bairro, cidadeEstado].filter(Boolean);

    return partes.join(", ") || "-";
}

function revendedoraAtiva(revendedora) {
    if (typeof revendedora.isAtivo === "boolean") return revendedora.isAtivo;
    if (typeof revendedora.ativo === "boolean") return revendedora.ativo;

    const status = String(revendedora.status ?? "").toLowerCase();
    if (["ativo", "ativa", "active"].includes(status)) return true;
    if (["inativo", "inativa", "inactive"].includes(status)) return false;
    return null;
}

export function Revendedoras() {
    const navigate = useNavigate();
    const [revendedoras, setRevendedoras] = useState([]);
    const [busca, setBusca] = useState("");
    const [filtroAtividade, setFiltroAtividade] = useState("");
    const [filtroAberto, setFiltroAberto] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [carregando, setCarregando] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function carregarRevendedoras() {
            try {
                const lista = await revendedoraApi.listarRevendedoras();
                if (!ignore) setRevendedoras(lista);
            } catch {
                if (!ignore) setToast({ message: "Não foi possível carregar as revendedoras." });
            } finally {
                if (!ignore) setCarregando(false);
            }
        }

        carregarRevendedoras();
        return () => { ignore = true; };
    }, []);

    const filtradas = useMemo(() => {
        const termo = busca.trim().toLocaleLowerCase("pt-BR");

        return revendedoras.filter((revendedora) => {
            const atividade = revendedoraAtiva(revendedora);
            const correspondeAoTermo = !termo || [
                revendedora.nome,
                revendedora.email,
                revendedora.telefone,
                formatarEndereco(revendedora)
            ].some((valor) => String(valor ?? "").toLocaleLowerCase("pt-BR").includes(termo));
            const correspondeAtividade = !filtroAtividade || String(atividade) === filtroAtividade;

            return correspondeAoTermo && correspondeAtividade;
        });
    }, [revendedoras, busca, filtroAtividade]);

    const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
    const revendedorasDaPagina = filtradas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

    const funcaoRender = {
        render: (row, coluna) => {
            switch (coluna) {
                case "NOME":
                    return (
                        <div className={styles.nameCell}>
                            <button
                                type="button"
                                className={styles.name}
                                disabled={!row.id && !row.idRevendedora}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/contribuintes/revendedoras/${row.id ?? row.idRevendedora}`);
                                }}
                            >
                                {row.nome || "-"}
                            </button>
                            <span className={styles.date}>{formatarData(row.dataCadastro)}</span>
                        </div>
                    );
                case "CONTATO":
                    return (
                        <div className={styles.contactCell}>
                            <span>{row.email || "-"}</span>
                            {row.telefone && <span>{row.telefone}</span>}
                        </div>
                    );
                case "ENDEREÇO":
                    return <span className={styles.address}>{formatarEndereco(row)}</span>;
                case "ATIVIDADE": {
                    const ativa = revendedoraAtiva(row);
                    return (
                        <span className={`${styles.badge} ${ativa ? styles.badgeActive : styles.badgeInactive}`}>
                            {ativa === null ? "Não informado" : ativa ? "Ativo" : "Inativo"}
                        </span>
                    );
                }
                default:
                    return null;
            }
        }
    };

    return (
        <>
            {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
            <PageHeader titulo="Revendedoras">
                <Button onClick={() => navigate("/contribuintes?tipo=revendedora")}>
                    Adicionar Revendedora
                </Button>
            </PageHeader>

            <main className={styles.pageContainer}>
                <div className={styles.toolbar}>
                    <label className={styles.searchInputWrapper}>
                        <span className={styles.visuallyHidden}>Pesquisar revendedora</span>
                        <input
                            type="search"
                            placeholder="Pesquisar revendedora"
                            className={styles.searchInput}
                            value={busca}
                            onChange={(event) => {
                                setBusca(event.target.value);
                                setPaginaAtual(1);
                            }}
                        />
                        <Search size={16} aria-hidden="true" />
                    </label>

                    <div className={styles.filterContainer}>
                        <Button
                            className={styles.filterButton}
                            aria-expanded={filtroAberto}
                            onClick={() => setFiltroAberto((aberto) => !aberto)}
                        >
                            <Filter size={15} aria-hidden="true" />
                            Filtro
                        </Button>
                        {filtroAberto && (
                            <label className={styles.activityFilter}>
                                <span>Atividade</span>
                                <select
                                    value={filtroAtividade}
                                    onChange={(event) => {
                                        setFiltroAtividade(event.target.value);
                                        setPaginaAtual(1);
                                    }}
                                >
                                    <option value="">Todas</option>
                                    <option value="true">Ativas</option>
                                    <option value="false">Inativas</option>
                                </select>
                            </label>
                        )}
                    </div>
                </div>

                {carregando ? (
                    <div className={styles.emptyState}>Carregando revendedoras...</div>
                ) : revendedorasDaPagina.length > 0 ? (
                    <Table
                        colunas={colunas}
                        funcaoRender={funcaoRender}
                        data={revendedorasDaPagina}
                        onRowClick={(row) => navigate(`/contribuintes/revendedoras/${row.id ?? row.idRevendedora}`)}
                    />
                ) : (
                    <div className={styles.emptyState}>
                        {revendedoras.length === 0
                            ? "Nenhuma revendedora cadastrada"
                            : "Nenhuma revendedora encontrada"}
                    </div>
                )}

                <Pagination
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    aoMudarPagina={setPaginaAtual}
                />
            </main>
        </>
    );
}