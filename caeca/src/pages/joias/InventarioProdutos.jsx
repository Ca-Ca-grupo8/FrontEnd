import { useCallback, useEffect, useState } from 'react';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Toast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { joiaApi } from '../../service/joiaApi';
import { categoriaApi } from '../../service/categoriaApi';
import { materialApi } from '../../service/materialApi';
import { banhoApi } from '../../service/banhoApi';
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

const STATUS_JOIA = {
    OK: 'OK',
    INATIVO: 'INATIVO',
    CRITICO: 'CRITICO',
    ALERTA: 'ALERTA'
};

export function InventarioProdutos() {
    const navigate = useNavigate()
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [banhos, setBanhos] = useState([]);
    const [filters, setFilters] = useState({
        nome: '',
        categoria: '',
        material: '',
        banho: '',
        joiaStatus: '',
        dataInicio: '',
        dataFim: ''
    });
    const [appliedFilters, setAppliedFilters] = useState(filters);
    const [toast, setToast] = useState(null);

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
                setToast({ message: 'Não foi possível carregar as opções de filtro.' });
            }
        };

        carregarOpcoes();
    }, []);

    useEffect(() => {
        const carregarProdutos = async () => {
            try {
                const produtosEncontrados = await joiaApi.listarJoias(appliedFilters);
                setProdutos(produtosEncontrados);
            } catch {
                setToast({ message: 'Não foi possível carregar os produtos.' });
            }
        };

        carregarProdutos();
    }, [appliedFilters]);

    const fecharToast = useCallback(() => setToast(null), []);

    const atualizarFiltro = (campo, valor) => {
        setFilters((filtrosAtuais) => ({ ...filtrosAtuais, [campo]: valor }));
    };

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

    const buscarProdutos = () => {
        if (!periodoValido) {
            return;
        }

        setAppliedFilters({ ...filters });
    };

    const optionsFiltro = (itens) => (itens || []).map((item) => (
        <option key={item.id} value={item.id}>{item.nome}</option>
    ));

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
                            <span className={style['product-title']} onClick={() => navigate(`/joias/${row.id}`)}>{row.nome || '-'}</span>
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
            {toast && <Toast message={toast.message} onClose={fecharToast} />}
            <PageHeader titulo="Inventário de produtos" subtitulo="Visualize o inventário de produtos" />
            <div className={style['page-container']}>
                <div className={style.toolbar}>
                    <div className={style['search-input-wrapper']}>
                        <span className={style['search-icon']} aria-hidden="true">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar produto pelo nome"
                            className={style['search-input']}
                            value={filters.nome}
                            onChange={(event) => atualizarFiltro('nome', event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    buscarProdutos();
                                }
                            }}
                        />
                    </div>

                    <div className={style['filter-buttons']}>
                        <label className={style['type-filter']}>
                            <span>Categoria</span>
                            <select
                                value={filters.categoria}
                                onChange={(event) => atualizarFiltro('categoria', event.target.value)}
                            >
                                <option value="">Todos</option>
                                {optionsFiltro(categorias)}
                            </select>
                        </label>
                        <label className={style['type-filter']}>
                            <span>Material</span>
                            <select
                                value={filters.material}
                                onChange={(event) => atualizarFiltro('material', event.target.value)}
                            >
                                <option value="">Todos</option>
                                {optionsFiltro(materiais)}
                            </select>
                        </label>
                        <label className={style['type-filter']}>
                            <span>Banho</span>
                            <select
                                value={filters.banho}
                                onChange={(event) => atualizarFiltro('banho', event.target.value)}
                            >
                                <option value="">Todos</option>
                                {optionsFiltro(banhos)}
                            </select>
                        </label>
                        <label className={style['type-filter']}>
                            <span>Status</span>
                            <select
                                value={filters.joiaStatus}
                                onChange={(event) => atualizarFiltro('joiaStatus', event.target.value)}
                            >
                                <option value="">Todos</option>
                                {Object.values(STATUS_JOIA).map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
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
                        <Button className={style['btn-buscar']} children={"Buscar"} colorido={true} disabled={!periodoValido} onClick={buscarProdutos} />
                    </div>
                </div>

                {produtos.length > 0 ? (
                    <Table colunas={colunas} funcaoRender={funcaoRender} data={produtos} />
                ) : (
                    <div className={style['empty-state']}>
                        Não há produtos para exibir
                    </div>
                )}
            </div>
        </>
    );
}