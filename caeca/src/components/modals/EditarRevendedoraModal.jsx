import { useEffect, useState } from "react";
import "../../styles/novaCategoria.css";
import "./EditarRevendedoraModal.css";
import { revendedoraApi } from "../../service/revendedoraApi";
import { enderecoApi } from "../../service/enderecoApi";
import { buscarEnderecoPorCep } from "../../service/viacepApi";
import { InputField } from "../ui/InputField";
import { SelectField } from "../ui/SelectField";
import { Button } from "../ui/Button";
import { emitirToast } from "../../utils/toastBus";
import styles from "../../pages/revendedoras/CadastroRevendedora.module.css";

const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
].map((uf) => ({ id: uf, nome: uf }));

const enderecoVazio = {
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: ""
};

// Só é montado enquanto o modal está aberto, então o formulário
// reinicia com os dados da revendedora a cada abertura.
function FormEditarRevendedora({ revendedora, id, onSalvo, editarEndereco, onAlternarEndereco }) {
    const [formValues, setFormValues] = useState({
        nome: revendedora.nome || "",
        email: revendedora.email || "",
        dataNascimento: revendedora.dataNascimento?.slice(0, 10) || "",
        telefone: revendedora.telefone || "",
        telefoneReserva: revendedora.telefoneReserva || "",
    });
    const [endereco, setEndereco] = useState(enderecoVazio);
    const [isLookingUpCep, setIsLookingUpCep] = useState(false);
    const [cepLookupMessage, setCepLookupMessage] = useState("");
    const cepDigits = endereco.cep.replace(/\D/g, "");
    const revendedoraEstaAtiva = (revendedora.isAtivo ?? revendedora.ativo) !== false;

    useEffect(() => {
        if (!editarEndereco || cepDigits.length !== 8) {
            return;
        }

        let ignorar = false;

        buscarEnderecoPorCep(cepDigits)
            .then((dados) => {
                if (ignorar) return;
                if (dados.erro) {
                    setCepLookupMessage("CEP não encontrado.");
                    return;
                }

                setEndereco((atual) => ({
                    ...atual,
                    logradouro: dados.logradouro || "",
                    bairro: dados.bairro || "",
                    cidade: dados.localidade || "",
                    uf: dados.uf || ""
                }));
            })
            .catch(() => {
                if (!ignorar) setCepLookupMessage("Não foi possível consultar o CEP.");
            })
            .finally(() => {
                if (!ignorar) setIsLookingUpCep(false);
            });

        return () => { ignorar = true; };
    }, [cepDigits, editarEndereco]);

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEnderecoChange = (field, value) => {
        if (field === "cep") {
            setIsLookingUpCep(value.replace(/\D/g, "").length === 8);
            setCepLookupMessage("");
        }
        setEndereco(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAlterarStatus = async () => {
        const acao = revendedoraEstaAtiva ? "inativar" : "ativar";
        const confirmar = window.confirm(
            `Deseja ${acao} a revendedora "${formValues.nome}"?`
        );
        if (!confirmar) return;

        try {
            await revendedoraApi.alterarStatusRevendedora(id, !revendedoraEstaAtiva);
            emitirToast({ message: `Revendedora "${formValues.nome}" ${acao === "ativar" ? "ativada" : "inativada"}.`, type: "success" });
            onSalvo();
        } catch {
            // Erro exibido pelo interceptor global.
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const telefoneDigits = formValues.telefone.replace(/\D/g, "");
        if (telefoneDigits.length !== 11) {
            emitirToast({ message: "O telefone deve conter DDD e 9 dígitos (11 números).", type: "error" });
            return;
        }

        try {
            const payload = {
                nome: formValues.nome,
                email: formValues.email,
                dataNascimento: formValues.dataNascimento || null,
                telefone: telefoneDigits,
                telefoneReserva: formValues.telefoneReserva.replace(/\D/g, "") || null,
            };

            if (editarEndereco) {
                const enderecoCriado = await enderecoApi.criarEndereco({
                    cep: cepDigits,
                    logradouro: endereco.logradouro,
                    numero: Number(endereco.numero),
                    complemento: endereco.complemento || null,
                    bairro: endereco.bairro,
                    cidade: endereco.cidade,
                    uf: endereco.uf
                });

                const enderecoId = Number(enderecoCriado.id ?? enderecoCriado.enderecoId);
                if (!Number.isInteger(enderecoId)) {
                    throw new Error("O servidor não retornou o ID do endereço cadastrado.");
                }

                payload.enderecoId = enderecoId;
            }

            await revendedoraApi.editarRevendedora(id, payload);

            emitirToast({ message: "Revendedora atualizada com sucesso!", type: "success" });
            onSalvo();
        } catch (error) {
            if (!error.response) {
                emitirToast({
                    message: error.message || "Não foi possível atualizar a revendedora.",
                    type: "error"
                });
            }
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

            <label className="modal-checkbox">
                <input
                    type="checkbox"
                    checked={editarEndereco}
                    onChange={(e) => onAlternarEndereco(e.target.checked)}
                />
                Editar endereço
            </label>

            {editarEndereco && (
                <div className="endereco-grid">
                    <div className={styles.cepField}>
                        <InputField
                            label={"CEP"}
                            type={"text"}
                            placeholder={"00000-000"}
                            required={true}
                            value={endereco.cep}
                            onChange={(e) => handleEnderecoChange("cep", e.target.value)}
                        />
                        {(isLookingUpCep || cepLookupMessage) && (
                            <span
                                className={`${styles.cepStatus} ${cepLookupMessage ? styles.cepError : ""}`}
                                role="status"
                                aria-live="polite"
                            >
                                {isLookingUpCep ? "Consultando CEP..." : cepLookupMessage}
                            </span>
                        )}
                    </div>

                    <InputField
                        label={"Logradouro"}
                        type={"text"}
                        placeholder={"Ex.: Rua das Flores"}
                        required={true}
                        value={endereco.logradouro}
                        onChange={(e) => handleEnderecoChange("logradouro", e.target.value)}
                    />

                    <InputField
                        label={"Número"}
                        type={"number"}
                        placeholder={"123"}
                        required={true}
                        value={endereco.numero}
                        onChange={(e) => handleEnderecoChange("numero", e.target.value)}
                    />

                    <InputField
                        label={"Complemento"}
                        type={"text"}
                        placeholder={"Ex.: Apartamento 12"}
                        value={endereco.complemento}
                        onChange={(e) => handleEnderecoChange("complemento", e.target.value)}
                    />

                    <InputField
                        label={"Bairro"}
                        type={"text"}
                        placeholder={"Ex.: Centro"}
                        required={true}
                        value={endereco.bairro}
                        onChange={(e) => handleEnderecoChange("bairro", e.target.value)}
                    />

                    <InputField
                        label={"Cidade"}
                        type={"text"}
                        placeholder={"Ex.: São Paulo"}
                        required={true}
                        value={endereco.cidade}
                        onChange={(e) => handleEnderecoChange("cidade", e.target.value)}
                    />

                    <SelectField
                        data={estados}
                        label={"UF"}
                        value={endereco.uf}
                        required={true}
                        onChange={(e) => handleEnderecoChange("uf", e.target.value)}
                    />
                </div>
            )}

            <div className="modal-actions">
                <Button type="submit" colorido={true}>
                    Salvar alterações
                </Button>
            </div>

            <div className="modal-actions">
                <Button type="button" colorido={false} onClick={handleAlterarStatus}>
                    {revendedoraEstaAtiva ? "Inativar revendedora" : "Ativar revendedora"}
                </Button>
            </div>
        </form>
    );
}

// Só é montado enquanto o modal está aberto, então o checkbox de endereço
// começa desmarcado a cada abertura.
function ModalEditarRevendedora({ onClose, revendedora, id, onAtualizar }) {
    const [editarEndereco, setEditarEndereco] = useState(false);

    const handleSalvo = () => {
        onAtualizar?.();
        onClose();
    };

    const classeContainer = editarEndereco
        ? "modal-container modal-container--largo"
        : "modal-container";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={classeContainer} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>

                <div className="modal-header">
                    <h2>Editar revendedora</h2>
                    <p>Atualize as informações da revendedora selecionada.</p>
                </div>

                <FormEditarRevendedora
                    revendedora={revendedora}
                    id={id}
                    onSalvo={handleSalvo}
                    editarEndereco={editarEndereco}
                    onAlternarEndereco={setEditarEndereco}
                />
            </div>
        </div>
    );
}

export function EditarRevendedoraModal({ isOpen, onClose, revendedora, id, onAtualizar }) {
    if (!isOpen || !revendedora) return null;

    return (
        <ModalEditarRevendedora
            onClose={onClose}
            revendedora={revendedora}
            id={id}
            onAtualizar={onAtualizar}
        />
    );
}
