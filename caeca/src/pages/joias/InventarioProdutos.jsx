import { useEffect, useState } from 'react';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Pagination } from '../../components/ui/Pagination';
import { FilterBar } from '../../components/ui/filters/FilterBar';
import { SearchFilter } from '../../components/ui/filters/SearchFilter';
import { SelectFilter } from '../../components/ui/filters/SelectFilter';
import { DateRangeFilter } from '../../components/ui/filters/DateRangeFilter';
import { joiaApi } from '../../service/joiaApi';
import { categoriaApi } from '../../service/categoriaApi';
import { materialApi } from '../../service/materialApi';
import { banhoApi } from '../../service/banhoApi';
import { useListFilters } from '../../hooks/useListFilters';
import { validarPeriodo } from '../../utils/validarPeriodo';
import style from './InventarioProdutos.module.css';
import { useNavigate } from 'react-router-dom';

const colunas = [
    'PRODUTOS',
    'QUANTIDADE',
    'CATEGORIA',
    'PRECO UNITARIO',
    'ULTIMA MODIFICACAO',
    'STATUS'
];

// A dashboard entra aqui com ?categoria=<id> vinda dos rankings.
const FILTROS_PADRAO = {
    nome: '',
    categoria: '',
    material: '',
    banho: '',
    joiaStatus: '',
    dataInicio: '',
    dataFim: '',
    ordem: 'asc'
};

const OPCOES_STATUS = [
    { value: '', label: 'Todos' },
    { value: 'OK', label: 'OK' },
    { value: 'ALERTA', label: 'Alerta' },
    { value: 'CRITICO', label: 'Em falta' },
    { value: 'INATIVO', label: 'Inativo' }
];

const OPCOES_ORDEM = [
    { value: 'asc', label: 'A - Z' },
    { value: 'desc', label: 'Z - A' }
];

const comOpcaoTodos = (itens) => [
    { value: '', label: 'Todos' },
    ...(itens ?? []).map((item) => ({ value: String(item.id), label: item.nome }))
];

