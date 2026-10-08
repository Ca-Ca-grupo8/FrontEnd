import { useState } from "react";
import { usuarioApi } from "../../service/usuarioApi";
import { InputField } from "../ui/InputField";
import { SelectField } from "../ui/SelectField";
import { Button } from "../ui/Button";
import { SucessoModal } from "./SucessoModal";

const OPCOES_PERFIL = [
    { id: "ROLE_USER", nome: "Funcionário" },
    { id: "ROLE_ADMIN", nome: "Administrador" },
];

export function NovoFuncionarioModal({ isOpen, onClose }) {
    const [formValues, setFormValues] = useState({
        nome: "",
        email: "",
        senha: "",
        perfilUsuario: "",
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
            await usuarioApi.criarUsuario({
                nome: formValues.nome,
                email: formValues.email,
                senha: formValues.senha,
                perfilUsuario: formValues.perfilUsuario,
            });

            setFormValues({ nome: "", email: "", senha: "", perfilUsuario: "" });
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
                        <p>Cadastre alguém e escolha o que ele pode fazer no sistema.</p>
                    </div>

                    {erro && (
                        <p style={{ color: '#D92D20', fontSize: '14px', textAlign: 'center', margin: '8px 0' }}>
                            {erro}
                        </p>
                    )}

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

                        <InputField
                            label={"Senha"}
                            type={"password"}
                            placeholder={"De 6 a 20 caracteres"}
                            required={true}
                            value={formValues.senha}
                            onChange={(e) => handleChange("senha", e.target.value)}
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
                </div>
            </div>
        </>
    );
}