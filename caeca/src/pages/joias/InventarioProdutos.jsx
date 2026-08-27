import { useCallback, useEffect, useMemo, useState } from 'react';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Toast } from '../../components/ui/Toast';
import { joiaApi } from '../../service/joiaApi';
import style from './InventarioProdutos.module.css';

const colunas = [
    'PRODUTOS',
    'QUANTIDADE',
    'CATEGORIA',
    'PRECO UNITARIO',
    'ULTIMA MODIFICACAO',
    'STATUS'
];

export function InventarioProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [nomeBusca, setNomeBusca] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const carregarProdutos = async () => {
            try {
                const produtosEncontrados = await joiaApi.listarJoias();
                setProdutos(produtosEncontrados);
            } catch {
                setToast({ message: 'Não foi possível carregar os produtos.' });
            }
        };

        carregarProdutos();
    }, []);

    const fecharToast = useCallback(() => setToast(null), []);

    const produtosFiltrados = useMemo(() => {
        const busca = nomeBusca.trim().toLocaleLowerCase();

        if (!busca) {
            return produtos;
        }

        return produtos.filter((produto) => produto.nome?.toLocaleLowerCase().includes(busca));
    }, [nomeBusca, produtos]);

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
                            <span className={style['product-title']}>{row.nome || '-'}</span>
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
                            value={nomeBusca}
                            onChange={(event) => setNomeBusca(event.target.value)}
                        />
                    </div>
                </div>

                {produtosFiltrados.length > 0 ? (
                    <Table colunas={colunas} funcaoRender={funcaoRender} data={produtosFiltrados} />
                ) : (
                    <div className={style['empty-state']}>
                        Não há produtos para exibir
                    </div>
                )}
            </div>
        </>
    );
}
