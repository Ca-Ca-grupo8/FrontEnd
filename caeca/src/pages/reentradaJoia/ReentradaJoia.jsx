import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FormFlat } from "../../components/layout/FormFlat";
import formStyles from "../../components/layout/FormFlat.module.css";
import { InputField } from "../../components/ui/InputField";
import { SelectField } from "../../components/ui/SelectField";
import { Button } from "../../components/ui/Button";
import { emitirToast } from "../../utils/toastBus";
import { motivoApi } from "../../service/motivoApi";
import { movimentacaoApi } from "../../service/movimentacaoApi";
import { joiaApi } from "../../service/joiaApi";
import { revendedoraApi } from "../../service/revendedoraApi";
import { vendaApi } from "../../service/vendaApi";

export function ReentradaJoia() {
    const [motivos, setMotivos] = useState([]);
    const [joias, setJoias] = useState([]);
    const [revendedoras, setRevendedoras] = useState([]);
    const [joiasRevendedora, setJoiasRevendedora] = useState([]);

    const [formValues, setFormValues] = useState({
        motivoReentradaId: "",
        joiaId: "",
        quantidade: "",
        revendedoraId: "",
    });

    const motivoSelecionado = motivos.find(motivo => String(motivo.id) === formValues.motivoReentradaId);
    const nomeMotivoSelecionado = motivoSelecionado?.nome
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase() ?? "";
    const exibirRevendedora = nomeMotivoSelecionado.includes("retorno de consignacao");

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }))
    }

    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                const [listaMotivos, listaJoias, listaRevendedoras] = await Promise.all([
                    motivoApi?.listarMotivos() || [],
                    joiaApi.listarTodasJoias(),
                    revendedoraApi.listarRevendedorasMaletaAberta()
                ]);

                const motivosFiltrados = listaMotivos.filter(
                    motivo => motivo.tipoMovimentacao.nome === "REENTRADA" || motivo.tipoMovimentacao.id === 3
                );

                setMotivos(motivosFiltrados);
                setJoias(listaJoias);
                setRevendedoras(listaRevendedoras);
            } catch (error) {
                console.error("Erro ao carregar dados de inicialização:", error);
            }
        }

        carregarDadosIniciais();
    }, []);

    const handleMotivoChange = (value) => {
        setFormValues(prev => ({
            ...prev,
            motivoReentradaId: value,
            revendedoraId: "",
            joiaId: ""
        }))
    }

    const handleRevendedoraChange = (value) => {
        setFormValues(prev => ({
            ...prev,
            revendedoraId: value,
            joiaId: ""
        }))
    }

    useEffect(() => {
        if (!exibirRevendedora || !formValues.revendedoraId) return;

        async function carregarJoiasRevendedora() {
            try {
                const listaJoiasRevendedora = await vendaApi.listarJoiasSaidaRevendedora(Number(formValues.revendedoraId));
                setJoiasRevendedora(listaJoiasRevendedora);
            } catch (error) {
                console.error("Erro ao carregar joias da revendedora:", error);
            }
        }

        carregarJoiasRevendedora();
    }, [exibirRevendedora, formValues.revendedoraId]);

    const opcoesJoia = !exibirRevendedora
        ? joias
        : formValues.revendedoraId
            ? joiasRevendedora
            : [];

    const joiaSelecionadaRevendedora = exibirRevendedora
        ? joiasRevendedora.find(joia => String(joia.id) === formValues.joiaId)
        : undefined;
    const quantidadeMaxima = joiaSelecionadaRevendedora?.quantidade;

    const handleQuantidadeChange = (value) => {
        if (quantidadeMaxima !== undefined && value !== "") {
            if (!/^\d+$/.test(value) || Number(value) < 1) return;
            if (Number(value) > quantidadeMaxima) {
                handleChange("quantidade", String(quantidadeMaxima));
                return;
            }
        }
        handleChange("quantidade", value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (quantidadeMaxima !== undefined) {
            const quantidade = Number(formValues.quantidade);
            if (quantidade < 1 || quantidade > quantidadeMaxima) {
                emitirToast({ message: `A quantidade deve estar entre 1 e ${quantidadeMaxima}.`, type: "error" });
                return;
            }
        }

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
            idRevendedora: exibirRevendedora ? Number(formValues.revendedoraId) : null,
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
                revendedoraId: "",
            });
            return response;
        } catch (error) {
            console.error("Erro ao realizar reentrada:", error);
        }
    }

    const bloquearTeclasInvalidas = (e) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <FormFlat onSubmit={handleSubmit}>

            <SelectField
                data={motivos}
                label={"Motivo da reentrada"}
                value={formValues.motivoReentradaId}
                required={true}
                onChange={(e) => handleMotivoChange(e.target.value)}
            />

            {exibirRevendedora && (
                <SelectField
                    data={revendedoras}
                    label={"Revendedora"}
                    value={formValues.revendedoraId}
                    required={true}
                    onChange={(e) => handleRevendedoraChange(e.target.value)}
                />
            )}

            <SelectField
                data={opcoesJoia}
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
                min={quantidadeMaxima !== undefined ? 1 : 0}
                max={quantidadeMaxima}
                value={formValues.quantidade}
                onChange={(e) => handleQuantidadeChange(e.target.value)}
                onKeyDown={bloquearTeclasInvalidas}
            />

            <div className={formStyles.acoes}>
                <Button type={"submit"} colorido={true}>Realizar reentrada</Button>
                <span className={formStyles.link}>
                    <p>Nova joia?</p>
                    <Link to="/movimentacoes?fluxo=entrada">Cadastrar nova joia</Link>
                </span>
                <p className={formStyles.nota}>
                    <span className={formStyles.asterisco}>*</span> Campos obrigatórios
                </p>
            </div>
        </FormFlat>
    )
}
