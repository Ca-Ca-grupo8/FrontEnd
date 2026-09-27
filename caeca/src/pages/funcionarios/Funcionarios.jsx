import { useCallback, useEffect, useState } from 'react';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Toast } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { funcionarioApi } from '../../service/funcionarioApi';
import { NovoFuncionarioModal } from '../../components/modals/NovoFuncionario';
import { Search, Pencil, Trash2 } from 'lucide-react';
import style from './Funcionarios.module.css';

const colunas = [
    'NOME',
    'CARGO',
    'ATIVIDADE',
    'STATUS'
];

export function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [busca, setBusca] = useState('');
    const [filtroAtividade, setFiltroAtividade] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [toast, setToast] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    const carregarFuncionarios = useCallback(async () => {
        try {
            const params = {
                page: paginaAtual - 1,
                sort: 'nome,asc',
            };
            if (busca.trim()) params.nome = busca.trim();
            if (filtroAtividade) params.is_ativo = filtroAtividade === 'true';

            const resultado = await funcionarioApi.listarFuncionarios(params);

            if (Array.isArray(resultado)) {
                setFuncionarios(resultado);
                setTotalPaginas(1);
            } else {
                setFuncionarios(resultado.content ?? []);
                setTotalPaginas(resultado.totalPages ?? 1);
            }
        } catch {
            setToast({ message: 'Não foi possível carregar os funcionários.' });
        }
    }, [paginaAtual, busca, filtroAtividade]);

    useEffect(() => {
        const buscarFuncionarios = async () => {
            try {
                const params = {
                    page: paginaAtual - 1,
                    sort: 'nome,asc',
                };
                if (busca.trim()) params.nome = busca.trim();
                if (filtroAtividade) params.is_ativo = filtroAtividade === 'true';

                const resultado = await funcionarioApi.listarFuncionarios(params);

                if (Array.isArray(resultado)) {
                    setFuncionarios(resultado);
                    setTotalPaginas(1);
                } else {
                    setFuncionarios(resultado.content ?? []);
                    setTotalPaginas(resultado.totalPages ?? 1);
                }
            } catch {
                setToast({ message: 'Não foi possível carregar os funcionários.' });
            }
        };

        buscarFuncionarios();
    }, [paginaAtual, busca, filtroAtividade]);

    const buscar = () => {
        setPaginaAtual(1);
    };

    const alterarPagina = (pagina) => {
        setPaginaAtual(pagina);
    };

    const inativarFuncionario = async (funcionario) => {
        const confirmar = window.confirm(
            `Deseja inativar o funcionário "${funcionario.nome}"? Ele deixará de aparecer nas listas de seleção.`
        );
        if (!confirmar) return;

        try {
            await funcionarioApi.alterarStatus(funcionario.id, false);
            setToast({ message: `Funcionário "${funcionario.nome}" inativado.` });
            carregarFuncionarios();
        } catch {
            setToast({ message: 'Não foi possível inativar o funcionário.' });
        }
    };

    const fecharToast = useCallback(() => setToast(null), []);

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
                case 'CARGO':
                    return row.cargo || '-';
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
                                title="Editar funcionário"
                                aria-label={`Editar ${row.nome}`}
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                className={`${style.actionIcon} ${style.deleteIcon}`}
                                title="Inativar funcionário"
                                aria-label={`Inativar ${row.nome}`}
                                onClick={() => inativarFuncionario(row)}
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
            {toast && <Toast message={toast.message} onClose={fecharToast} />}
            <PageHeader titulo="Funcionários" subtitulo="Gerencie a equipe da sua loja">
                <Button colorido={true} onClick={() => setModalAberto(true)}>
                    Adicionar Funcionário
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
                            placeholder="Pesquisar funcionário"
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

                {funcionarios.length > 0 ? (
                    <Table colunas={colunas} funcaoRender={funcaoRender} data={funcionarios} />
                ) : (
                    <div className={style.emptyState}>
                        Nenhum funcionário encontrado
                    </div>
                )}

                <Pagination
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    aoMudarPagina={alterarPagina}
                />
            </div>

            <NovoFuncionarioModal
                isOpen={modalAberto}
                onClose={() => {
                    setModalAberto(false);
                    carregarFuncionarios();
                }}
            />
        </>
    );
}
