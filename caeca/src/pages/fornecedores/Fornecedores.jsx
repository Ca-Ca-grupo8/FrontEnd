import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../../components/ui/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { BotaoAdicionar } from '../../components/ui/BotaoAdicionar';
import { Pagination } from '../../components/ui/Pagination';
import { FilterBar } from '../../components/ui/filters/FilterBar';
import { SearchFilter } from '../../components/ui/filters/SearchFilter';
import { SelectFilter } from '../../components/ui/filters/SelectFilter';
import { fornecedorApi } from '../../service/fornecedorApi';
import { emitirToast } from '../../utils/toastBus';
import { usuarioEhAdmin } from '../../utils/perfil';
import { useListFilters } from '../../hooks/useListFilters';
import style from './Fornecedores.module.css';
import listStyle from '../../styles/ListPage.module.css';

const colunas = [
    'NOME',
    'INSTAGRAM',
    'TELEFONE',
    'STATUS'
];

const POR_PAGINA = 10;

const FILTROS_PADRAO = {
    busca: '',
    atividade: ''
};

const OPCOES_ATIVIDADE = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Ativo' },
    { value: 'false', label: 'Inativo' }
];

export function Fornecedores() {
    const navigate = useNavigate();
    const [fornecedores, setFornecedores] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [versaoLista, setVersaoLista] = useState(0);
    const { valores, pagina, setFilter, setPagina, limpar, temFiltrosAtivos } = useListFilters(FILTROS_PADRAO);

    useEffect(() => {
        let ignore = false;

        fornecedorApi.listarFornecedores()
            .then((lista) => {
                if (!ignore) setFornecedores(lista);
            })
            .catch(() => {
                // erro exibido pelo interceptor global
            })
            .finally(() => {
                if (!ignore) setCarregando(false);
            });

        return () => { ignore = true; };
    }, [versaoLista]);

    // listarFornecedores já traz a lista inteira (fetchAllPages), então
    // busca, filtro e paginação são resolvidos aqui no front.
    const filtrados = useMemo(() => {
        const termo = valores.busca.trim().toLowerCase();

        return fornecedores.filter((fornecedor) => {
            const casaComBusca =
                !termo || fornecedor.nome?.toLowerCase().includes(termo);
            const casaComAtividade =
                !valores.atividade || String(fornecedor.isAtivo) === valores.atividade;

            return casaComBusca && casaComAtividade;
        });
    }, [fornecedores, valores]);

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
    const paginaEfetiva = Math.min(pagina, totalPaginas);

    const fornecedoresDaPagina = useMemo(() => {
        const inicio = (paginaEfetiva - 1) * POR_PAGINA;
        return filtrados.slice(inicio, inicio + POR_PAGINA);
    }, [filtrados, paginaEfetiva]);

    const inativarFornecedor = async (fornecedor) => {
        const confirmar = window.confirm(
            `Deseja inativar o fornecedor "${fornecedor.nome}"? Ele deixará de aparecer nas listas de seleção.`
        );
        if (!confirmar) return;

        try {
            await fornecedorApi.alterarStatus(fornecedor.id, false);
            emitirToast({ message: `Fornecedor "${fornecedor.nome}" inativado.`, type: 'success' });
            setVersaoLista((versao) => versao + 1);
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
                case 'STATUS':
                    return (
                        <span className={`${style.badge} ${row.isAtivo ? style.badgeActive : style.badgeInactive}`}>
                            {row.isAtivo ? 'Ativo' : 'Inativo'}
                        </span>
                    );
                default:
                    return null;
            }
        }
    };

    return (
        <>
            <PageHeader titulo="Fornecedores" subtitulo="Gerencie seus parceiros de fornecimento">
                {usuarioEhAdmin() && (
                    <BotaoAdicionar rotulo="Adicionar Fornecedor" onClick={() => navigate('/contribuintes?tipo=fornecedor')} />
                )}
            </PageHeader>
            <div className={listStyle.pageContainer}>
                <FilterBar ariaLabel="Filtros de fornecedores" temFiltrosAtivos={temFiltrosAtivos} onLimpar={limpar}>
                    <SearchFilter
                        rotulo="Pesquisar fornecedor"
                        placeholder="Pesquisar fornecedor"
                        valor={valores.busca}
                        onChange={(valor) => setFilter('busca', valor)}
                    />
                    <SelectFilter
                        rotulo="Atividade"
                        valor={valores.atividade}
                        onChange={(valor) => setFilter('atividade', valor)}
                        opcoes={OPCOES_ATIVIDADE}
                    />
                </FilterBar>

                {carregando ? (
                    <div className={style.emptyState}>Carregando fornecedores...</div>
                ) : fornecedoresDaPagina.length > 0 ? (
                    <Table
                        colunas={colunas}
                        funcaoRender={funcaoRender}
                        data={fornecedoresDaPagina}
                        onRowClick={(row) => navigate(`/contribuintes/fornecedores/${row.id}`)}
                    />
                ) : (
                    <div className={style.emptyState}>
                        Nenhum fornecedor encontrado
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
