import { useState } from "react";
import { funcionarioApi } from "../../service/funcionarioApi";
import { InputField } from "../ui/InputField";
import { SelectField } from "../ui/SelectField";
import { Button } from "../ui/Button";
import { emitirToast } from "../../utils/toastBus";
import { OPCOES_PERFIL } from "../../utils/perfilOpcoes";

const OPCOES_STATUS = [
    { id: "ATIVO", nome: "Ativo" },
    { id: "INATIVO", nome: "Inativo" },
];

// Só é montado enquanto o modal está aberto, então o formulário
// reinicia com os dados do funcionário a cada abertura.
function FormEditarFuncionario({ funcionario, propriaConta, onSalvo }) {
    // Pendente não é escolhido manualmente: aparece só para mostrar o estado atual.
    const opcoesStatus = funcionario.status === "PENDENTE"
        ? [{ id: "PENDENTE", nome: "Pendente" }, ...OPCOES_STATUS]
        : OPCOES_STATUS;

    const [formValues, setFormValues] = useState({
        nome: funcionario.nome || "",
        email: funcionario.email || "",
        perfilUsuario: funcionario.tipoPerfil || "",
        status: funcionario.status || "",
    });

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Quem edita outro funcionário só altera perfil e status.
        const payload = {
            perfilUsuario: formValues.perfilUsuario,
            status: formValues.status,
            ...(propriaConta && {
                nome: formValues.nome,
                email: formValues.email,
            }),
        };

        try {
            await funcionarioApi.atualizar(funcionario.id, payload);

            emitirToast({
                message: "Funcionário atualizado com sucesso",
                type: "success",
            });
            onSalvo();
        } catch {
            // erro exibido pelo interceptor global
        }
    };

    return (
        <form onSubmit={handleSubmit} className="modal-form">
            {propriaConta && (
                <>
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
                </>
            )}

            <SelectField
                label={"Perfil"}
                data={OPCOES_PERFIL}
                required={true}
                value={formValues.perfilUsuario}
                onChange={(e) => handleChange("perfilUsuario", e.target.value)}
            />

            <SelectField
                label={"Status"}
                data={opcoesStatus}
                required={true}
                value={formValues.status}
                onChange={(e) => handleChange("status", e.target.value)}
            />

            <div className="modal-actions">
                <Button type="submit" colorido={true}>
                    Salvar alterações
                </Button>
            </div>
        </form>
    );
}

export function EditarFuncionarioModal({ isOpen, onClose, funcionario, propriaConta, onAtualizar }) {
    if (!isOpen || !funcionario) return null;

    const handleSalvo = () => {
        onAtualizar?.();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Editar funcionário</h2>
                    <p>
                        {propriaConta
                            ? "Atualize as informações da sua conta."
                            : "Você pode alterar apenas o perfil e o status deste funcionário."}
                    </p>
                </div>

                <FormEditarFuncionario funcionario={funcionario} propriaConta={propriaConta} onSalvo={handleSalvo} />
            </div>
        </div>
    );
}
