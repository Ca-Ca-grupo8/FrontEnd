import { useEffect, useState } from "react";
import CardForm from "../../components/layout/CardForm";
import { InputField } from "../../components/ui/InputField";
import { SelectField } from "../../components/ui/SelectField";
import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { emitirToast } from "../../utils/toastBus";
import { motivoApi } from "../../service/motivoApi";
import { movimentacaoApi } from "../../service/movimentacaoApi";
import { joiaApi } from "../../service/joiaApi";
import "./ReentradaJoia.module.css";

export function ReentradaJoia() {
    const [motivos, setMotivos] = useState([]);
    const [joias, setJoias] = useState([]);

    const [formValues, setFormValues] = useState({
        motivoReentradaId: "",
        joiaId: "",
        quantidade: "",
    });

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }))
    }

    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                const [listaMotivos, listaJoias] = await Promise.all([
                    motivoApi?.listarMotivos() || [],
                    joiaApi.listarTodasJoias()
                ]);

                const motivosFiltrados = listaMotivos.filter(
                    motivo => motivo.tipoMovimentacao.nome === "REENTRADA" || motivo.tipoMovimentacao.id === 3
                );

                setMotivos(motivosFiltrados);
                setJoias(listaJoias);
            } catch (error) {
                console.error("Erro ao carregar dados de inicialização:", error);
            }
        }

        carregarDadosIniciais();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        // ATENÇÃO (validar com backend): esta tela não coleta fornecedor,
        // preço de custo, preço do banho nem multiplicador - diferente de
        // EntradaJoia/EntradaJoiaExistente. Estou enviando 0 / 0.0 para
        // esses campos por padrão, assumindo que o backend aceita reentrada
        // sem esses dados (já cadastrados quando a joia entrou pela primeira
        // vez). Se o endpoint /movimentacoes exigir esses valores para uma
        // REENTRADA, isso precisa ser ajustado.
        const payload = {
            idMotivoMovimentacao: Number(formValues.motivoReentradaId) || 0,
            idJoia: Number(formValues.joiaId) || 0,
            quantidade: Number(formValues.quantidade) || 0,
            idRevendedora: null,
            dadosNovaJoia: null,
            precoBanho: null,
            precoCompraRevendedor: null,
            multiplicador: null,
            idFornecedor: null
        }

        realizarReentrada(payload);
    }

    async function realizarReentrada(payload) {
        try {
            const response = await movimentacaoApi.realizarMovimentacao(payload, null);
            emitirToast({ message: "Reentrada realizada com sucesso!", type: "success" });
            setFormValues({
                motivoReentradaId: "",
                joiaId: "",
                quantidade: "",
            });
            return response;
        } catch (error) {
            console.error("Erro ao realizar reentrada:", error);
        }
    }

    return (
        <>
            <PageHeader titulo={"Reentrada de joias"} />

            <CardForm onSubmit={handleSubmit}>

                <SelectField
                    data={motivos}
                    label={"Motivo da reentrada"}
                    value={formValues.motivoReentradaId}
                    required={true}
                    onChange={(e) => handleChange("motivoReentradaId", e.target.value)}
                />

                <SelectField
                    data={joias}
                    label={"Joia"}
                    value={formValues.joiaId}
                    required={true}
                    onChange={(e) => handleChange("joiaId", e.target.value)}
                />

                <InputField
                    label={"Quantidade"}
                    type={"number"}
                    placeholder={"Value"}
                    required={true}
                    value={formValues.quantidade}
                    onChange={(e) => handleChange("quantidade", e.target.value)}>
                </InputField>

                <div className="card-form-actions">
                    <Button type={"submit"} colorido={true}>Realizar reentrada</Button>
                    <span className="card-form-link">
                        <p>Nova joia?</p>
                        <a href="/movimentacoes/entrada">Cadastrar nova joia</a>
                    </span>
                    <p className="required-fields-note">
                        <span className="required-asterisk">*</span> Campos obrigatórios
                    </p>
                </div>
            </CardForm>
        </>
    )
}