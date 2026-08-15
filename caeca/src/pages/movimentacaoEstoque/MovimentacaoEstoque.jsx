import React, { useState } from 'react';
import style from './MovimentacaoEstoque.module.css';
import { Table } from '../../components/ui/Table';

export function MovimentacaoEstoque() {
    const [filterType, setFilterType] = useState('tudo');

    const mockData = [
        {
            id: 1,
            date: '12/05/2024',
            productName: 'Brinco Argola Ouro 18k',
            productImg: 'https://via.placeholder.com/40',
            type: 'ENTRADA',
            quantity: 100,
        },
        {
            id: 2,
            date: '12/05/2024',
            productName: 'Brinco Argola Ouro 19k',
            productImg: 'https://via.placeholder.com/40',
            type: 'SAÍDA',
            quantity: -100,
        },
        {
            id: 3,
            date: '12/05/2024',
            productName: 'Brinco Argola Ouro 20k',
            productImg: 'https://via.placeholder.com/40',
            type: 'ENTRADA',
            quantity: 100,
        },
    ];

    const colunas = ["DATA", "PRODUTO", "TIPO", "QUANTIDADE"]

    const columns =
    {
        render: (row, col) => {
            switch (col) {
                case 'DATA':
                    return <span>{row.date}</span>;

                case 'PRODUTO':
                    return (
                        <div className={style['product-cell']}>
                            {row.productImg ? (
                                <img src={row.productImg} alt={row.productName} className={style['product-thumb']} />
                            ) : (
                                <div className={style['product-thumb-placeholder']}>[FOTO]</div>
                            )}
                            <span className={style['product-title']}>{row.productName}</span>
                        </div>
                    );

                case 'TIPO': {
                    const isEntry = row.type === 'ENTRADA';
                    const badgeTypeClass = isEntry ? style['badge-entry'] : style['badge-exit'];

                    return (
                        <span className={`${style.badge} ${badgeTypeClass}`}>
                            {row.type}
                        </span>
                    );
                }

                case 'QUANTIDADE':
                    const isPositive = row.quantity > 0;
                    const quantityClass = isPositive ? style['qty-positive'] : style['qty-negative'];
                    return (
                        <span className={`${style.quantity} ${quantityClass}`}>
                            {isPositive ? `+ ${row.quantity}` : `- ${Math.abs(row.quantity)}`}
                        </span>
                    );
            }
        }
    }

    console.log('columns:', columns)
    return (
        <div className={style['page-container']}>
            {/* Filtros da Parte Superior */}
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
                    <button
                        className={style[`btn-filter ${filterType === 'tudo' ? 'active' : ''}`]}
                        onClick={() => setFilterType('tudo')}
                    >
                        Tudo
                    </button>
                    <button
                        className={style[`btn-filter ${filterType === 'entradas' ? 'active' : ''}`]}
                        onClick={() => setFilterType('entradas')}
                    >
                        Entradas
                    </button>
                    <button
                        className={style[`btn-filter ${filterType === 'saidas' ? 'active' : ''}`]}
                        onClick={() => setFilterType('saidas')}
                    >
                        Saídas
                    </button>

                    <button className={style['btn-period']}>
                        📅 Períodos
                    </button>
                </div>
            </div>

            {/* Tabela Genérica */}
            <Table columns={colunas} rowsFunction={columns} data={mockData} />

            {/* Paginação */}
            <div className={style['pagination']}>
                <button className={style['page-nav']}>← Anterior</button>
                <button className={style['page-num'] + ' ' + style['active']}>1</button>
                <button className={style['page-num']}>2</button>
                <button className={style['page-num']}>3</button>
                <span className={style['page-dots']}>...</span>
                <button className={style['page-num']}>67</button>
                <button className={style['page-num']}>68</button>
                <button className={style['page-nav']}>Próximo →</button>
            </div>
        </div>
    );
}