import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import '../../styles/BackButton.css'

export function BackButton (){
    const navigate = useNavigate();

    return(
        <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft/>
            <span>Voltar</span>
        </button>
    )
}