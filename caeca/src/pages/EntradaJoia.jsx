import { useEffect, useEffectEvent, useState } from "react";
import { banhoApi } from "../service/banhoApi";
import CardForm from "../components/layout/CardForm";
import { InputField } from "../components/ui/InputField";
import { SelectField } from "../components/ui/SelectField";
import { Button } from "../components/ui/Button";
import { materialApi } from "../service/materialApi";
import { categoriaApi } from "../service/categoriaApi";
import { fornecedorApi } from "../service/fornecedorApi";

export function EntradaJoia() {
    const [banhos, setBanhos] = useState([]);
    const [material, setMaterial] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [fornecedor, setFornecedor] = useState([]);

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

    return (
        <>
            <CardForm>
                <InputField
                    label={"Nome da peça"}
                    type={"text"}
                    placeholder={"Coração XYZ"}
                    required={true}>
                </InputField>
                <SelectField data={material} label={"Material"}></SelectField>
                <SelectField data={categoria} label={"Categoria"}></SelectField>
                <SelectField data={banhos} label={"Banho"}></SelectField>
                <InputField
                    label={"Quantidade"}
                    type={"number"}
                    placeholder={"15"}
                    required={true}>
                </InputField>
                <InputField
                    label={"Preço original (custo)"}
                    type={"number"}
                    placeholder={"Anel XYZ"}
                    required={true}>
                </InputField>
                <InputField
                    label={"Preço do banho"}
                    type={"number"}
                    placeholder={"72.24"}
                    required={true}>
                </InputField>
                <InputField
                    label={"Multiplicador (Ganho)"}
                    type={"number"}
                    placeholder={"1.5"}
                    required={true}>
                </InputField>
                <SelectField data={fornecedor} label={"Fornecedor"}></SelectField>
                <InputField
                    label={"Imagem"}
                    type={"text"}
                    placeholder={"Anel XYZ"}
                    required={false}>
                </InputField>

                <Button>Confirmar</Button>
            </CardForm>
        </>
    )
}