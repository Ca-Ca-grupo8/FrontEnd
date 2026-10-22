import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDownToLine, ArrowUpFromLine, Package, Undo2 } from "lucide-react";
import { EntradaJoia } from "../EntradaJoia";
import { EntradaJoiaExistente } from "../entradaJoiaExistente/EntradaJoiaExistente";
import { ReentradaJoia } from "../reentradaJoia/ReentradaJoia";
import { SaidaJoia } from "../SaidaJoia";
import { TopJoiasSaida } from "./components/TopJoiasSaida";
import { Button } from "../../components/ui/Button";
import { NovaCategoriaModal } from "../../components/modals/NovaCategoriaModal";
import { NovoFornecedorModal } from "../../components/modals/NovoFornecedor";
import styles from "./Movimentacoes.module.css";

// Textos da coluna de ajuda ficam aqui para serem trocados depois com facilidade
const FLUXOS = [
    {
        id: "entrada",
        nome: "Entrada",
        descricao: "Joia nova no estoque",
        titulo: "Entrada de joias",
        icone: ArrowDownToLine,
        componente: EntradaJoia,
        ajuda: [
            "Use para registrar a entrada de joias no estoque.",
            "Se a joia ainda não estiver cadastrada, preencha a peça com categoria, material e banho. Se o fornecedor não aparecer na lista, cadastre um pelo botão no menu ao lado.",
        ],
    },
    {
        id: "entrada-existente",
        nome: "Entrada existente",
        descricao: "Repor uma joia cadastrada",
        titulo: "Entrada de joias - Existente",
        icone: Package,
        componente: EntradaJoiaExistente,
        ajuda: [
            "Use para repor estoque de uma joia já cadastrada.",
            "Digite parte do nome e escolha a peça na lista.",
        ],
    },
    {
        id: "reentrada",
        nome: "Reentrada",
        descricao: "Retorno de joias ao estoque",
        titulo: "Reentrada de joias",
        icone: Undo2,
        componente: ReentradaJoia,
        ajuda: [
            "Use para registrar a volta de joias ao estoque.",
            "Dependendo do motivo, pode ser preciso escolher a revendedora. Nesse caso, aparecem só as joias que ela recebeu, e a quantidade não pode passar do que está com ela.",
        ],
    },
    {
        id: "saida",
        nome: "Saída",
        descricao: "Venda, consignação ou maleta",
        titulo: "Saída de joias",
        icone: ArrowUpFromLine,
        componente: SaidaJoia,
        ajuda: [
            "Motivos de maleta ou revendedora exibem os campos de revendedora e data limite.",
            "Informe a quantidade da joia que está saindo.",
        ],
        ajudaExtra: TopJoiasSaida,
    },
];

export function Movimentacoes() {
    const [searchParams, setSearchParams] = useSearchParams();
    const fluxoAtual = FLUXOS.find(fluxo => fluxo.id === searchParams.get("fluxo")) ?? FLUXOS[0];
    const FormularioFluxo = fluxoAtual.componente;
    const AjudaExtra = fluxoAtual.ajudaExtra;
    const [sugestao, setSugestao] = useState(null);
    const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);
    const [isFornecedorOpen, setIsFornecedorOpen] = useState(false);

    return (
        <div className={styles.page}>
            <h1 className={styles.titulo}>Movimentação de joias</h1>

            <div className={styles.layout}>
                <nav className={styles.nav} aria-label="Tipos de movimentação">
                    {FLUXOS.map(({ id, nome, descricao, icone: Icone }) => {
                        const ativo = id === fluxoAtual.id;

                        return (
                            <button
                                key={id}
                                type="button"
                                className={`${styles.navItem} ${ativo ? styles.navItemAtivo : ""}`}
                                aria-current={ativo ? "page" : undefined}
                                onClick={() => {
                                    setSugestao(null);
                                    setSearchParams({ fluxo: id });
                                }}>
                                <Icone size={18} />
                                <span className={styles.navTexto}>
                                    <span className={styles.navNome}>{nome}</span>
                                    <span className={styles.navDescricao}>{descricao}</span>
                                </span>
                            </button>
                        );
                    })}

                    <div className={styles.navAcoes}>
                        <Button type={"button"} colorido={false} onClick={() => setIsCategoriaOpen(true)}>
                            Cadastrar nova categoria
                        </Button>
                        <Button type={"button"} colorido={false} onClick={() => setIsFornecedorOpen(true)}>
                            Cadastrar novo fornecedor
                        </Button>
                    </div>
                </nav>

                <NovaCategoriaModal
                    isOpen={isCategoriaOpen}
                    onClose={() => setIsCategoriaOpen(false)} />

                <NovoFornecedorModal
                    isOpen={isFornecedorOpen}
                    onClose={() => setIsFornecedorOpen(false)} />

                <section className={styles.main}>
                    <h2 className={styles.tituloFluxo}>{fluxoAtual.titulo}</h2>
                    <FormularioFluxo key={fluxoAtual.id} sugestao={sugestao} />
                </section>

                <aside className={styles.aside}>
                    <h3 className={styles.asideTitulo}>Como funciona</h3>
                    <ul className={styles.asideLista}>
                        {fluxoAtual.ajuda.map(item => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>

                    {AjudaExtra && (
                        <AjudaExtra onSelecionar={(joia) => setSugestao({ joia, momento: Date.now() })} />
                    )}
                </aside>
            </div>
        </div>
    );
}
