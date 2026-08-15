import React from 'react';
import Style from '../../styles/Table.module.css';

export function Table({ columns, rowsFunction, data }) {
  return (
    <div className={Style['table-container']}>
      <table className={Style['custom-table']}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {rowsFunction.render ? rowsFunction.render(row, col) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}