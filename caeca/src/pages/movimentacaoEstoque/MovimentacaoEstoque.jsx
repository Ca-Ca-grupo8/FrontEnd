import React, { useMemo, useState, useEffect } from 'react';
import style from './MovimentacaoEstoque.module.css';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { movimentacaoApi } from '../../service/movimentacaoApi';
import { PageHeader } from '../../components/ui/PageHeader';
import { useNavigate } from 'react-router-dom';

export function MovimentacaoEstoque() {
    const [data, setData] = useState([]);
    const [filterType, setFilterType] = useState('tudo');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 2;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await movimentacaoApi.buscarMovimentacoes();
            setData(data);
            console.log("Movimentações carregadas:", data);
        };

        fetchData();
    }, []);

    // const totalPages = Math.max(1, Math.ceil(mockData.length / pageSize));

    // const paginatedData = useMemo(() => {
    //     const startIndex = (currentPage - 1) * pageSize;
    //     return mockData.slice(startIndex, startIndex + pageSize);
    // }, [currentPage, mockData]);

    const colunas = ["DATA", "PRODUTO", "TIPO", "QUANTIDADE"];

    const funcaoRender =
    {
        render: (row, col) => {
            switch (col) {
                case 'DATA':
                    const data = new Date(row.data);
                    const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).format(data);
                    return <span>{dataFormatada}</span>;

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
                        />
                    </div>

                    <div className={style['filter-buttons']}>
                        <Button children={"Tudo"} colorido={filterType === 'tudo'} disabled={filterType === 'tudo'} onClick={() => setFilterType('tudo')} />
                        <Button children={"Entradas"} colorido={filterType === 'entradas'} disabled={filterType === 'entradas'} onClick={() => setFilterType('entradas')} />
                        <Button children={"Saídas"} colorido={filterType === 'saidas'} disabled={filterType === 'saidas'} onClick={() => setFilterType('saidas')} />
                        <Button children={"📅 Períodos"} colorido={false} />
                    </div>
                </div>

                <Table colunas={colunas} funcaoRender={funcaoRender} data={data} />

                {/* <Pagination
                paginaAtual={currentPage}
                totalPaginas={totalPages}
                aoMudarPagina={setCurrentPage}
            /> */}
            </div>
        </>
    );
}