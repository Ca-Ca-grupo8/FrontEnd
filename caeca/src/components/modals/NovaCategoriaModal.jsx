import { useEffect, useState } from "react";
import '../../styles/novaCategoria.css'
import { SelectField } from "../ui/SelectField";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { banhoApi } from "../../service/banhoApi";
import { materialApi } from "../../service/materialApi";
import { categoriaApi } from "../../service/categoriaApi";

export function NovaCategoriaModal({ isOpen, onClose }) {
    const [tiposCategoria, setTiposCategoria] = useState([]);
    const [formValues, setFormValues] = useState({
        tipoCategoriaId: "",
        nomeCategoria: ""
    });

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const apiMethodsMap = {
        "Banho": (payload) => banhoApi.cadastrarBanho(payload),
        "Material": (payload) => materialApi.cadastrarMaterial(payload),
        "Categoria": (payload) => categoriaApi.cadastrarCategoria(payload)
    };

    const TIPOS_DISPONIVEIS = [
        { id: "Banho", nome: "Banho" },
        { id: "Material", nome: "Material" },
        { id: "Categoria", nome: "Categoria" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tipoSelecionado = formValues.tipoCategoriaId;

        const metodoApi = apiMethodsMap[tipoSelecionado];

        if (!metodoApi) {
            console.error(`Nenhum método encontrado para o tipo: ${tipoSelecionado}`);
            return;
        }

        const payload = {
            nome: formValues.nomeCategoria
        };

        try {
            const response = await metodoApi(payload);
            console.log("Cadastrado com sucesso:", response);
            onClose();
        } catch (error) {
            console.error("Erro ao cadastrar via mapa de API:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close-btn" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Nova Categoria</h2>
                    <p>Adicione novos tópicos para organizar seu catálogo.</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <SelectField
                        data={TIPOS_DISPONIVEIS}
                        label={"Tipo da categoria"}
                        value={formValues.tipoCategoriaId}
                        onChange={(e) => handleChange("tipoCategoriaId", e.target.value)}
                        required={true}
                    />

                    <InputField
                        label={"Nome da categoria"}
                        type={"text"}
                        placeholder={"Digite o nome"}
                        required={true}
                        value={formValues.nomeCategoria}
                        onChange={(e) => handleChange("nomeCategoria", e.target.value)}
                    />

                    <div className="modal-actions">
                        <Button type="submit">Salvar e voltar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}