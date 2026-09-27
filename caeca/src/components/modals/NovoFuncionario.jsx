import { useState } from "react";
import { funcionarioApi } from "../../service/funcionarioApi";
import { InputField } from "../ui/InputField";
import { Button } from "../ui/Button";
import { SucessoModal } from "./SucessoModal";

export function NovoFuncionarioModal({ isOpen, onClose }) {
    const [formValues, setFormValues] = useState({
        nome: "",
        cargo: "",
        telefone: ""
    });
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState(null);

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);

        try {
            await funcionarioApi.criarFuncionario({
                nome: formValues.nome,
                cargo: formValues.cargo,
                telefone: formValues.telefone
            });

            setFormValues({ nome: "", cargo: "", telefone: "" });
            setSucesso(true);
        } catch (error) {
            const msg = error.response?.data?.message || "Erro ao cadastrar funcionário.";
            setErro(msg);
        }
    };

    const fecharSucesso = () => {
        setSucesso(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {sucesso && (
                <SucessoModal
                    text="Funcionário cadastrado com sucesso!"
                    IsSuccess={true}
                    onClose={fecharSucesso}
                />
            )}
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close-btn" onClick={onClose}>×</button>

                    <div className="modal-header">
                        <h2>Novo Funcionário</h2>
                        <p>Preencha os dados para cadastrar um novo membro da equipe.</p>
                    </div>

                    {erro && (
                        <p style={{ color: '#D92D20', fontSize: '14px', textAlign: 'center', margin: '8px 0' }}>
                            {erro}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="modal-form">
                        <InputField
                            label={"Nome do funcionário"}
                            type={"text"}
                            placeholder={"Ex: Jorge Alvarez"}
                            required={true}
                            value={formValues.nome}
                            onChange={(e) => handleChange("nome", e.target.value)}
                        />

                        <InputField
                            label={"Cargo"}
                            type={"text"}
                            placeholder={"Ex: Vendedor"}
                            required={true}
                            value={formValues.cargo}
                            onChange={(e) => handleChange("cargo", e.target.value)}
                        />

                        <InputField
                            label={"Telefone"}
                            type={"text"}
                            placeholder={"(00) 00000-0000"}
                            required={true}
                            value={formValues.telefone}
                            onChange={(e) => handleChange("telefone", e.target.value)}
                        />

                        <div className="modal-actions">
                            <Button type="submit" colorido={true}>
                                Cadastrar funcionário
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
