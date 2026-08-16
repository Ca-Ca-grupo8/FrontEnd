import { BackButton } from "./BackButton";
import { Breadcrumbs } from "./Breadcrumbs";

import style from '../../styles/PageHeader.module.css'
import { useLocation } from "react-router-dom";

export function PageHeader({ titulo, subtitulo, dashed = false, children, ...props }) {
    const location = useLocation();

    return (
        <div className={style['page-info-container']}>
            <Breadcrumbs />

            <div className={style['page-info-title-bar']}>
                <div>
                    {location.pathname != "/" ?
                    <BackButton /> : null}
                    <h1 className={style['page-info-title']}>{titulo}</h1>
                    <h2 className={style['page-info-subtitle'] + ' ' + (dashed ? style['dashed'] : '')} {...props}>
                        {subtitulo}
                    </h2>
                </div>
                {children}
            </div>
        </div>
    )
}