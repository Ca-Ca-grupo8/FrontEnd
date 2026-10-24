import { useState } from "react";
import { usuarioApi } from "../../service/usuarioApi";
import { InputField } from "../ui/InputField";
import { SelectField } from "../ui/SelectField";
import { Button } from "../ui/Button";
import { emitirToast } from "../../utils/toastBus";
import { OPCOES_PERFIL } from "../../utils/perfilOpcoes";

// Formulário em si, sem a casca de modal: pode ser usado inline ou dentro do modal
export function FormNovoFuncionario({ onSalvo }) {
    const [formValues, setFormValues] = useState({
        nome: "",
        email: "",
        perfilUsuario: "",
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
            await usuarioApi.criarConvite({
                nome: formValues.nome,
                email: formValues.email,
                perfilUsuario: formValues.perfilUsuario,
            });

            setFormValues({ nome: "", email: "", perfilUsuario: "" });
            emitirToast({
                message: `Convite enviado para ${formValues.email}`,
                type: "success",
            });
            onSalvo?.();
        } catch {
            // erro exibido pelo interceptor global
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <InputField
                label={"Nome"}
                type={"text"}
                placeholder={"Até 10 caracteres"}
                required={true}
                value={formValues.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
            />

            <InputField
                label={"Email"}
                type={"email"}
                placeholder={"nome@empresa.com"}
                required={true}
                value={formValues.email}
                onChange={(e) => handleChange("email", e.target.value)}
            />

            <SelectField
                label={"Perfil"}
                data={OPCOES_PERFIL}
                required={true}
                value={formValues.perfilUsuario}
                onChange={(e) => handleChange("perfilUsuario", e.target.value)}
            />

            <div className="modal-actions">
                <Button type="submit" colorido={true}>
                    Cadastrar funcionário
                </Button>
            </div>
        </form>
    );
}

export function NovoFuncionarioModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Novo Funcionário</h2>
                    <p>Cadastre alguém e escolha o que ele pode fazer no sistema.</p>
                </div>

                <FormNovoFuncionario onSalvo={onClose} />
            </div>
        </div>
    );
}
