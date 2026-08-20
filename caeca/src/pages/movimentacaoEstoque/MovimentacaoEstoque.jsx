import { useState, useEffect, useCallback } from 'react';
import style from './MovimentacaoEstoque.module.css';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { movimentacaoApi } from '../../service/movimentacaoApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';
import { TIPO_MOVIMENTACAO } from '../../utils/tipoMovimentacaoEnum';
import { Toast } from '../../components/ui/Toast';

export function MovimentacaoEstoque() {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        tipo: TIPO_MOVIMENTACAO.TODOS,
        nome: '',
        dataInicio: '',
        dataFim: ''
    });
    const [appliedFilters, setAppliedFilters] = useState(filters);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const movimentacoes = await movimentacaoApi.buscarMovimentacoes(appliedFilters);
                setData(movimentacoes);
            } catch {
                setToast({ message: 'Não foi possível carregar as movimentações.' });
            }
        };

        fetchData();
    }, [appliedFilters]);

    const atualizarFiltro = (campo, valor) => {
        setFilters((filtrosAtuais) => ({ ...filtrosAtuais, [campo]: valor }));
    };

    const fecharToast = useCallback(() => setToast(null), []);

    const validarPeriodo = (filtros) => {
        const apenasUmaDataPreenchida = Boolean(filtros.dataInicio) !== Boolean(filtros.dataFim);
        const periodoInvalido = filtros.dataInicio && filtros.dataFim && filtros.dataInicio > filtros.dataFim;

        if (periodoInvalido) {
            setToast({ message: 'A data de início não pode ser maior que a data de fim.' });
        } else {
            setToast(null);
        }

        return !apenasUmaDataPreenchida && !periodoInvalido;
    };

    const atualizarData = (campo, valor) => {
        const novosFiltros = { ...filters, [campo]: valor };
        atualizarFiltro(campo, valor);
        validarPeriodo(novosFiltros);
    };

    const periodoValido =
        Boolean(filters.dataInicio) === Boolean(filters.dataFim) &&
        (!filters.dataInicio || filters.dataInicio <= filters.dataFim);

    const buscarMovimentacoes = () => {
        if (!periodoValido) {
            return;
        }

        setAppliedFilters({ ...filters });
    };

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
                            <span className={style['product-title']}>{row.joia.nome}</span>
                        </div>
                    );

                case 'TIPO': {
                    const isEntry = row.motivoMovimentacao.tipoMovimentacao.nome === 'ENTRADA';
                    const badgeTypeClass = isEntry ? style['badge-entry'] : style['badge-exit'];

                    return (
                        <span className={`${style.badge} ${badgeTypeClass}`}>
                            {row.motivoMovimentacao.tipoMovimentacao.nome}
                        </span>
                    );
                }

                case 'QUANTIDADE': {
                    const isEntry = row.motivoMovimentacao.tipoMovimentacao.nome === 'ENTRADA';

                    const quantityClass = isEntry ? style['qty-positive'] : style['qty-negative'];
                    return (
                        <span className={`${style.quantity} ${quantityClass}`}>
                            {isEntry ? `+ ${row.quantidade}` : `- ${Math.abs(row.quantidade)}`}
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
            {toast && <Toast message={toast.message} onClose={fecharToast} />}
            <PageHeader
                titulo="Movimentações de Estoque"
                subtitulo="Ver movimentações de revendedoras"
                dashed={true}
                onClick={() => {navigate('/historico/movimentacoes/revendedoras')}} />
            <div className={style['page-container']}>
                <div className={style['toolbar']}>
                    <div className={style['search-input-wrapper']}>
                        <span className={style['search-icon']}>🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar joia pelo nome"
                            className={style['search-input']}
                            value={filters.nome}
                            onChange={(event) => atualizarFiltro('nome', event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    buscarMovimentacoes();
                                }
                            }}
                        />
                    </div>

                    <div className={style['filter-buttons']}>
                        <label className={style['type-filter']}>
                            <span>Tipo</span>
                            <select
                                value={filters.tipo}
                                onChange={(event) => atualizarFiltro('tipo', event.target.value)}
                            >
                                <option value={TIPO_MOVIMENTACAO.TODOS}>Todos</option>
                                <option value={TIPO_MOVIMENTACAO.ENTRADA}>Entradas</option>
                                <option value={TIPO_MOVIMENTACAO.SAIDA}>Saídas</option>
                                <option value={TIPO_MOVIMENTACAO.REENTRADA}>Reentradas</option>
                            </select>
                        </label>
                        <label className={style['date-filter']}>
                            <span>De</span>
                            <input type="date" value={filters.dataInicio} onChange={(event) => atualizarData('dataInicio', event.target.value)} />
                        </label>
                        <label className={style['date-filter']}>
                            <span>Até</span>
                            <input type="date" value={filters.dataFim} onChange={(event) => atualizarData('dataFim', event.target.value)} />
                        </label>
                        <Button children={"Buscar"} colorido={true} disabled={!periodoValido} onClick={buscarMovimentacoes} />
                    </div>
                </div>

                {data.length > 0 ? (
                    <Table colunas={colunas} funcaoRender={funcaoRender} data={data} />
                ) : (
                    <div className={style['empty-state']}>
                        Não há movimentações
                    </div>
                )}

            </div>
        </>
    );
}