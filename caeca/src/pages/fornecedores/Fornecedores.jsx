import { useCallback, useEffect, useMemo, useState } from 'react';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { fornecedorApi } from '../../service/fornecedorApi';
import { NovoFornecedorModal } from '../../components/modals/NovoFornecedor';
import { emitirToast } from '../../utils/toastBus';
import { Search, Pencil, Trash2 } from 'lucide-react';
import style from './Fornecedores.module.css';

const colunas = [
    'NOME',
    'INSTAGRAM',
    'TELEFONE',
    'ATIVIDADE',
    'STATUS'
];

const POR_PAGINA = 10;

export function Fornecedores() {
    const [fornecedores, setFornecedores] = useState([]);
    const [busca, setBusca] = useState('');
    const [filtroAtividade, setFiltroAtividade] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [modalAberto, setModalAberto] = useState(false);

    const carregarFornecedores = useCallback(async () => {
        try {
            setFornecedores(await fornecedorApi.listarFornecedores());
        } catch {
            // erro exibido pelo interceptor global
        }
    }, []);

    useEffect(() => {
        const buscarFornecedores = async () => {
            try {
                setFornecedores(await fornecedorApi.listarFornecedores());
            } catch {
                // erro exibido pelo interceptor global
            }
        };

        buscarFornecedores();
    }, []);

    // listarFornecedores já traz a lista inteira (fetchAllPages), então
    // busca, filtro e paginação são resolvidos aqui no front.
    const filtrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        return fornecedores.filter((fornecedor) => {
            const casaComBusca =
                !termo || fornecedor.nome?.toLowerCase().includes(termo);
            const casaComAtividade =
                !filtroAtividade || String(fornecedor.isAtivo) === filtroAtividade;

            return casaComBusca && casaComAtividade;
        });
    }, [fornecedores, busca, filtroAtividade]);

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));

    const fornecedoresDaPagina = useMemo(() => {
        const inicio = (paginaAtual - 1) * POR_PAGINA;
        return filtrados.slice(inicio, inicio + POR_PAGINA);
    }, [filtrados, paginaAtual]);

    const buscar = () => {
        setPaginaAtual(1);
    };

    const alterarPagina = (pagina) => {
        setPaginaAtual(pagina);
    };

    const inativarFornecedor = async (fornecedor) => {
        const confirmar = window.confirm(
            `Deseja inativar o fornecedor "${fornecedor.nome}"? Ele deixará de aparecer nas listas de seleção.`
        );
        if (!confirmar) return;

        try {
            await fornecedorApi.alterarStatus(fornecedor.id, false);
            emitirToast({ message: `Fornecedor "${fornecedor.nome}" inativado.`, type: 'success' });
            carregarFornecedores();
        } catch {
            // erro exibido pelo interceptor global
        }
    };

    const formatarData = (data) => {
        if (!data) return '-';
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(new Date(data));
    };

    const funcaoRender = {
        render: (row, coluna) => {
            switch (coluna) {
                case 'NOME':
                    return (
                        <div className={style.nameCell}>
                            <span className={style.name}>{row.nome || '-'}</span>
                            <span className={style.date}>{formatarData(row.dataCadastro)}</span>
                        </div>
                    );
                case 'INSTAGRAM':
                    return row.instagram || '-';
                case 'TELEFONE':
                    return row.telefone || '-';
                case 'ATIVIDADE':
                    return (
                        <span className={`${style.badge} ${row.isAtivo ? style.badgeActive : style.badgeInactive}`}>
                            {row.isAtivo ? 'Ativo' : 'Inativo'}
                        </span>
                    );
                case 'STATUS':
                    return (
                        <div className={style.actionsCell}>
                            <button
                                className={`${style.actionIcon} ${style.editIcon}`}
                                title="Editar fornecedor"
                                aria-label={`Editar ${row.nome}`}
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                className={`${style.actionIcon} ${style.deleteIcon}`}
                                title="Inativar fornecedor"
                                aria-label={`Inativar ${row.nome}`}
                                onClick={() => inativarFornecedor(row)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                default:
                    return null;
            }
        }
    };

    return (
        <>
            <PageHeader titulo="Fornecedores" subtitulo="Gerencie seus parceiros de fornecimento">
                <Button colorido={true} onClick={() => setModalAberto(true)}>
                    Adicionar Fornecedor
                </Button>
            </PageHeader>
            <div className={style.pageContainer}>
                <div className={style.toolbar}>
                    <div className={style.searchInputWrapper}>
                        <span className={style.searchIcon}>
                            <Search size={16} />
                        </span>
                        <input
                            type="text"
                            placeholder="Pesquisar fornecedor"
                            className={style.searchInput}
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') buscar();
                            }}
                        />
                    </div>

                    <div className={style.filterButtons}>
                        <label className={style.typeFilter}>
                            <span>Atividade</span>
                            <select
                                value={filtroAtividade}
                                onChange={(e) => {
                                    setFiltroAtividade(e.target.value);
                                    setPaginaAtual(1);
                                }}
                            >
                                <option value="">Todos</option>
                                <option value="true">Ativo</option>
                                <option value="false">Inativo</option>
                            </select>
                        </label>
                        <Button colorido={true} onClick={buscar}>
                            Buscar
                        </Button>
                    </div>
                </div>

                {fornecedoresDaPagina.length > 0 ? (
                    <Table colunas={colunas} funcaoRender={funcaoRender} data={fornecedoresDaPagina} />
                ) : (
                    <div className={style.emptyState}>
                        Nenhum fornecedor encontrado
                    </div>
                )}

                <Pagination
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    aoMudarPagina={alterarPagina}
                />
            </div>

            <NovoFornecedorModal
                isOpen={modalAberto}
                onClose={() => {
                    setModalAberto(false);
                    carregarFornecedores();
                }}
            />
        </>
    );
}
