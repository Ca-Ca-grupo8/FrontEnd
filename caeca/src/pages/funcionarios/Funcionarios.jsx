import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { usuarioApi } from '../../service/usuarioApi';
import { NovoFuncionarioModal } from '../../components/modals/NovoFuncionario';
import { Search } from 'lucide-react';
import style from './Funcionarios.module.css';

const colunas = [
    'NOME',
    'EMAIL',
    'PERFIL'
];

const PERFIS = {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_USER: 'ROLE_USER'
};

export function Funcionarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtroPerfil, setFiltroPerfil] = useState('');
    const [modalAberto, setModalAberto] = useState(false);

    const carregarUsuarios = useCallback(async () => {
        setCarregando(true);
        try {
            setUsuarios(await usuarioApi.listarUsuarios());
        } catch {
            // erro exibido pelo interceptor global
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        const buscarUsuarios = async () => {
            setCarregando(true);
            try {
                setUsuarios(await usuarioApi.listarUsuarios());
            } catch {
                // erro exibido pelo interceptor global
            } finally {
                setCarregando(false);
            }
        };

        buscarUsuarios();
    }, []);

    // O endpoint devolve a lista inteira, sem filtro no servidor — então
    // busca e perfil são resolvidos aqui, a partir da lista em memória.
    const usuariosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        return usuarios.filter((usuario) => {
            const casaComBusca =
                !termo ||
                usuario.nome?.toLowerCase().includes(termo) ||
                usuario.email?.toLowerCase().includes(termo);

            const casaComPerfil = !filtroPerfil || usuario.role === filtroPerfil;

            return casaComBusca && casaComPerfil;
        });
    }, [usuarios, busca, filtroPerfil]);

    const rotuloDoPerfil = (role) => {
        if (role === PERFIS.ROLE_ADMIN) {
            return { texto: 'Administrador', classe: style.perfilAdmin };
        }
        return { texto: 'Funcionário', classe: style.perfilUser };
    };

    const funcaoRender = {
        render: (row, coluna) => {
            switch (coluna) {
                case 'NOME':
                    return <span className={style.nome}>{row.nome || '-'}</span>;
                case 'EMAIL':
                    return row.email || '-';
                case 'PERFIL': {
                    const perfil = rotuloDoPerfil(row.role);
                    return <span className={`${style.perfil} ${perfil.classe}`}>{perfil.texto}</span>;
                }
                default:
                    return null;
            }
        }
    };

    return (
        <>
            <PageHeader titulo="Funcionários" subtitulo="Gerencie a equipe e os acessos do sistema">
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
                            placeholder="Pesquisar por nome ou email"
                            className={style.searchInput}
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                    </div>

                    <div className={style.filterButtons}>
                        <label className={style.typeFilter}>
                            <span>Perfil</span>
                            <select
                                value={filtroPerfil}
                                onChange={(e) => setFiltroPerfil(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value={PERFIS.ROLE_ADMIN}>Administrador</option>
                                <option value={PERFIS.ROLE_USER}>Funcionário</option>
                            </select>
                        </label>
                    </div>
                </div>

                {carregando ? (
                    <div className={style.emptyState}>Carregando funcionários...</div>
                ) : usuariosFiltrados.length > 0 ? (
                    <Table
                        colunas={colunas}
                        funcaoRender={funcaoRender}
                        data={usuariosFiltrados}
                        onRowClick={(row) => navigate(`/contribuintes/funcionarios/${row.id ?? row.idUsuario}`)}
                    />
                ) : (
                    <div className={style.emptyState}>
                        {usuarios.length === 0
                            ? 'Nenhum funcionário cadastrado'
                            : 'Nenhum funcionário encontrado'}
                    </div>
                )}
            </div>

            <NovoFuncionarioModal
                isOpen={modalAberto}
                onClose={() => {
                    setModalAberto(false);
                    carregarUsuarios();
                }}
            />
        </>
    );
}