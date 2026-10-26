import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Maletas.module.css';
import { Table } from '../../components/ui/Table';
import { vendaApi } from '../../service/maletasApi';
import { StatusMaletaBadge } from './StatusMaletaBadge';
import { contarItens } from './tipoMovimentacao';
import { PageHeader } from '../../components/ui/PageHeader';
import { Pagination } from '../../components/ui/Pagination';
import { FilterBar } from '../../components/ui/filters/FilterBar';
import { SearchFilter } from '../../components/ui/filters/SearchFilter';
import { SelectFilter } from '../../components/ui/filters/SelectFilter';
import { DateRangeFilter } from '../../components/ui/filters/DateRangeFilter';
import { useListFilters } from '../../hooks/useListFilters';
import { validarPeriodo } from '../../utils/validarPeriodo';

const FILTROS_PADRAO = {
    nomeRevendedora: '',
    dataInicio: '',
    dataFim: '',
    ordem: 'desc'
};

const OPCOES_ORDEM = [
    { value: 'desc', label: 'Mais recentes' },
    { value: 'asc', label: 'Mais antigas' }
];

export function Maletas() {
    const [consulta, setConsulta] = useState({ chave: null, itens: [], totalPaginas: 1 });
    const { valores, pagina, setFilter, setPagina, limpar, temFiltrosAtivos } = useListFilters(FILTROS_PADRAO);
    const navigate = useNavigate();

    const periodo = validarPeriodo(valores);
    const chaveConsulta = JSON.stringify({ ...valores, pagina });
    const carregando = periodo.valido && consulta.chave !== chaveConsulta;
    const { itens: data, totalPaginas } = consulta;

    useEffect(() => {
        if (!periodo.valido) {
            return;
        }

        const controller = new AbortController();
        const { ordem, ...filtros } = valores;

        vendaApi.buscarMaletas(
            { ...filtros, page: pagina - 1, sort: `data,${ordem}` },
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
    }, [valores, pagina, periodo.valido, chaveConsulta]);

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
                <FilterBar ariaLabel="Filtros de maletas" temFiltrosAtivos={temFiltrosAtivos} onLimpar={limpar}>
                    <SearchFilter
                        rotulo="Buscar revendedora"
                        placeholder="Buscar revendedora pelo nome"
                        valor={valores.nomeRevendedora}
                        onChange={(valor) => setFilter('nomeRevendedora', valor)}
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
                    <div className={style['empty-state']}>Carregando maletas...</div>
                ) : data.length > 0 ? (
                    <Table colunas={colunas} funcaoRender={funcaoRender} data={data}
                        onRowClick={(row) => navigate(`/joias/maletas/${row.idMovimentacaoRevendedora}`)} />
                ) : (
                    <div className={style['empty-state']}>Não há Maletas</div>
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
