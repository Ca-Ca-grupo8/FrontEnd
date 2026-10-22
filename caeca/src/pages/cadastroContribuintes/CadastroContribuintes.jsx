import { useSearchParams } from "react-router-dom";
import { IdCard, Store, Truck } from "lucide-react";
import { FormNovoFornecedor } from "../../components/modals/NovoFornecedor";
import { FormNovoFuncionario } from "../../components/modals/NovoFuncionario";
import { FormRevendedora } from "../revendedoras/FormRevendedora";
import { usuarioEhAdmin } from "../../utils/perfil";
import styles from "./CadastroContribuintes.module.css";

// Textos da coluna de ajuda ficam aqui para serem trocados depois com facilidade
const CADASTROS = [
    {
        id: "fornecedor",
        nome: "Fornecedor",
        descricao: "Quem fornece joias ao estoque",
        titulo: "Cadastro de fornecedor",
        apenasAdmin: true,
        icone: Truck,
        componente: FormNovoFornecedor,
        ajuda: [
            "Preencha nome, telefone e Instagram do fornecedor.",
            "Depois de cadastrado, ele aparece como opção na entrada de joias.",
        ],
    },
    {
        id: "revendedora",
        nome: "Revendedora",
        descricao: "Quem recebe joias para revender",
        titulo: "Cadastro de revendedora",
        icone: Store,
        componente: FormRevendedora,
        ajuda: [
            "Informe os dados pessoais e o endereço da revendedora.",
            "Digite o CEP para preencher logradouro, bairro, cidade e UF automaticamente.",
        ],
    },
    {
        id: "funcionario",
        nome: "Funcionário",
        descricao: "Quem trabalha na operação",
        titulo: "Cadastro de funcionário",
        icone: IdCard,
        componente: FormNovoFuncionario,
        ajuda: [
            "Será enviado um convite por email para o funcionário.",
            "Escolha o perfil para definir o que ele pode fazer no sistema.",
        ],
    },
];

export function CadastroContribuintes() {
    const [searchParams, setSearchParams] = useSearchParams();
    const cadastrosDisponiveis = CADASTROS.filter(cadastro => !cadastro.apenasAdmin || usuarioEhAdmin());
    const cadastroAtual = cadastrosDisponiveis.find(cadastro => cadastro.id === searchParams.get("tipo")) ?? cadastrosDisponiveis[0];
    const FormularioCadastro = cadastroAtual.componente;

    return (
        <div className={styles.page}>
            <h1 className={styles.titulo}>Cadastro de contribuintes</h1>

            <div className={styles.layout}>
                <nav className={styles.nav} aria-label="Tipos de cadastro">
                    {cadastrosDisponiveis.map(({ id, nome, descricao, icone: Icone }) => {
                        const ativo = id === cadastroAtual.id;

                        return (
                            <button
                                key={id}
                                type="button"
                                className={`${styles.navItem} ${ativo ? styles.navItemAtivo : ""}`}
                                aria-current={ativo ? "page" : undefined}
                                onClick={() => setSearchParams({ tipo: id })}>
                                <Icone size={18} />
                                <span className={styles.navTexto}>
                                    <span className={styles.navNome}>{nome}</span>
                                    <span className={styles.navDescricao}>{descricao}</span>
                                </span>
                            </button>
                        );
                    })}
                </nav>

                <section className={styles.main}>
                    <h2 className={styles.tituloFluxo}>{cadastroAtual.titulo}</h2>
                    <FormularioCadastro key={cadastroAtual.id} />
                </section>

                <aside className={styles.aside}>
                    <h3 className={styles.asideTitulo}>Como funciona</h3>
                    <ul className={styles.asideLista}>
                        {cadastroAtual.ajuda.map(item => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
}
