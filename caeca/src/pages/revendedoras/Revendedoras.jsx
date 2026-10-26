import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BotaoAdicionar } from "../../components/ui/BotaoAdicionar";
import { PageHeader } from "../../components/ui/PageHeader";
import { Pagination } from "../../components/ui/Pagination";
import { Table } from "../../components/ui/Table";
import { FilterBar } from "../../components/ui/filters/FilterBar";
import { SearchFilter } from "../../components/ui/filters/SearchFilter";
import { SelectFilter } from "../../components/ui/filters/SelectFilter";
import { revendedoraApi } from "../../service/revendedoraApi";
import { useListFilters } from "../../hooks/useListFilters";
import styles from "./Revendedoras.module.css";
import listStyle from "../../styles/ListPage.module.css";

const colunas = ["NOME", "CONTATO", "ENDEREÇO", "ATIVIDADE"];
const POR_PAGINA = 10;

const FILTROS_PADRAO = {
    busca: "",
    atividade: ""
};

const OPCOES_ATIVIDADE = [
    { value: "", label: "Todos" },
    { value: "true", label: "Ativo" },
    { value: "false", label: "Inativo" }
];

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
    const [carregando, setCarregando] = useState(true);
    const { valores, pagina, setFilter, setPagina, limpar, temFiltrosAtivos } = useListFilters(FILTROS_PADRAO);

    useEffect(() => {
        let ignore = false;

        async function carregarRevendedoras() {
            try {
                const lista = await revendedoraApi.listarRevendedoras();
                if (!ignore) setRevendedoras(lista);
            } catch {
                // erro exibido pelo interceptor global
            } finally {
                if (!ignore) setCarregando(false);
            }
        }

        carregarRevendedoras();
        return () => { ignore = true; };
    }, []);

    const filtradas = useMemo(() => {
        const termo = valores.busca.trim().toLocaleLowerCase("pt-BR");

        return revendedoras.filter((revendedora) => {
            const atividade = revendedoraAtiva(revendedora);
            const correspondeAoTermo = !termo || [
                revendedora.nome,
                revendedora.email,
                revendedora.telefone,
                formatarEndereco(revendedora)
            ].some((valor) => String(valor ?? "").toLocaleLowerCase("pt-BR").includes(termo));
            const correspondeAtividade = !valores.atividade || String(atividade) === valores.atividade;

            return correspondeAoTermo && correspondeAtividade;
        });
    }, [revendedoras, valores]);

    const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
    const paginaEfetiva = Math.min(pagina, totalPaginas);
    const revendedorasDaPagina = filtradas.slice((paginaEfetiva - 1) * POR_PAGINA, paginaEfetiva * POR_PAGINA);

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
            <PageHeader titulo="Revendedoras">
                <BotaoAdicionar rotulo="Adicionar Revendedora" onClick={() => navigate("/contribuintes?tipo=revendedora")} />
            </PageHeader>

            <main className={listStyle.pageContainer}>
                <FilterBar ariaLabel="Filtros de revendedoras" temFiltrosAtivos={temFiltrosAtivos} onLimpar={limpar}>
                    <SearchFilter
                        rotulo="Pesquisar revendedora"
                        placeholder="Pesquisar revendedora"
                        valor={valores.busca}
                        onChange={(valor) => setFilter("busca", valor)}
                    />
                    <SelectFilter
                        rotulo="Atividade"
                        valor={valores.atividade}
                        onChange={(valor) => setFilter("atividade", valor)}
                        opcoes={OPCOES_ATIVIDADE}
                    />
                </FilterBar>

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
                    paginaAtual={paginaEfetiva}
                    totalPaginas={totalPaginas}
                    aoMudarPagina={setPagina}
                />
            </main>
        </>
    );
}
