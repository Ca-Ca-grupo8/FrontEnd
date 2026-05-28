import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import '../../styles/Breadcrumbs.css'

export function Breadcrumbs() {
    const location = useLocation();

    if (location.pathname == "/") {
        return null
    }

    const pathnames = location.pathname.split("/").filter(Boolean);

    return (
        <div className="breadcrumbs">
            <Link to="/" className="breadcrumb-item">
                <span>Home</span>
            </Link>

            {pathnames.map((value, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;

                const isLast = false

                if (index == pathnames.length) {
                    isLast = true
                }

                const displayName = value.charAt(0).toUpperCase() + value.slice(1);

                return (
                    <>
                        <ChevronRight size={16} className="breadcrumb-separator" />

                        {isLast ? (
                            <span className="breadcrumb-item active">{displayName}</span>
                        ) : (
                            <Link to={routeTo} className="breadcrumb-item">
                                {displayName}
                            </Link>
                        )}
                    </>
                )
            })}
        </div>
    )
}