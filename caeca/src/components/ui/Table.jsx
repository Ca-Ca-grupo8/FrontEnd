import Style from '../../styles/Table.module.css';

export function Table({ colunas, funcaoRender, data, style, onRowClick }) {
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
            <tr key={rowIndex} onClick={onRowClick ? () => onRowClick(row) : undefined} style={onRowClick ? { cursor: 'pointer' } : undefined}>
              {colunas.map((col, colIndex) => (
                <td key={colIndex} style={style} >
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