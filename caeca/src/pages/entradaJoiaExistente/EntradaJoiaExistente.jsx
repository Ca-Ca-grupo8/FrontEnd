import { useEffect, useRef, useState } from "react";
import CardForm from "../../components/layout/CardForm";
import { InputField } from "../../components/ui/InputField";
import { SelectField } from "../../components/ui/SelectField";
import { Button } from "../../components/ui/Button";
import { fornecedorApi } from "../../service/fornecedorApi";
import { motivoApi } from "../../service/motivoApi";
import { movimentacaoApi } from "../../service/movimentacaoApi";
import { joiaApi } from "../../service/joiaApi";
import { PageHeader } from "../../components/ui/PageHeader";
import "./EntradaJoiaExistente.module.css";
import { NovoFornecedorModal } from "../../components/modals/NovoFornecedor";
import { SucessoModal } from "../../components/modals/SucessoModal";
import { CirclePlus } from "lucide-react";

export function EntradaJoiaExistente() {
    const [joias, setJoias] = useState([]);
    const [fornecedor, setFornecedor] = useState([]);
    const [motivos, setMotivos] = useState([]);
    const [isFornecedorOpen, setIsFornecedorOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formValues, setFormValues] = useState({
        motivoEntradaId: "",
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
                const [listaJoias, listaFornecedores, listaMotivos] = await Promise.all([
                    joiaApi.listarTodasJoias(),
                    fornecedorApi.listarFornecedores(),
                    motivoApi?.listarMotivos() || []
                ]);

                const motivosFiltrados = listaMotivos.filter(
                    motivo => motivo.tipoMovimentacao.nome === "ENTRADA" || motivo.tipoMovimentacao.id === 1
                );

                setJoias(listaJoias);
                setFornecedor(listaFornecedores);
                setMotivos(motivosFiltrados);
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

        const payload = {
            idFornecedor: Number(formValues.fornecedorId) || 0,
            quantidade: Number(formValues.quantidade) || 0,
            precoBanho: Number(formValues.precoBanho) || 0.0,
            precoCompraRevendedor: Number(formValues.precoCusto) || 0.0,
            idRevendedora: null,
            idMotivoMovimentacao: Number(formValues.motivoEntradaId) || 0,
            dadosNovaJoia: null,
            multiplicador: Number(formValues.multiplicador) || 0.0,
            idJoia: Number(formValues.joiaId) || 0
        }

        realizarEntradaJoiaExistente(payload);
    }

    async function realizarEntradaJoiaExistente(payload) {
        try {
            const response = await movimentacaoApi.realizarMovimentacao(payload, null);
            setIsSuccess(true);
            setFormValues({
                motivoEntradaId: "",
                joiaId: "",
                quantidade: "",
                precoCusto: "",
                precoBanho: "",
                multiplicador: "",
                fornecedorId: "",
            });
            setNomePecaQuery("");
            return response;
        } catch (error) {
            console.error("Erro ao realizar entrada da joia existente:", error);
        }
    }

    return (
        <>
            <PageHeader titulo={"Entrada de joias - Existente"} />

            <NovoFornecedorModal
                isOpen={isFornecedorOpen}
                onClose={() => setIsFornecedorOpen(false)} />

            <SucessoModal text={"Entrada realizada com sucesso!"} IsSuccess={isSuccess} onClose={() => { setIsSuccess(false) }} />

            <CardForm onSubmit={handleSubmit}>

                <SelectField
                    data={motivos}
                    label={"Motivo da entrada"}
                    value={formValues.motivoEntradaId}
                    required={true}
                    onChange={(e) => handleChange("motivoEntradaId", e.target.value)}
                />

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

                <InputField
                    label={"Quantidade"}
                    type={"number"}
                    placeholder={"Value"}
                    required={true}
                    value={formValues.quantidade}
                    onChange={(e) => handleChange("quantidade", e.target.value)}>
                </InputField>

                <InputField
                    label={"Preço Original (Custo)"}
                    type={"number"}
                    placeholder={"Value"}
                    required={true}
                    value={formValues.precoCusto}
                    onChange={(e) => handleChange("precoCusto", e.target.value)}>
                </InputField>

                <InputField
                    label={"Preço do banho"}
                    type={"number"}
                    placeholder={"Value"}
                    required={true}
                    value={formValues.precoBanho}
                    onChange={(e) => handleChange("precoBanho", e.target.value)}>
                </InputField>

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