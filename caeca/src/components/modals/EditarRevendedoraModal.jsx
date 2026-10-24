import { useState } from "react";
import { revendedoraApi } from "../../service/revendedoraApi";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { emitirToast } from "../../utils/toastBus";

// Só é montado enquanto o modal está aberto, então o formulário
// reinicia com os dados da revendedora a cada abertura.
function FormEditarRevendedora({ revendedora, id, onSalvo }) {
    const [formValues, setFormValues] = useState({
        nome: revendedora.nome || "",
        email: revendedora.email || "",
        dataNascimento: revendedora.dataNascimento?.slice(0, 10) || "",
        telefone: revendedora.telefone || "",
        telefoneReserva: revendedora.telefoneReserva || "",
    });

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const telefoneDigits = formValues.telefone.replace(/\D/g, "");
        if (telefoneDigits.length !== 11) {
            emitirToast({ message: "O telefone deve conter DDD e 9 dígitos (11 números).", type: "error" });
            return;
        }

        try {
            await revendedoraApi.editarRevendedora(id, {
                nome: formValues.nome,
                email: formValues.email,
                dataNascimento: formValues.dataNascimento || null,
                telefone: telefoneDigits,
                telefoneReserva: formValues.telefoneReserva.replace(/\D/g, "") || null,
            });

            emitirToast({ message: "Revendedora atualizada com sucesso!", type: "success" });
            onSalvo();
        } catch {
            // Erro exibido pelo interceptor global.
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            <InputField
                label={"Nome"}
                type={"text"}
                placeholder={"Nome completo"}
                required={true}
                value={formValues.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
            />

            <InputField
                label={"Email"}
                type={"email"}
                placeholder={"nome@email.com"}
                required={true}
                value={formValues.email}
                onChange={(e) => handleChange("email", e.target.value)}
            />

            <InputField
                label={"Data de nascimento"}
                type={"date"}
                value={formValues.dataNascimento}
                onChange={(e) => handleChange("dataNascimento", e.target.value)}
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
                label={"Telefone reserva"}
                type={"text"}
                placeholder={"(00) 00000-0000"}
                value={formValues.telefoneReserva}
                onChange={(e) => handleChange("telefoneReserva", e.target.value)}
            />

            <div className="modal-actions">
                <Button type="submit" colorido={true}>
                    Salvar alterações
                </Button>
            </div>
        </form>
    );
}

export function EditarRevendedoraModal({ isOpen, onClose, revendedora, id, onAtualizar }) {
    if (!isOpen || !revendedora) return null;

    const handleSalvo = () => {
        onAtualizar?.();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Editar revendedora</h2>
                    <p>Atualize as informações da revendedora selecionada.</p>
                </div>

                <FormEditarRevendedora revendedora={revendedora} id={id} onSalvo={handleSalvo} />
            </div>
        </div>
    );
}
