import { PageHeader } from "../../components/ui/PageHeader";
import { FormOpt } from "../../components/ui/FormOpt";
import Style from "./MovimentacaoEscolhas.module.css";

export function MovimentacaoEscolhas() {
    const opcoesMovimentacao = [
        { nome: "Entrada", path: "/movimentacoes/entrada" },
        { nome: "Saída", path: "/movimentacoes/saida" },
        { nome: "Reentrada", path: "/movimentacoes/reentrada" },
    ];

    return (
        <div className={Style.pageWrapper}>
            <PageHeader titulo={"Movimentação de joias"} />

            <div className={Style.container}>
                <FormOpt opcoes={opcoesMovimentacao} />
            </div>
        </div>
    );
}