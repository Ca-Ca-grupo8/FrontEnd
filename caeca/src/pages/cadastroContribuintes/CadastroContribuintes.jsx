import { PageHeader } from "../../components/ui/PageHeader";
import { FormOpt } from "../../components/ui/FormOpt";
import Style from "./CadastroContribuintes.module.css";

export function CadastroContribuintes() {
    const opcoesMovimentacao = [
        { nome: "Cadastro de fornecedor", path: "/contribuintes/fornecedores" },
        { nome: "Cadastro de revendedora", path: "/contribuintes/revendedoras" },
        { nome: "Cadastro de funcionário", path: "/contribuintes/funcionarios" },
    ];

    return (
        <div className={Style.pageWrapper}>
            <PageHeader titulo={"Cadastro de contribuintes"} />

            <div className={Style.container}>
                <FormOpt opcoes={opcoesMovimentacao} />
            </div>
        </div>
    );
}