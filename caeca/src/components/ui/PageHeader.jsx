import { BackButton } from "./BackButton";
import { Breadcrumbs } from "./Breadcrumbs";

import '../../styles/PageHeader.css'

export function PageHeader({ titulo, children }) {
    return (
        <div className="page-info-container">
            <Breadcrumbs />
            <div className="page-info-title-bar">
                <div>
                    <BackButton />
                    <h1 className="page-info-title">{titulo}</h1>
                </div>
                {children}
            </div>
        </div>
    )
}