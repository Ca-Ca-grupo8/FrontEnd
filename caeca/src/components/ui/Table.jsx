import React from 'react';
import Style from '../../styles/Table.module.css';

export function Table({ colunas, funcaoRender, data }) {
  return (
    <div className={Style['table-container']}>
      <table className={Style['custom-table']}>
        <thead>
          <tr>
            {colunas.map((col, index) => (
              <th key={index}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {colunas.map((col, colIndex) => (
                <td key={colIndex}>
                  {funcaoRender.render ? funcaoRender.render(row, col) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}