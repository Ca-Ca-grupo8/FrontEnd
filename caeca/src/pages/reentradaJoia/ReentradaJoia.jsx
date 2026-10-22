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
import { revendedoraApi } from "../../service/revendedoraApi";
import { vendaApi } from "../../service/vendaApi";
import styles from "./ReentradaJoia.module.css";

export function ReentradaJoia() {
    const [motivos, setMotivos] = useState([]);
    const [joias, setJoias] = useState([]);
    const [revendedoras, setRevendedoras] = useState([]);
    const [joiasRevendedora, setJoiasRevendedora] = useState([]);
    const [carregandoJoiasRevendedora, setCarregandoJoiasRevendedora] = useState(false);

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
        let ignorar = false;

        setJoiasRevendedora([]);

        if (!exibirRevendedora || !formValues.revendedoraId) {
            setCarregandoJoiasRevendedora(false);
            return () => {
                ignorar = true;
            };
        }

        setCarregandoJoiasRevendedora(true);

        async function carregarJoiasRevendedora() {
            try {
                const lista = await vendaApi.listarJoiasSaidaRevendedora(
                    Number(formValues.revendedoraId)
                );

                if (!ignorar) setJoiasRevendedora(lista);
            } catch (error) {
                if (!ignorar) console.error("Erro ao carregar joias da revendedora:", error);
            } finally {
                if (!ignorar) setCarregandoJoiasRevendedora(false);
            }
        }

        carregarJoiasRevendedora();

        return () => {
            ignorar = true;
        };
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

        const quantidade = Number(formValues.quantidade);

        if (
            !Number.isInteger(quantidade) ||
            quantidade < 1 ||
            (quantidadeMaxima !== undefined && quantidade > quantidadeMaxima)
        ) {
            emitirToast({
                message: quantidadeMaxima !== undefined
                    ? `Informe uma quantidade entre 1 e ${quantidadeMaxima}.`
                    : "Informe uma quantidade inteira maior que zero.",
                type: "error",
            });
            return;
        }

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

    return (
        <>
            <PageHeader titulo={"Reentrada de joias"} />

            <CardForm onSubmit={handleSubmit}>

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
                    label="Joia"
                    value={formValues.joiaId}
                    required
                    disabled={
                        exibirRevendedora &&
                        (carregandoJoiasRevendedora ||
                            !formValues.revendedoraId ||
                            opcoesJoia.length === 0)
                    }
                    placeholder={
                        carregandoJoiasRevendedora
                            ? "Carregando joias..."
                            : exibirRevendedora && !formValues.revendedoraId
                                ? "Selecione uma revendedora primeiro"
                                : exibirRevendedora && opcoesJoia.length === 0
                                    ? "Nenhuma joia disponível"
                                    : "Selecione..."
                    }
                    onChange={(e) => handleChange("joiaId", e.target.value)}
                />

                <InputField
                    label="Quantidade"
                    type="number"
                    placeholder="Ex.: 1"
                    required
                    min={1}
                    max={quantidadeMaxima}
                    step={1}
                    value={formValues.quantidade}
                    onChange={(e) => handleQuantidadeChange(e.target.value)}
                />

                <div className="card-form-actions">
                    <Button type={"submit"} colorido={true}>Realizar reentrada</Button>
                    <span className="card-form-link">
                        <p>Nova joia?</p>
                        <a href="/movimentacoes/entrada">Cadastrar nova joia</a>
                    </span>
                    <p className={styles["required-fields-note"]}>
                        <span className={styles["required-asterisk"]}>*</span> Campos obrigatórios
                    </p>
                </div>
            </CardForm>
        </>
    )
}