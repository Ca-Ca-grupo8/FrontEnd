import { useState, useEffect } from 'react';
import style from './MovimentacaoEstoque.module.css';
import listStyle from '../../styles/ListPage.module.css';
import { Table } from '../../components/ui/Table';
import { movimentacaoApi } from '../../service/movimentacaoApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';
import { BotaoAdicionar } from '../../components/ui/BotaoAdicionar';
import { TIPO_MOVIMENTACAO } from '../../utils/tipoMovimentacaoEnum';
import { Pagination } from '../../components/ui/Pagination';
import { FilterBar } from '../../components/ui/filters/FilterBar';
import { SearchFilter } from '../../components/ui/filters/SearchFilter';
import { SelectFilter } from '../../components/ui/filters/SelectFilter';
import { DateRangeFilter } from '../../components/ui/filters/DateRangeFilter';
import { useListFilters } from '../../hooks/useListFilters';
import { validarPeriodo } from '../../utils/validarPeriodo';

const FILTROS_PADRAO = {
    tipo: TIPO_MOVIMENTACAO.TODOS,
    nome: '',
    dataInicio: '',
    dataFim: '',
    ordem: 'desc'
};

const OPCOES_TIPO = [
    { value: TIPO_MOVIMENTACAO.TODOS, label: 'Todos' },
    { value: TIPO_MOVIMENTACAO.ENTRADA, label: 'Entradas' },
    { value: TIPO_MOVIMENTACAO.SAIDA, label: 'Saídas' },
    { value: TIPO_MOVIMENTACAO.REENTRADA, label: 'Reentradas' }
];

const OPCOES_ORDEM = [
    { value: 'desc', label: 'Mais recentes' },
    { value: 'asc', label: 'Mais antigas' }
];

export function MovimentacaoEstoque() {
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

        movimentacaoApi.buscarMovimentacoes(
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

    const colunas = ["DATA", "PRODUTO", "TIPO", "QUANTIDADE"];

    const funcaoRender =
    {
        render: (row, col) => {
            switch (col) {
                case 'DATA': {
                    const data = new Date(row.data);
                    const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).format(data);
                    return <span>{dataFormatada}</span>;
                }

                case 'PRODUTO':
                    return (
                        <div className={style['product-cell']}>
                            {row.joia.arquivo ? (
                                <img src={row.joia.arquivo.url} alt={row.joia.nome} className={style['product-thumb']} />
                            ) : (
                                <div className={style['product-thumb-placeholder']}>[FOTO]</div>
                            )}
                            <span className={style['product-title']} onClick={() => navigate(`/joias/${row.joia.id}`)}>{row.joia.nome}</span>
                        </div>
                    );

                case 'TIPO': {
                    const tipo = row.motivoMovimentacao.tipoMovimentacao.nome;
                    const badgeTypeClass = tipo === 'ENTRADA'
                        ? style['badge-entry']
                        : tipo === 'REENTRADA'
                            ? style['badge-reentrada']
                            : style['badge-exit'];

                    return (
                        <span className={`${style.badge} ${badgeTypeClass}`}>
                            {tipo}
                        </span>
                    );
                }

                case 'QUANTIDADE': {
                    const isEntry = row.motivoMovimentacao.tipoMovimentacao.nome === 'ENTRADA';

                    const quantityClass = isEntry ? style['qty-positive'] : style['qty-negative'];
                    return (
                        <span className={`${style.quantity} ${quantityClass}`}>
                            {row.quantidade ? row.quantidade : '-'}
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
            <PageHeader
                titulo="Movimentações de Estoque"
                subtitulo="Ver histórico de movimentações das maletas"
                dashed={true}
                onClick={() => {navigate('/joias/maletas')}}>
                <BotaoAdicionar rotulo="Adicionar movimentação" onClick={() => navigate('/movimentacoes')} />
            </PageHeader>
            <div className={listStyle.pageContainer}>
                <FilterBar ariaLabel="Filtros de movimentações" temFiltrosAtivos={temFiltrosAtivos} onLimpar={limpar}>
                    <SearchFilter
                        rotulo="Buscar joia"
                        placeholder="Buscar joia pelo nome"
                        valor={valores.nome}
                        onChange={(valor) => setFilter('nome', valor)}
                    />
                    <SelectFilter
                        rotulo="Tipo"
                        valor={valores.tipo}
                        onChange={(valor) => setFilter('tipo', valor)}
                        opcoes={OPCOES_TIPO}
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
                    <div className={style['empty-state']}>Carregando movimentações...</div>
                ) : data.length > 0 ? (
                    <Table colunas={colunas} funcaoRender={funcaoRender} data={data} />
                ) : (
                    <div className={style['empty-state']}>
                        Não há movimentações
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
