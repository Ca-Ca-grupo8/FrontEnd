import { useEffect, useState } from "react";
import CardForm from "../../components/layout/CardForm";
import { SucessoModal } from "../../components/modals/SucessoModal";
import { Button } from "../../components/ui/Button";
import { InputField } from "../../components/ui/InputField";
import { PageHeader } from "../../components/ui/PageHeader";
import { SelectField } from "../../components/ui/SelectField";
import { Toast } from "../../components/ui/Toast";
import { enderecoApi } from "../../service/enderecoApi";
import { revendedoraApi } from "../../service/revendedoraApi";
import { buscarEnderecoPorCep } from "../../service/viacepApi";
import styles from "./CadastroRevendedora.module.css";

const initialValues = {
    nome: "",
    email: "",
    dataNascimento: "",
    telefone: "",
    telefoneReserva: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: ""
};

const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
].map((uf) => ({ id: uf, nome: uf }));

export function CadastroRevendedora() {
    const [formValues, setFormValues] = useState(initialValues);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLookingUpCep, setIsLookingUpCep] = useState(false);
    const [cepLookupMessage, setCepLookupMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [savedAddress, setSavedAddress] = useState(null);
    const cepDigits = formValues.cep.replace(/\D/g, "");

    useEffect(() => {
        if (cepDigits.length !== 8) {
            return;
        }

        const controller = new AbortController();

        buscarEnderecoPorCep(cepDigits, { signal: controller.signal })
            .then((address) => {
                if (address.erro) {
                    setCepLookupMessage("CEP não encontrado.");
                    return;
                }

                setFormValues((currentValues) => ({
                    ...currentValues,
                    logradouro: address.logradouro || "",
                    bairro: address.bairro || "",
                    cidade: address.localidade || "",
                    uf: address.uf || ""
                }));
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    setCepLookupMessage("Não foi possível consultar o CEP.");
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLookingUpCep(false);
                }
            });

        return () => controller.abort();
    }, [cepDigits]);

    const handleChange = (field, value) => {
        if (field === "cep") {
            setIsLookingUpCep(value.replace(/\D/g, "").length === 8);
            setCepLookupMessage("");
        }
        setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const telefoneDigits = formValues.telefone.replace(/\D/g, "");

        if (telefoneDigits.length !== 11) {
            setErrorMessage("O telefone deve conter DDD e 9 dígitos (11 números).");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        const endereco = {
            cep: cepDigits,
            logradouro: formValues.logradouro,
            numero: Number(formValues.numero),
            complemento: formValues.complemento || null,
            bairro: formValues.bairro,
            cidade: formValues.cidade,
            uf: formValues.uf
        };
        const enderecoKey = JSON.stringify(endereco);

        try {
            let enderecoId = savedAddress?.key === enderecoKey ? savedAddress.id : null;

            if (enderecoId === null) {
                const enderecoCriado = await enderecoApi.criarEndereco(endereco);
                enderecoId = Number(enderecoCriado.id ?? enderecoCriado.enderecoId);

                if (!Number.isInteger(enderecoId)) {
                    throw new Error("O servidor não retornou o ID do endereço cadastrado.");
                }

                setSavedAddress({ key: enderecoKey, id: enderecoId });
            }

            await revendedoraApi.criarRevendedora({
                nome: formValues.nome,
                email: formValues.email,
                dataNascimento: formValues.dataNascimento || null,
                telefone: telefoneDigits,
                telefoneReserva: formValues.telefoneReserva || null,
                enderecoId
            });
            setFormValues(initialValues);
            setSavedAddress(null);
            setIsSuccess(true);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || error.message || "Não foi possível concluir o cadastro. Tente novamente."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <PageHeader titulo="Cadastro de revendedora" />

            <div className={styles.formulario}>
                <CardForm onSubmit={handleSubmit}>
                    <InputField
                        label="Nome da revendedora"
                        type="text"
                        placeholder="Ex.: Ana Beatriz"
                        required
                        value={formValues.nome}
                        onChange={(event) => handleChange("nome", event.target.value)}
                    />
                    <InputField
                        label="Email"
                        type="email"
                        placeholder="ana@email.com"
                        required
                        value={formValues.email}
                        onChange={(event) => handleChange("email", event.target.value)}
                    />
                    <InputField
                        label="Data de nascimento"
                        type="date"
                        required
                        value={formValues.dataNascimento}
                        onChange={(event) => handleChange("dataNascimento", event.target.value)}
                    />
                    <InputField
                        label="Telefone"
                        type="tel"
                        placeholder="Ex: (11) 97798-0930"
                        required
                        value={formValues.telefone}
                        onChange={(event) => handleChange("telefone", event.target.value)}
                    />
                    <InputField
                        label="Telefone reserva"
                        type="tel"
                        placeholder="Ex.: (11) 97798-0930"
                        value={formValues.telefoneReserva}
                        onChange={(event) => handleChange("telefoneReserva", event.target.value)}
                    />
                    <div className={styles.cepField}>
                        <InputField
                            label="CEP"
                            type="text"
                            placeholder="00000-000"
                            required
                            value={formValues.cep}
                            onChange={(event) => handleChange("cep", event.target.value)}
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
                        label="Logradouro"
                        type="text"
                        placeholder="Ex.: Rua das Flores"
                        required
                        value={formValues.logradouro}
                        onChange={(event) => handleChange("logradouro", event.target.value)}
                    />
                    <InputField
                        label="Número"
                        type="number"
                        placeholder="123"
                        required
                        value={formValues.numero}
                        onChange={(event) => handleChange("numero", event.target.value)}
                    />
                    <InputField
                        label="Complemento"
                        type="text"
                        placeholder="Ex.: Apartamento 12"
                        value={formValues.complemento}
                        onChange={(event) => handleChange("complemento", event.target.value)}
                    />
                    <InputField
                        label="Bairro"
                        type="text"
                        placeholder="Ex.: Centro"
                        required
                        value={formValues.bairro}
                        onChange={(event) => handleChange("bairro", event.target.value)}
                    />
                    <InputField
                        label="Cidade"
                        type="text"
                        placeholder="Ex.: São Paulo"
                        required
                        value={formValues.cidade}
                        onChange={(event) => handleChange("cidade", event.target.value)}
                    />
                    <div className={styles.ufField}>
                        <SelectField
                            data={estados}
                            label="UF"
                            value={formValues.uf}
                            required
                            onChange={(event) => handleChange("uf", event.target.value)}
                        />
                    </div>
                    <div className="card-form-actions">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Cadastrando..." : "Cadastrar revendedora"}
                        </Button>
                    </div>
                </CardForm>
            </div>

            <SucessoModal
                text="Cadastro realizado com sucesso!"
                IsSuccess={isSuccess}
                onClose={() => setIsSuccess(false)}
            />
            {errorMessage && <Toast message={errorMessage} onClose={() => setErrorMessage("")} />}
        </div>
    );
}