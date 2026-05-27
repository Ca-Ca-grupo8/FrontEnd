import { useEffect, useEffectEvent, useState } from "react";
import { banhoApi } from "../service/banhoApi";
import CardForm from "../components/layout/CardForm";
import { InputField } from "../components/ui/InputField";
import { SelectField } from "../components/ui/SelectField";
import { Button } from "../components/ui/Button";
import { materialApi } from "../service/materialApi";
import { categoriaApi } from "../service/categoriaApi";
import { fornecedorApi } from "../service/fornecedorApi";
import { movimentacaoApi } from "../service/movimentacaoApi";

export function EntradaJoia() {
    const [banhos, setBanhos] = useState([]);
    const [material, setMaterial] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [fornecedor, setFornecedor] = useState([]);

    const [formValues, setFormValues] = useState({
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
            const [listaBanhos, listaMateriais, listaCategorias, listaFornecedores] = await Promise.all([
                banhoApi.listarBanhos(),
                materialApi.listarMateriais(),
                categoriaApi.listarCategorias(),
                fornecedorApi.listarFornecedores()
            ]);

            setBanhos(listaBanhos);
            setMaterial(listaMateriais);
            setCategoria(listaCategorias);
            setFornecedor(listaFornecedores);
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
            idTipoMovimentacao: 1,
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

        console.log(cadastrarJoia(payload, formValues.imagem))
    }

    async function cadastrarJoia(payload, image) {
        try {
            const response = await movimentacaoApi.realizarMovimentacao(payload, image);
            return response;
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <CardForm onSubmit={handleSubmit}>
                <InputField
                    label={"Nome da peça"}
                    type={"text"}
                    placeholder={"Coração XYZ"}
                    required={true}
                    value={formValues.nomePeca}
                    onChange={(e) => handleChange("nomePeca", e.target.value)}>
                </InputField>

                <SelectField
                    data={material}
                    label={"Material"}
                    value={formValues.materialId}
                    onChange={(e) => handleChange("materialId", e.target.value)}>
                </SelectField>
                <SelectField
                    data={categoria}
                    label={"Categoria"}
                    value={formValues.categoriaId}
                    onChange={(e) => handleChange("categoriaId", e.target.value)}>
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
                    placeholder={"15"}
                    required={true}
                    value={formValues.quantidade}
                    onChange={(e) => handleChange("quantidade", e.target.value)}>
                </InputField>
                <InputField
                    label={"Preço original (custo)"}
                    type={"number"}
                    placeholder={"Anel XYZ"}
                    required={true}
                    value={formValues.precoCusto}
                    onChange={(e) => handleChange("precoCusto", e.target.value)}>
                </InputField>
                <InputField
                    label={"Preço do banho"}
                    type={"number"}
                    placeholder={"72.24"}
                    required={true}
                    value={formValues.precoBanho}
                    onChange={(e) => handleChange("precoBanho", e.target.value)}>
                </InputField>
                <InputField
                    label={"Multiplicador (Ganho)"}
                    type={"number"}
                    placeholder={"1.5"}
                    required={true}
                    value={formValues.multiplicador}
                    onChange={(e) => handleChange("multiplicador", e.target.value)}>
                </InputField>
                <SelectField
                    data={fornecedor}
                    label={"Fornecedor"}
                    value={formValues.fornecedorId}
                    onChange={(e) => handleChange("fornecedorId", e.target.value)}>
                </SelectField>
                <InputField
                    label={"Escolha uma imagem"}
                    type={"file"}
                    required={false}
                    onChange={(e) => handleChange("imagem", e.target.files[0])}>
                </InputField>

                <div className="card-form-actions">
                    <Button type={"submit"}>Confirmar</Button>
                    <span className="card-form-link">
                        <p>Jóia existente?</p>
                        <a href="">Atualizar Estoque</a>
                    </span>
                </div>
            </CardForm>
        </>
    )
}