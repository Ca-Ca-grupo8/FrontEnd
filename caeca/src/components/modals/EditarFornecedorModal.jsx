import { useState } from "react";
import { fornecedorApi } from "../../service/fornecedorApi";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { emitirToast } from "../../utils/toastBus";

// Só é montado enquanto o modal está aberto, então o formulário
// reinicia com os dados do fornecedor a cada abertura.
function FormEditarFornecedor({ fornecedor, onSalvo }) {
    const [formValues, setFormValues] = useState({
        nome: fornecedor.nome || "",
        telefone: fornecedor.telefone || "",
        instagram: fornecedor.instagram || "",
    });
    const fornecedorEstaAtivo = fornecedor.isAtivo === true;

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fornecedorApi.editarFornecedor(fornecedor.id, {
                nome: formValues.nome,
                telefone: formValues.telefone,
                instagram: formValues.instagram,
            });

            emitirToast({ message: "Fornecedor atualizado com sucesso!", type: "success" });
            onSalvo();
        } catch {
            // Erro exibido pelo interceptor global.
        }
    };

    const handleAlterarStatus = async () => {
        const acao = fornecedorEstaAtivo ? "inativar" : "ativar";
        const confirmar = window.confirm(
            `Deseja ${acao} o fornecedor "${formValues.nome}"?`
        );
        if (!confirmar) return;

        try {
            await fornecedorApi.alterarStatus(fornecedor.id, !fornecedorEstaAtivo);
            emitirToast({ message: `Fornecedor "${formValues.nome}" ${acao === "ativar" ? "ativado" : "inativado"}.`, type: "success" });
            onSalvo();
        } catch {
            // Erro exibido pelo interceptor global.
        }
    };

    return (
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
                    Salvar alterações
                </Button>
            </div>

            <div className="modal-actions">
                <Button type="button" colorido={false} onClick={handleAlterarStatus}>
                    {fornecedorEstaAtivo ? "Inativar fornecedor" : "Ativar fornecedor"}
                </Button>
            </div>
        </form>
    );
}

export function EditarFornecedorModal({ isOpen, onClose, fornecedor, onAtualizar }) {
    if (!isOpen || !fornecedor) return null;

    const handleSalvo = () => {
        onAtualizar?.();
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Editar fornecedor</h2>
                    <p>Atualize as informações do fornecedor selecionado.</p>
                </div>

                <FormEditarFornecedor fornecedor={fornecedor} onSalvo={handleSalvo} />
            </div>
        </div>
    );
}
