import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { banhoApi } from "../service/banhoApi";
import { FormFlat } from "../components/layout/FormFlat";
import formStyles from "../components/layout/FormFlat.module.css";
import { InputField } from "../components/ui/InputField";
import { SelectField } from "../components/ui/SelectField";
import { Button } from "../components/ui/Button";
import { materialApi } from "../service/materialApi";
import { categoriaApi } from "../service/categoriaApi";
import { fornecedorApi } from "../service/fornecedorApi";
import { movimentacaoApi } from "../service/movimentacaoApi";
import { motivoApi } from "../service/motivoApi";
import '../styles/EntradaJoia.css'
import { emitirToast } from "../utils/toastBus";

export function EntradaJoia() {
    const [motivos, setMotivos] = useState([]);
    const [banhos, setBanhos] = useState([]);
    const [material, setMaterial] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [fornecedor, setFornecedor] = useState([]);

    const [formValues, setFormValues] = useState({
        motivoEntradaId: "",
        nomePeca: "",
        materialId: "",
        categoriaId: "",
        banhoId: "",
        quantidade: "",
        quantidadeMinima: "",
        precoCusto: "",
        precoBanho: "",
        multiplicador: "",
        fornecedorId: "",
        imagem: null
    });

    const handleChange = (field, value) => {
        // Se for um campo numérico, remove 'e', 'E', '+' e '-' instantaneamente
        const camposNumericos = ['quantidade', 'quantidadeMinima', 'precoCusto', 'precoBanho', 'multiplicador'];
        
        let valorTratado = value;
        if (camposNumericos.includes(field)) {
            valorTratado = value.replace(/[eE+\-]/g, '');
        }

        setFormValues(prev => ({
            ...prev,
            [field]: valorTratado
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
                quantidadeMinima: Number(formValues.quantidadeMinima) || 0,
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
            emitirToast({ message: "Cadastro realizado com sucesso!", type: "success" });
            setFormValues({
                motivoEntradaId: "",
                nomePeca: "",
                materialId: "",
                categoriaId: "",
                banhoId: "",
                quantidade: "",
                quantidadeMinima: "",
                precoCusto: "",
                precoBanho: "",
                multiplicador: "",
                fornecedorId: "",
                imagem: null
            });
            return response;
        } catch (error) {
            console.error(error)
        }
    }

    // Função para bloquear fisicamente a digitação de 'e', 'E', '+' e '-' nas teclas
    const bloquearTeclasInvalidas = (e) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <>
            <FormFlat onSubmit={handleSubmit}>

                <SelectField
                    data={motivos}
                    label={"Motivo da entrada"}
                    value={formValues.motivoEntradaId}
                    required={true}
                    onChange={(e) => handleChange("motivoEntradaId", e.target.value)}
                />

                <SelectField
                    data={fornecedor}
                    label={"Fornecedor"}
                    value={formValues.fornecedorId}
                    onChange={(e) => handleChange("fornecedorId", e.target.value)}>
                </SelectField>

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

                <div className={formStyles.linhaDupla}>
                    <InputField
                        label={"Quantidade"}
                        type={"number"}
                        placeholder={"Ex: 15"}
                        required={true}
                        min="0"
                        value={formValues.quantidade}
                        onChange={(e) => handleChange("quantidade", e.target.value)}
                        onKeyDown={bloquearTeclasInvalidas}
                    />

                    <InputField
                        label={"Quantidade mínima"}
                        type={"number"}
                        placeholder={"Ex: 3"}
                        required={true}
                        min="0"
                        value={formValues.quantidadeMinima}
                        onChange={(e) => handleChange("quantidadeMinima", e.target.value)}
                        onKeyDown={bloquearTeclasInvalidas}
                    />
                </div>

                <InputField
                    label={"Preço original (custo)"}
                    type={"number"}
                    placeholder={"Ex: 45.50"}
                    required={true}
                    min="0"
                    value={formValues.precoCusto}
                    onChange={(e) => handleChange("precoCusto", e.target.value)}
                    onKeyDown={bloquearTeclasInvalidas}
                />

                <InputField
                    label={"Preço do banho"}
                    type={"number"}
                    placeholder={"Ex: 12.00"}
                    required={true}
                    min="0"
                    value={formValues.precoBanho}
                    onChange={(e) => handleChange("precoBanho", e.target.value)}
                    onKeyDown={bloquearTeclasInvalidas}
                />

                <InputField
                    label={"Multiplicador (Ganho)"}
                    type={"number"}
                    placeholder={"Ex: 1.5"}
                    required={true}
                    min="0"
                    value={formValues.multiplicador}
                    onChange={(e) => handleChange("multiplicador", e.target.value)}
                    onKeyDown={bloquearTeclasInvalidas}
                />

                <div className={formStyles.inteiro}>
                    <InputField
                        label={"Escolha uma imagem"}
                        type={"file"}
                        required={false}
                        onChange={(e) => handleChange("imagem", e.target.files[0])}>
                    </InputField>
                </div>

                <div className={formStyles.acoes}>
                    <Button type={"submit"} colorido={true}>Confirmar</Button>
                    <span className={formStyles.link}>
                        <p>Jóia existente?</p>
                        <Link to="/movimentacoes?fluxo=entrada-existente">Atualizar Estoque</Link>
                    </span>
                </div>
            </FormFlat>

        </>
    )
}