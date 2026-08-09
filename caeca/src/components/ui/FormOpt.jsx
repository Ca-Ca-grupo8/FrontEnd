import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import Style from "../../styles/FormOpt.module.css";

export function FormOpt({ opcoes = [] }) {
    const navigate = useNavigate();

    return (
        <div className={Style.formContainer}>
            {opcoes.map((opcao) => (
                <Button
                    key={opcao.path}
                    onClick={() => navigate(opcao.path)}
                >
                    {opcao.nome}
                </Button>
            ))}
        </div>
    );
}