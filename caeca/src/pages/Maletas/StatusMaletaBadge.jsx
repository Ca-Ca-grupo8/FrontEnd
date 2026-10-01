import style from './Maletas.module.css';
import { classeStatusMaleta, rotuloStatusMaleta } from './maletaStatus';

export function StatusMaletaBadge({ status }) {
    return (
        <span className={`${style.badge} ${style[classeStatusMaleta(status)]}`}>
            {rotuloStatusMaleta(status)}
        </span>
    );
}