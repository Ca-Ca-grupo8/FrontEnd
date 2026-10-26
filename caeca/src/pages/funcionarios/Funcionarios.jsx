import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Pagination } from '../../components/ui/Pagination';
import { FilterBar } from '../../components/ui/filters/FilterBar';
import { SearchFilter } from '../../components/ui/filters/SearchFilter';
import { SelectFilter } from '../../components/ui/filters/SelectFilter';
import { BotaoAdicionar } from '../../components/ui/BotaoAdicionar';
import { usuarioApi } from '../../service/usuarioApi';
import { useListFilters } from '../../hooks/useListFilters';
import style from './Funcionarios.module.css';
import listStyle from '../../styles/ListPage.module.css';

const colunas = [
    'NOME',
    'EMAIL',
    'PERFIL'
];

const POR_PAGINA = 10;

const PERFIS = {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_USER: 'ROLE_USER'
};

const FILTROS_PADRAO = {
    busca: '',
    perfil: ''
};

const OPCOES_PERFIL = [
    { value: '', label: 'Todos' },
    { value: PERFIS.ROLE_ADMIN, label: 'Administrador' },
    { value: PERFIS.ROLE_USER, label: 'Funcionário' }
];

export function Funcionarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const { valores, pagina, setFilter, setPagina, limpar, temFiltrosAtivos } = useListFilters(FILTROS_PADRAO);

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
    // busca, perfil e paginação são resolvidos aqui, a partir da lista em memória.
    const usuariosFiltrados = useMemo(() => {
        const termo = valores.busca.trim().toLowerCase();

        return usuarios.filter((usuario) => {
            const casaComBusca =
                !termo ||
                usuario.nome?.toLowerCase().includes(termo) ||
                usuario.email?.toLowerCase().includes(termo);

            const casaComPerfil = !valores.perfil || usuario.role === valores.perfil;

            return casaComBusca && casaComPerfil;
        });
    }, [usuarios, valores]);

    const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / POR_PAGINA));
    const paginaEfetiva = Math.min(pagina, totalPaginas);

    const usuariosDaPagina = useMemo(() => {
        const inicio = (paginaEfetiva - 1) * POR_PAGINA;
        return usuariosFiltrados.slice(inicio, inicio + POR_PAGINA);
    }, [usuariosFiltrados, paginaEfetiva]);

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
                <BotaoAdicionar rotulo="Adicionar Funcionário" onClick={() => navigate('/contribuintes?tipo=funcionario')} />
            </PageHeader>
            <div className={listStyle.pageContainer}>
                <FilterBar ariaLabel="Filtros de funcionários" temFiltrosAtivos={temFiltrosAtivos} onLimpar={limpar}>
                    <SearchFilter
                        rotulo="Pesquisar funcionário"
                        placeholder="Pesquisar por nome ou email"
                        valor={valores.busca}
                        onChange={(valor) => setFilter('busca', valor)}
                    />
                    <SelectFilter
                        rotulo="Perfil"
                        valor={valores.perfil}
                        onChange={(valor) => setFilter('perfil', valor)}
                        opcoes={OPCOES_PERFIL}
                    />
                </FilterBar>

                {carregando ? (
                    <div className={style.emptyState}>Carregando funcionários...</div>
                ) : usuariosDaPagina.length > 0 ? (
                    <Table
                        colunas={colunas}
                        funcaoRender={funcaoRender}
                        data={usuariosDaPagina}
                        onRowClick={(row) => navigate(`/contribuintes/funcionarios/${row.id ?? row.idUsuario}`)}
                    />
                ) : (
                    <div className={style.emptyState}>
                        {usuarios.length === 0
                            ? 'Nenhum funcionário cadastrado'
                            : 'Nenhum funcionário encontrado'}
                    </div>
                )}

                <Pagination
                    paginaAtual={paginaEfetiva}
                    totalPaginas={totalPaginas}
                    aoMudarPagina={setPagina}
                />
            </div>
        </>
    );
}
