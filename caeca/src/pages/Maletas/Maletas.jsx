import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Maletas.module.css';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { vendaApi } from '../../service/maletasApi';
import { StatusMaletaBadge } from './StatusMaletaBadge';
import { contarItens } from './tipoMovimentacao';
import { PageHeader } from '../../components/ui/PageHeader';
import { emitirToast } from '../../utils/toastBus';
import { Pagination } from '../../components/ui/Pagination';

export function Maletas() {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        nomeRevendedora: '',
        dataInicio: '',
        dataFim: '',
        ordem: 'desc'
    });
    const [appliedFilters, setAppliedFilters] = useState(() => {
        const { ordem, ...filtrosSemOrdem } = filters;
        return { ...filtrosSemOrdem, page: 0, sort: `data,${ordem}` };
    });
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pagina = await vendaApi.buscarMaletas(appliedFilters);
                setData(pagina.content ?? []);
                setTotalPaginas(pagina.totalPages ?? 1);
            } catch {
                // erro exibido pelo interceptor global
            }
        };

        fetchData();
    }, [appliedFilters]);

    const atualizarFiltro = (campo, valor) => {
        setFilters((filtrosAtuais) => ({ ...filtrosAtuais, [campo]: valor }));
    };

    const validarPeriodo = (filtros) => {
        const periodoInvalido = filtros.dataInicio && filtros.dataFim && filtros.dataInicio > filtros.dataFim;

        if (periodoInvalido) {
            emitirToast({ message: 'A data de início não pode ser maior que a data de fim.', type: 'error' });
        }

        return !periodoInvalido;
    };

    const atualizarData = (campo, valor) => {
        const novosFiltros = { ...filters, [campo]: valor };
        atualizarFiltro(campo, valor);
        validarPeriodo(novosFiltros);
    };

    const periodoValido =
        Boolean(filters.dataInicio) === Boolean(filters.dataFim) &&
        (!filters.dataInicio || filters.dataInicio <= filters.dataFim);

    const buscarMaletas = () => {
        if (!periodoValido) return;

        setPaginaAtual(1);
        const { ordem, ...filtrosSemOrdem } = filters;
        setAppliedFilters({ ...filtrosSemOrdem, page: 0, sort: `data,${ordem}` });
    };

    const alterarPagina = (pagina) => {
        setPaginaAtual(pagina);
        setAppliedFilters((filtros) => ({ ...filtros, page: pagina - 1 }));
    };

    const colunas = ["NOME", "DATA", "DATA LIMITE", "REVENDEDORA", "ITENS", "TOTAL", "STATUS"];

    const formatarMoeda = (valor) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

    const formatarData = (dataStr) => {
        if (!dataStr) {
            return '-';
        }

        const data = new Date(dataStr);
        if (Number.isNaN(data.getTime())) {
            return '-';
        }

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(data);
    };

    const funcaoRender = {
        render: (row, col) => {
            switch (col) {
                case 'NOME':
                    return <span>{row.nome}</span>;

                case 'DATA':
                    return <span>{formatarData(row.data)}</span>;

                case 'DATA LIMITE':
                    return <span>{formatarData(row.dataLimite)}</span>;

                case 'REVENDEDORA':
                    return <span>{row.revendedora.nome}</span>;

                case 'ITENS': {
                    const totalItens = contarItens(row.movimentacoes);
                    return <span>{totalItens} ite{totalItens === 1 ? 'm' : 'ns'}</span>;
                }
                case 'TOTAL':
                    return <span className={style['total-value']}>{row.totalVenda ? formatarMoeda(row.totalVenda) : '-'}</span>;

                case 'STATUS':
                    return <StatusMaletaBadge status={row.status} />;

                default:
                    return null;
            }
        }
    };

    return (
        <>
            <PageHeader titulo="Maletas" subtitulo="Ver histórico de movimentações das jóias" dashed={true} />
            <div className={style['page-container']}>
                <div className={style['toolbar']}>
                    <div className={style['search-input-wrapper']}>
                        <span className={style['search-icon']}>🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar revendedora pelo nome"
                            className={style['search-input']}
                            value={filters.nomeRevendedora}
                            onChange={(event) => atualizarFiltro('nomeRevendedora', event.target.value)}
                            onKeyDown={(event) => { if (event.key === 'Enter') buscarMaletas(); }}
                        />
                    </div>

                    <div className={style['filter-buttons']}>
                        <label className={style['date-filter']}>
                            <span>De</span>
                            <input type="date" value={filters.dataInicio} onChange={(event) => atualizarData('dataInicio', event.target.value)} />
                        </label>
                        <label className={style['date-filter']}>
                            <span>Até</span>
                            <input type="date" value={filters.dataFim} onChange={(event) => atualizarData('dataFim', event.target.value)} />
                        </label>
                        <label className={style['type-filter']}>
                            <span>Ordem</span>
                            <select value={filters.ordem} onChange={(event) => atualizarFiltro('ordem', event.target.value)}>
                                <option value="desc">Mais recentes</option>
                                <option value="asc">Mais antigas</option>
                            </select>
                        </label>
                        <Button colorido={true} disabled={!periodoValido} onClick={buscarMaletas}>Buscar</Button>
                    </div>
                </div>

                {data.length > 0 ? (
                    <Table colunas={colunas} funcaoRender={funcaoRender} data={data}
                        onRowClick={(row) => navigate(`/joias/maletas/${row.idMovimentacaoRevendedora}`)} />
                ) : (
                    <div className={style['empty-state']}>Não há Maletas</div>
                )}

                <Pagination
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    aoMudarPagina={alterarPagina}
                />
            </div>
        </>
    );
}
