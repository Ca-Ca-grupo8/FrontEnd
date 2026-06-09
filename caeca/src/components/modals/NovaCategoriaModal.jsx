import { useEffect, useState } from "react";
import '../../styles/novaCategoria.css'
import { SelectField } from "../ui/SelectField";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { banhoApi } from "../../service/banhoApi";
import { materialApi } from "../../service/materialApi";
import { categoriaApi } from "../../service/categoriaApi";
import { motivoApi } from "../../service/motivoApi";
import { tiposApi } from "../../service/tipoApi";

export function NovaCategoriaModal({ isOpen, onClose }) {
    const [tiposMotivoOptions, setTiposMotivoOptions] = useState([]);
    const [formValues, setFormValues] = useState({
        tipoCategoriaId: "",
        nomeCategoria: "",
        tipoMotivoId: ""
    });

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value,
            ...(field === "tipoCategoriaId" && value !== "Motivo" ? { tipoMotivoId: "" } : {})
        }));
    };

    const apiMethodsMap = {
        "Banho": (payload) => banhoApi.cadastrarBanho(payload),
        "Material": (payload) => materialApi.cadastrarMaterial(payload),
        "Categoria": (payload) => categoriaApi.cadastrarCategoria(payload),
        "Motivo": (payload) => motivoApi.cadastrarMotivo(payload)
    };

    const TIPOS_DISPONIVEIS = [
        { id: "Banho", nome: "Banho" },
        { id: "Material", nome: "Material" },
        { id: "Categoria", nome: "Categoria" },
        { id: "Motivo", nome: "Motivo" }
    ];

    useEffect(() => {
        if (formValues.tipoCategoriaId === "Motivo" && isOpen) {
            const carregarTiposMovimentacao = async () => {
                try {
                    const data = await tiposApi.listarTipos();

                    const options_formatadas = data.map(tipo => ({
                        id: tipo.id,
                        nome: tipo.nome
                    }));

                    setTiposMotivoOptions(options_formatadas);
                } catch (error) {
                    console.error("Erro ao buscar tipos de motivo:", error);
                }
            };

            carregarTiposMovimentacao();
        }
    }, [formValues.tipoCategoriaId, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tipoSelecionado = formValues.tipoCategoriaId;
        const metodoApi = apiMethodsMap[tipoSelecionado];

        if (!metodoApi) {
            console.error(`Nenhum método encontrado para o tipo: ${tipoSelecionado}`);
            return;
        }

        let payload = {};

        if (tipoSelecionado === "Motivo") {
            payload = {
                descricao: formValues.nomeCategoria,
                idTipoMovimentacao: Number(formValues.tipoMotivoId)
            };
        } else {
            payload = {
                nome: formValues.nomeCategoria
            };
        }

        try {
            const response = await metodoApi(payload);
            console.log("Cadastrado com sucesso:", response);
            setFormValues({ tipoCategoriaId: "", nomeCategoria: "", tipoMotivoId: "" });
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

                    {formValues.tipoCategoriaId === "Motivo" && (
                        <SelectField
                            data={tiposMotivoOptions}
                            label={"Tipo do motivo"}
                            value={formValues.tipoMotivoId}
                            onChange={(e) => handleChange("tipoMotivoId", e.target.value)}
                            required={true}
                        />
                    )}

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