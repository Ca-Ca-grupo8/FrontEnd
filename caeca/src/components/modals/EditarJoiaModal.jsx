import { useEffect, useState } from "react";
import '../../styles/novaCategoria.css'
import { SelectField } from "../ui/SelectField";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { banhoApi } from "../../service/banhoApi";
import { materialApi } from "../../service/materialApi";
import { categoriaApi } from "../../service/categoriaApi";
import { joiaApi } from "../../service/joiaApi";

const inicializarForm = (joia) => ({
    nome: joia?.nome || "",
    quantidade: joia?.quantidade ?? "",
    quantidadeMinima: joia?.quantidadeMinima ?? "",
    categoriaId: joia?.categoria?.id ?? "",
    banhoId: joia?.banho?.id ?? "",
    materialId: joia?.material?.id ?? "",
    precoFinal: joia?.preco ?? "",
    ativo: joia?.ativo ?? joia?.isAtivo ?? true
});

export function EditarJoiaModal({ isOpen, onClose, joia, onAtualizar }) {
    const [banhos, setBanhos] = useState([]);
    const [materiais, setMateriais] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formValues, setFormValues] = useState(() => inicializarForm(joia));
    const [ultimaAbertura, setUltimaAbertura] = useState(isOpen);

    if (isOpen !== ultimaAbertura) {
        setUltimaAbertura(isOpen);
        if (isOpen) setFormValues(inicializarForm(joia));
    }

    useEffect(() => {
        if (!isOpen) return;

        async function carregarOpcoes() {
            try {
                const [listaBanhos, listaMateriais, listaCategorias] = await Promise.all([
                    banhoApi.listarBanhos(),
                    materialApi.listarMateriais(),
                    categoriaApi.listarCategorias()
                ]);

                setBanhos(listaBanhos);
                setMateriais(listaMateriais);
                setCategorias(listaCategorias);
            } catch (error) {
                console.error("Erro ao carregar opções de edição:", error);
            }
        }

        carregarOpcoes();
    }, [isOpen]);

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            nome: formValues.nome,
            quantidadeMinima: Number(formValues.quantidadeMinima) || null,
            categoriaId: Number(formValues.categoriaId) || null,
            banhoId: Number(formValues.banhoId) || null,
            materialId: Number(formValues.materialId) || null,
            precoFinal: Number(formValues.precoFinal) || null,
            isAtivo: formValues.ativo,
            ativo: formValues.ativo
        };

        try {
            await joiaApi.atualizarJoia(joia.id, payload);
            onAtualizar();
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar a joia:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="modal-close-btn" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Editar joia</h2>
                    <p>Atualize as informações da joia selecionada.</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <InputField
                        label={"Nome"}
                        type={"text"}
                        placeholder={"Ex: Anel Coração"}
                        required={true}
                        value={formValues.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                    />

                    <SelectField
                        data={categorias}
                        label={"Categoria"}
                        value={formValues.categoriaId}
                        onChange={(e) => handleChange("categoriaId", e.target.value)}
                    />

                    <SelectField
                        data={materiais}
                        label={"Material"}
                        value={formValues.materialId}
                        onChange={(e) => handleChange("materialId", e.target.value)}
                    />

                    <SelectField
                        data={banhos}
                        label={"Banho"}
                        value={formValues.banhoId}
                        onChange={(e) => handleChange("banhoId", e.target.value)}
                    />

                    <InputField
                        label={"Quantidade mínima"}
                        type={"number"}
                        placeholder={"Ex: 5"}
                        required={true}
                        value={formValues.quantidadeMinima}
                        onChange={(e) => handleChange("quantidadeMinima", e.target.value)}
                    />

                    <InputField
                        label={"Preço final"}
                        type={"number"}
                        step={"0.01"}
                        placeholder={"Ex: 120.00"}
                        required={true}
                        value={formValues.precoFinal}
                        onChange={(e) => handleChange("precoFinal", e.target.value)}
                    />

                    <label className="modal-checkbox">
                        <input
                            type="checkbox"
                            checked={formValues.ativo}
                            onChange={(e) => handleChange("ativo", e.target.checked)}
                        />
                        Joia ativa
                    </label>

                    <div className="modal-actions">
                        <Button type="submit">Salvar alterações</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}