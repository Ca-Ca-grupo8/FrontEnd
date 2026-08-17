import { useEffect, useRef, useState } from "react";
import CardForm from "../../components/layout/CardForm";
import { InputField } from "../../components/ui/InputField";
import { SelectField } from "../../components/ui/SelectField";
import { Button } from "../../components/ui/Button";
import { fornecedorApi } from "../../service/fornecedorApi";
// ATENÇÃO: joiaApi ainda não existe no projeto (não estava entre os services
// usados em EntradaJoia.jsx: motivoApi, banhoApi, materialApi, categoriaApi,
// fornecedorApi, movimentacaoApi). É preciso confirmar/criar
// `listarJoias()` em `../service/joiaApi.js` antes de subir para produção.
import { joiaApi } from "../../service/joiaApi";
import { PageHeader } from "../../components/ui/PageHeader";
import "./EntradaJoiaExistente.module.css";
import { NovoFornecedorModal } from "../../components/modals/NovoFornecedor";
import { CirclePlus } from "lucide-react";

export function EntradaJoiaExistente() {
    const [joias, setJoias] = useState([]);
    const [fornecedor, setFornecedor] = useState([]);
    const [isFornecedorOpen, setIsFornecedorOpen] = useState(false);

    // Campos "Quantidade" e "Preço do banho" ainda não têm um service
    // dedicado no projeto (na EntradaJoia.jsx eles aparecem como
    // InputField numérico, não como listas). Mantidos mockados até que
    // exista uma origem real de dados para essas opções.
    const [quantidadeOpcoes] = useState([
        { id: 1, nome: "1" },
        { id: 2, nome: "2" },
        { id: 5, nome: "5" },
        { id: 10, nome: "10" },
    ]);
    const [precoBanhoOpcoes] = useState([
        { id: 1, nome: "Ouro 18k" },
        { id: 2, nome: "Ouro 24k" },
        { id: 3, nome: "Ródio" },
        { id: 4, nome: "Prata" },
    ]);

    const [formValues, setFormValues] = useState({
        joiaId: "",
        quantidade: "",
        precoCusto: "",
        precoBanho: "",
        multiplicador: "",
        fornecedorId: "",
    });

    // Combobox de busca da peça (Nome da peça)
    const [nomePecaQuery, setNomePecaQuery] = useState("");
    const [isNomePecaOpen, setIsNomePecaOpen] = useState(false);
    const nomePecaWrapperRef = useRef(null);

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }))
    }

    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                const [listaJoias, listaFornecedores] = await Promise.all([
                    joiaApi.listarJoias(),
                    fornecedorApi.listarFornecedores()
                ]);

                setJoias(listaJoias);
                setFornecedor(listaFornecedores);
            } catch (error) {
                console.error("Erro ao carregar dados de inicialização:", error);
            }
        }

        carregarDadosIniciais();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                nomePecaWrapperRef.current &&
                !nomePecaWrapperRef.current.contains(event.target)
            ) {
                setIsNomePecaOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const joiasFiltradas = joias.filter(joia =>
        joia.nome.toLowerCase().includes(nomePecaQuery.toLowerCase())
    );

    const handleSelectPeca = (joia) => {
        handleChange("joiaId", joia.id);
        setNomePecaQuery(joia.nome);
        setIsNomePecaOpen(false);
    };

    const handleNomePecaInputChange = (value) => {
        setNomePecaQuery(value);
        setIsNomePecaOpen(true);
        if (formValues.joiaId) {
            handleChange("joiaId", "");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulação de envio - integração real com movimentacaoApi fica para depois.
        console.log("Realizar entrada:", formValues);
    }

    return (
        <>
            <PageHeader titulo={"Entrada de joias - Existente"} />

            <NovoFornecedorModal
                isOpen={isFornecedorOpen}
                onClose={() => setIsFornecedorOpen(false)} />

            <CardForm onSubmit={handleSubmit}>

                <div className="combobox-wrapper" ref={nomePecaWrapperRef}>
                    <InputField
                        label={"Nome da peça"}
                        type={"text"}
                        placeholder={"Value"}
                        required={true}
                        autoComplete="off"
                        value={nomePecaQuery}
                        onChange={(e) => handleNomePecaInputChange(e.target.value)}
                        onFocus={() => setIsNomePecaOpen(true)}>
                    </InputField>

                    {isNomePecaOpen && (
                        <ul className="combobox-list">
                            {joiasFiltradas.length > 0 ? (
                                joiasFiltradas.map((joia) => (
                                    <li
                                        key={joia.id}
                                        className="combobox-item"
                                        onClick={() => handleSelectPeca(joia)}
                                    >
                                        {joia.nome}
                                    </li>
                                ))
                            ) : (
                                <li className="combobox-item combobox-item-empty">
                                    Nenhuma peça encontrada
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                <SelectField
                    data={quantidadeOpcoes}
                    label={"Quantidade"}
                    value={formValues.quantidade}
                    required={true}
                    onChange={(e) => handleChange("quantidade", e.target.value)}
                />

                <InputField
                    label={"Preço Original (Custo)"}
                    type={"number"}
                    placeholder={"Value"}
                    required={true}
                    value={formValues.precoCusto}
                    onChange={(e) => handleChange("precoCusto", e.target.value)}>
                </InputField>

                <SelectField
                    data={precoBanhoOpcoes}
                    label={"Preço do banho"}
                    value={formValues.precoBanho}
                    required={true}
                    onChange={(e) => handleChange("precoBanho", e.target.value)}
                />

                <InputField
                    label={"Multiplicador"}
                    type={"number"}
                    placeholder={"Value"}
                    required={true}
                    value={formValues.multiplicador}
                    onChange={(e) => handleChange("multiplicador", e.target.value)}>
                </InputField>

                <div className="input-with-action">
                    <SelectField
                        data={fornecedor}
                        label={"Fornecedor"}
                        value={formValues.fornecedorId}
                        required={true}
                        onChange={(e) => handleChange("fornecedorId", e.target.value)}>
                    </SelectField>

                    <div className="add-fornecedor-container">
                        <CirclePlus className="add-fornecedor-content" onClick={() => setIsFornecedorOpen(true)} />
                    </div>
                </div>

                <div className="card-form-actions">
                    <Button type={"submit"} colorido={true}>Realizar entrada</Button>
                    <p className="required-fields-note">
                        <span className="required-asterisk">*</span> Campos obrigatórios
                    </p>
                </div>
            </CardForm>
        </>
    )
}