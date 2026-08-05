import { BackButton } from "./BackButton";
import { Breadcrumbs } from "./Breadcrumbs";

import '../../styles/PageHeader.css'
import { useLocation } from "react-router-dom";

export function PageHeader({ titulo, subtitulo, children }) {
    const location = useLocation();

    return (
        <div className="page-info-container">
            <Breadcrumbs />

            <div className="page-info-title-bar">
                <div>
                    {location.pathname != "/" ?
                    <BackButton /> : null}
                    <h1 className="page-info-title">{titulo}</h1>
                    <h2 className="page-info-subtitle">{subtitulo}</h2>
                </div>
                {children}
            </div>
        </div>
    )
}