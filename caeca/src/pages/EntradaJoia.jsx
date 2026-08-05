import { useEffect, useState } from "react";
import { banhoApi } from "../service/banhoApi";
import CardForm from "../components/layout/CardForm";
import { InputField } from "../components/ui/InputField";
import { SelectField } from "../components/ui/SelectField";
import { Button } from "../components/ui/Button";
import { materialApi } from "../service/materialApi";
import { categoriaApi } from "../service/categoriaApi";
import { fornecedorApi } from "../service/fornecedorApi";
import { movimentacaoApi } from "../service/movimentacaoApi";
import { motivoApi } from "../service/motivoApi";
import { Header } from "../components/ui/Header";
import { PageHeader } from "../components/ui/PageHeader";
import { Footer } from "../components/ui/Footer";
import '../styles/EntradaJoia.css'
import { NovaCategoriaModal } from "../components/modals/NovaCategoriaModal";
import { CirclePlus } from "lucide-react";
import { NovoFornecedorModal } from "../components/modals/NovoFornecedor";
import { SucessoModal } from "../components/modals/SucessoModal";

export function EntradaJoia() {
    const [motivos, setMotivos] = useState([]);
    const [banhos, setBanhos] = useState([]);
    const [material, setMaterial] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [fornecedor, setFornecedor] = useState([]);
    const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);
    const [isFornecedorOpen, setIsFornecedorOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [mensagemFeedback, setMensagemFeedback] = useState("");

    const [formValues, setFormValues] = useState({
        motivoEntradaId: "",
        nomePeca: "",
        materialId: "",
        categoriaId: "",
        banhoId: "",
        quantidade: "",
        precoCusto: "",
        precoBanho: "",
        multiplicador: "",
        fornecedorId: "",
        imagem: null
    });

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }))
    }

    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                const [listaMotivos, listaBanhos, listaMateriais, listaCategorias, listaFornecedores] = await Promise.all([
                    motivoApi?.listarMotivos() || [],
                    banhoApi.listarBanhos(),
                    materialApi.listarMateriais(),
                    categoriaApi.listarCategorias(),
                    fornecedorApi.listarFornecedores()
                ]);

                const motivosFiltrados = listaMotivos.filter(
                    motivo => motivo.tipoMovimentacao.nome === "ENTRADA" || motivo.tipoMovimentacao.id === 1
                );

                setMotivos(motivosFiltrados);
                setBanhos(listaBanhos);
                setMaterial(listaMateriais);
                setCategoria(listaCategorias);
                setFornecedor(listaFornecedores);
            } catch (error) {
                console.error("Erro ao carregar dados de inicialização:", error);
            }
        }

        carregarDadosIniciais();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            idFornecedor: Number(formValues.fornecedorId) || 0,
            quantidade: Number(formValues.quantidade) || 0,
            precoBanho: Number(formValues.precoBanho) || 0.0,
            precoCompraRevendedor: Number(formValues.precoCusto) || 0.0,
            idRevendedora: null,
            idMotivoMovimentacao: Number(formValues.motivoEntradaId) || 0,
            dadosNovaJoia: {
                nome: formValues.nomePeca,
                quantidade: Number(formValues.quantidade) || 0,
                quantidadeMinima: Number(formValues.quantidade) || 0,
                categoria: Number(formValues.categoriaId) || 0,
                banho: Number(formValues.banhoId) || 0,
                material: Number(formValues.materialId) || 0
            },
            multiplicador: Number(formValues.multiplicador) || 0.0,
            idJoia: null
        }

        cadastrarJoia(payload, formValues.imagem);
    }

    async function cadastrarJoia(payload, image) {
        try {
            const response = await movimentacaoApi.realizarMovimentacao(payload, image);
            setMensagemFeedback("Cadastro realizado com sucesso!");
            setIsSuccess(true)
            setFormValues({
                motivoEntradaId: "",
                nomePeca: "",
                materialId: "",
                categoriaId: "",
                banhoId: "",
                quantidade: "",
                precoCusto: "",
                precoBanho: "",
                multiplicador: "",
                fornecedorId: "",
                imagem: null
            });
            return response;
        } catch (error) {
            setMensagemFeedback("Erro ao realizar o cadastro. Tente novamente.");
            setIsError(true)
            console.error(error)
        }
    }

    const handleCloseFeedback = () => {
        setIsSuccess(false);
        setIsError(false);
    };

    return (
        <>
            <Header />
            <PageHeader titulo={"Entrada de jóias"}>
                <Button type={"button"} colorido={false} onClick={() => setIsCategoriaOpen(true)}>
                    Cadastrar nova categoria
                </Button>
            </PageHeader>

            <NovaCategoriaModal
                isOpen={isCategoriaOpen}
                onClose={() => setIsCategoriaOpen(false)} />

            <NovoFornecedorModal
                isOpen={isFornecedorOpen}
                onClose={() => setIsFornecedorOpen(false)} />

            <SucessoModal 
                text={mensagemFeedback} 
                IsSuccess={isSuccess} 
                error={isError} 
                onClose={handleCloseFeedback} 
            />

            <CardForm onSubmit={handleSubmit}>

                <SelectField
                    data={motivos}
                    label={"Motivo da entrada"}
                    value={formValues.motivoEntradaId}
                    required={true}
                    onChange={(e) => handleChange("motivoEntradaId", e.target.value)}
                />

                <div className="input-with-action">
                    <SelectField
                        data={fornecedor}
                        label={"Fornecedor"}
                        value={formValues.fornecedorId}
                        onChange={(e) => handleChange("fornecedorId", e.target.value)}>
                    </SelectField>

                    <div className="add-fornecedor-container">
                        <CirclePlus className="add-fornecedor-content" onClick={() => setIsFornecedorOpen(true)} />
                    </div>
                </div>

                <InputField
                    label={"Nome da peça"}
                    type={"text"}
                    placeholder={"Ex: Anel Coração XYZ"}
                    required={true}
                    value={formValues.nomePeca}
                    onChange={(e) => handleChange("nomePeca", e.target.value)}>
                </InputField>

                <SelectField
                    data={categoria}
                    label={"Categoria"}
                    value={formValues.categoriaId}
                    onChange={(e) => handleChange("categoriaId", e.target.value)}>
                </SelectField>

                <SelectField
                    data={material}
                    label={"Material"}
                    value={formValues.materialId}
                    onChange={(e) => handleChange("materialId", e.target.value)}>
                </SelectField>

                <SelectField
                    data={banhos}
                    label={"Banho"}
                    value={formValues.banhoId}
                    onChange={(e) => handleChange("banhoId", e.target.value)}>
                </SelectField>

                <InputField
                    label={"Quantidade"}
                    type={"number"}
                    placeholder={"Ex: 15"}
                    required={true}
                    value={formValues.quantidade}
                    onChange={(e) => handleChange("quantidade", e.target.value)}>
                </InputField>

                <InputField
                    label={"Preço original (custo)"}
                    type={"number"}
                    placeholder={"Ex: 45.50"}
                    required={true}
                    value={formValues.precoCusto}
                    onChange={(e) => handleChange("precoCusto", e.target.value)}>
                </InputField>

                <InputField
                    label={"Preço do banho"}
                    type={"number"}
                    placeholder={"Ex: 12.00"}
                    required={true}
                    value={formValues.precoBanho}
                    onChange={(e) => handleChange("precoBanho", e.target.value)}>
                </InputField>

                <InputField
                    label={"Multiplicador (Ganho)"}
                    type={"number"}
                    placeholder={"Ex: 1.5"}
                    required={true}
                    value={formValues.multiplicador}
                    onChange={(e) => handleChange("multiplicador", e.target.value)}>
                </InputField>

                <div className="file-input-wrapper">
                    <InputField
                        label={"Escolha uma imagem"}
                        type={"file"}
                        required={false}
                        onChange={(e) => handleChange("imagem", e.target.files[0])}>
                    </InputField>
                </div>

                <div className="card-form-actions">
                    <Button type={"submit"} colorido={true}>Confirmar</Button>
                    <span className="card-form-link">
                        <p>Jóia existente?</p>
                        <a href="">Atualizar Estoque</a>
                    </span>
                    <span className="card-form-tip">
                        <p><span>*</span> Campos Obrigatórios</p>
                    </span>
                </div>
            </CardForm>

            <Footer />
        </>
    )
}