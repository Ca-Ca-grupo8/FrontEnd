import style from './Maletas.module.css';
import { classeTipoMovimentacao, rotuloTipoMovimentacao } from './tipoMovimentacao';

export function TipoMovimentacaoBadge({ tipo }) {
    return (
        <span className={`${style.badge} ${style[classeTipoMovimentacao(tipo)]}`}>
            {rotuloTipoMovimentacao(tipo)}
        </span>
    );
}