export function InventarioProdutos() {
    const navigate = useNavigate()
    const { valores, pagina, setFilter, setPagina, limpar, temFiltrosAtivos } = useListFilters(FILTROS_PADRAO);
    const [categorias, setCategorias] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [banhos, setBanhos] = useState([]);
    const [consulta, setConsulta] = useState({ chave: null, itens: [], totalPaginas: 1 });

    const periodo = validarPeriodo(valores);
    const periodoValido = periodo.valido;
    const chaveConsulta = JSON.stringify({ ...valores, pagina });
    const carregando = periodoValido && consulta.chave !== chaveConsulta;
    const { itens: produtos, totalPaginas } = consulta;

    useEffect(() => {
        const carregarOpcoes = async () => {
            try {
                const [categoriasEncontradas, materiaisEncontrados, banhosEncontrados] = await Promise.all([
                    categoriaApi.listarCategorias(),
                    materialApi.listarMateriais(),
                    banhoApi.listarBanhos()
                ]);
                setCategorias(categoriasEncontradas);
                setMateriais(materiaisEncontrados);
                setBanhos(banhosEncontrados);
            } catch {
                // erro exibido pelo interceptor global
            }
        };

        carregarOpcoes();
    }, []);

    useEffect(() => {
        if (!periodoValido) {
            return;
        }

        const controller = new AbortController();
        const { ordem, ...filtros } = valores;

        joiaApi.listarJoias(
            { ...filtros, page: pagina - 1, sort: `nome,${ordem}` },
            { signal: controller.signal }
        )
            .then((resposta) => {
                setConsulta({ chave: chaveConsulta, itens: resposta.content ?? [], totalPaginas: resposta.totalPages ?? 1 });
            })
            .catch(() => {
                // erro exibido pelo interceptor global
                if (!controller.signal.aborted) setConsulta({ chave: chaveConsulta, itens: [], totalPaginas: 1 });
            });

        return () => controller.abort();
    }, [valores, pagina, periodoValido, chaveConsulta]);

    const formatarPreco = (preco) => {
        if (preco === null || preco === undefined) {
            return '-';
        }

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(preco);
    };

    const funcaoRender = {
        render: (row, coluna) => {
            switch (coluna) {
                case 'PRODUTOS':
                    return (
                        <div className={style['product-cell']}>
                            {row.arquivo?.url ? (
                                <img src={row.arquivo.url} alt={row.nome} className={style['product-thumb']} />
                            ) : (
                                <div className={style['product-thumb-placeholder']}>[FOTO]</div>
                            )}
                            <span className={style['product-title']} onClick={(e) => { e.stopPropagation(); navigate(`/joias/${row.id}`) }}>{row.nome || '-'}</span>
                        </div>
                    );
                case 'QUANTIDADE':
                    return row.quantidade ?? '-';
                case 'CATEGORIA':
                    return row.categoria.nome ?? '-';
                case 'PRECO UNITARIO':
                    return formatarPreco(row.preco);
                case 'ULTIMA MODIFICACAO':
                    {
                        const data = new Date(row.dataAtualizacao);
                        const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }).format(data);
                        return dataFormatada ?? "-";
                    }
                case 'STATUS': {
                    const statusBadge = {
                        "OK": ["badge-active", "OK"],
                        "ALERTA": ["badge-alert", "ALERTA"],
                        "CRITICO": ["badge-danger", "EM FALTA"],
                        "INATIVO": ["badge-inactive", "INATIVO"]
                    }

                    const currentStatus = statusBadge[row.status] || ["badge-inactive", row.status || "DESCONHECIDO"];
                    return (
                        <span className={`${style.badge} ${style[currentStatus[0]] || ''}`}>
                            {currentStatus[1]}
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
            <PageHeader titulo="Inventário de produtos" subtitulo="Visualize o inventário de produtos" />
            <div className={style['page-container']}>
                <FilterBar ariaLabel="Filtros do inventário" temFiltrosAtivos={temFiltrosAtivos} onLimpar={limpar}>
                    <SearchFilter
                        rotulo="Buscar produto"
                        placeholder="Buscar produto pelo nome"
                        valor={valores.nome}
                        onChange={(valor) => setFilter('nome', valor)}
                    />
                    <SelectFilter
                        rotulo="Categoria"
                        valor={valores.categoria}
                        onChange={(valor) => setFilter('categoria', valor)}
                        opcoes={comOpcaoTodos(categorias)}
                    />
                    <SelectFilter
                        rotulo="Material"
                        valor={valores.material}
                        onChange={(valor) => setFilter('material', valor)}
                        opcoes={comOpcaoTodos(materiais)}
                    />
                    <SelectFilter
                        rotulo="Banho"
                        valor={valores.banho}
                        onChange={(valor) => setFilter('banho', valor)}
                        opcoes={comOpcaoTodos(banhos)}
                    />
                    <SelectFilter
                        rotulo="Status"
                        valor={valores.joiaStatus}
                        onChange={(valor) => setFilter('joiaStatus', valor)}
                        opcoes={OPCOES_STATUS}
                    />
                    <DateRangeFilter
                        dataInicio={valores.dataInicio}
                        dataFim={valores.dataFim}
                        onChange={setFilter}
                        erro={periodo.mensagem}
                    />
                    <SelectFilter
                        rotulo="Ordem"
                        valor={valores.ordem}
                        onChange={(valor) => setFilter('ordem', valor)}
                        opcoes={OPCOES_ORDEM}
                    />
                </FilterBar>

                {carregando ? (
                    <div className={style['empty-state']}>Carregando produtos...</div>
                ) : produtos.length > 0 ? (
                    <Table
                        colunas={colunas}
                        funcaoRender={funcaoRender}
                        data={produtos}
                        onRowClick={(row) => navigate(`/joias/${row.id}`)}
                    />
                ) : (
                    <div className={style['empty-state']}>
                        Não há produtos para exibir
                    </div>
                )}

                <Pagination
                    paginaAtual={pagina}
                    totalPaginas={totalPaginas}
                    aoMudarPagina={setPagina}
                />
            </div>
        </>
    );
}
