import { useState } from "react";
import { revendedoraApi } from "../../service/revendedoraApi"; // Importando a API correta
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";

export function NovaRevendedoraModal({ isOpen, onClose }) {
    const [formValues, setFormValues] = useState({
        nome: "",
        email: "",
        telefone: "",
        enderecoId: ""
    });

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
            email: formValues.email,
            telefone: formValues.telefone,
            enderecoId: Number(formValues.enderecoId) || null
        };

        try {
            const response = await revendedoraApi.criarRevendedora(payload);
            console.log("Revendedora cadastrada:", response);
            
            setFormValues({ nome: "", email: "", telefone: "", enderecoId: "" });
            onClose();
        } catch (error) {
            console.error("Erro ao cadastrar revendedora:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <h2>Nova Revendedora</h2>
                    <p>Preencha os dados para cadastrar uma nova revendedora.</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <InputField
                        label={"Nome da revendedora"}
                        type={"text"}
                        placeholder={"Ex: Ana Beatriz"}
                        required={true}
                        value={formValues.nome}
                        onChange={(e) => handleChange("nome", e.target.value)}
                    />

                    <InputField
                        label={"E-mail"}
                        type={"email"}
                        placeholder={"Ex: ana@email.com"}
                        required={true}
                        value={formValues.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />

                    <InputField
                        label={"Telefone"}
                        type={"text"}
                        placeholder={"Ex: 11123456789"}
                        required={true}
                        value={formValues.telefone}
                        onChange={(e) => handleChange("telefone", e.target.value)}
                    />

                    <InputField
                        label={"ID do Endereço"}
                        type={"number"}
                        placeholder={"Ex: 1"}
                        required={true}
                        value={formValues.enderecoId}
                        onChange={(e) => handleChange("enderecoId", e.target.value)}
                    />

                    <div className="modal-actions">
                        <Button type="submit" colorido={true}>
                            Cadastrar revendedora
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}