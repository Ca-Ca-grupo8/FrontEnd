import { useState } from "react";
import { fornecedorApi } from "../../service/fornecedorApi";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { emitirToast } from "../../utils/toastBus";

export function NovoFornecedorModal({ isOpen, onClose, onCriado }) {
    const [formValues, setFormValues] = useState({
        nome: "",
        telefone: "",
        instagram: ""
    });

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const fornecedorCriado = await fornecedorApi.criarFornecedor({
                nome: formValues.nome,
                telefone: formValues.telefone,
                instagram: formValues.instagram,
            });

            onCriado?.(fornecedorCriado);
            setFormValues({ nome: "", telefone: "", instagram: "" });
            emitirToast({ message: "Fornecedor cadastrado com sucesso!", type: "success" });
            onClose();
        } catch {
            // Erro exibido pelo interceptor global.
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Novo Fornecedor</h2>
                    <p>Preencha os dados para cadastrar um novo parceiro.</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <InputField
                        label={"Nome do fornecedor"}
                        type={"text"}
                        placeholder={"Ex: Joias Atacado"}
                        required={true}
                        value={formValues.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                    />

                    <InputField
                        label={"Telefone"}
                        type={"text"}
                        placeholder={"(00) 00000-0000"}
                        required={true}
                        value={formValues.telefone}
                        onChange={(e) => handleChange("telefone", e.target.value)}
                    />

                    <InputField
                        label={"Instagram"}
                        type={"text"}
                        placeholder={"@seufornecedor"}
                        required={true}
                        value={formValues.instagram}
                        onChange={(e) => handleChange("instagram", e.target.value)}
                    />

                    <div className="modal-actions">
                        <Button type="submit" colorido={true}>
                            Cadastrar fornecedor
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
