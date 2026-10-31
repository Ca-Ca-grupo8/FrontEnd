import { useEffect, useState } from "react";
import { FormFlat } from "../components/layout/FormFlat";
import formStyles from "../components/layout/FormFlat.module.css";
import { InputField } from "../components/ui/InputField";
import { SelectField } from "../components/ui/SelectField";
import { Button } from "../components/ui/Button";
import { emitirToast } from "../utils/toastBus";

// Substitua pelas APIs reais do seu projeto
import { movimentacaoApi } from "../service/movimentacaoApi";
import { joiaApi } from "../service/joiaApi";
import { revendedoraApi } from "../service/revendedoraApi";
import { motivoApi } from "../service/motivoApi";

import '../styles/EntradaJoia.css'; // Reaproveitando os estilos base de formulário
import { NovaRevendedoraModal } from "../components/modals/NovaRevendedora";

export function SaidaJoia({ sugestao }) {
    const [motivos, setMotivos] = useState([]);
    const [joias, setJoias] = useState([]);
    const [revendedoras, setRevendedoras] = useState([]);

    const [isRevendedoraOpen, setIsRevendedoraOpen] = useState(false);


    const [formValues, setFormValues] = useState({
        motivoSaidaId: "",
        joiaId: "",
        quantidade: "",
        revendedoraId: "",
        dataLimite: ""
    });

    const handleChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    useEffect(() => {
        async function carregarDadosIniciais() {
            try {
                // Ajuste as chamadas de API conforme seus endpoints reais
                const [listaMotivos, listaJoias, listaRevendedoras] = await Promise.all([
                    motivoApi?.listarMotivos() || [],
                    joiaApi?.listarTodasJoias() || [],
                    revendedoraApi?.listarRevendedoras() || []
                ]);

                const motivosFiltrados = listaMotivos.filter(
                    motivo => motivo.tipoMovimentacao.nome === "SAIDA" || motivo.tipoMovimentacao.id === 2
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

    const [sugestaoAplicada, setSugestaoAplicada] = useState(null);

    if (sugestao && sugestao !== sugestaoAplicada) {
        setSugestaoAplicada(sugestao);
        setFormValues(prev => ({
            ...prev,
            joiaId: String(sugestao.joia.idJoia),
            motivoSaidaId: String(sugestao.joia.idMotivo),
            quantidade: String(sugestao.joia.quantidadeMedia)
        }));
    }

    const motivoSelecionado = motivos.find(m => String(m.id) === formValues.motivoSaidaId);

    const exibirCamposRevendedora = !!motivoSelecionado &&
        /maleta|revendedora/i.test(motivoSelecionado.nome);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            idMotivoMovimentacao: Number(formValues.motivoSaidaId) || 0,
            idJoia: Number(formValues.joiaId) || 0,
            quantidade: Number(formValues.quantidade) || 0,
            idRevendedora: formValues.revendedoraId ? Number(formValues.revendedoraId) : null,
            dataLimite: formValues.dataLimite ? formValues.dataLimite + "T00:00:00" : null,
            dadosNovaJoia: null,
            precoBanho: null,
            precoCompraRevendedor: null,
            multiplicador: null,
            idFornecedor: null
        };

        try {
            await movimentacaoApi.realizarMovimentacao(payload);
            emitirToast({ message: "Saída registrada com sucesso!", type: "success" });
            setFormValues({
                motivoSaidaId: "",
                joiaId: "",
                quantidade: "",
                revendedoraId: "",
                dataLimite: ""
            });
        } catch (error) {
            console.error("Erro ao realizar a saída da joia:", error);
        }
    };

    const bloquearTeclasInvalidas = (e) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <>
            <NovaRevendedoraModal
                isOpen={isRevendedoraOpen}
                onClose={() => setIsRevendedoraOpen(false)} />

            <FormFlat onSubmit={handleSubmit}>

                <SelectField
                    data={motivos}
                    label={"Motivo da saída"}
                    value={formValues.motivoSaidaId}
                    required={true}
                    onChange={(e) => handleChange("motivoSaidaId", e.target.value)}
                />
                {exibirCamposRevendedora && (
                    <>
                        <div className="input-with-action">
                            <SelectField
                                data={revendedoras}
                                label={"Revendedora"}
                                value={formValues.revendedoraId}
                                required={false}
                                onChange={(e) => handleChange("revendedoraId", e.target.value)}
                            />

                            {/* <div className="add-fornecedor-container">
                                <CirclePlus
                                    className="add-fornecedor-content"
                                    onClick={() => setIsRevendedoraOpen(true)}
                                />
                            </div> */}
                        </div>

                        <InputField
                            label={"Data limite"}
                            type={"date"}
                            required={false}
                            value={formValues.dataLimite}
                            onChange={(e) => handleChange("dataLimite", e.target.value)}
                        />
                    </>
                )}

                <SelectField
                    data={joias}
                    label={"Jóia"}
                    value={formValues.joiaId}
                    required={true}
                    onChange={(e) => handleChange("joiaId", e.target.value)}
                />

                <InputField
                    label={"Quantidade"}
                    type={"number"}
                    placeholder={"Ex: 10"}
                    required={true}
                    min="0"
                    value={formValues.quantidade}
                    onChange={(e) => handleChange("quantidade", e.target.value)}
                    onKeyDown={bloquearTeclasInvalidas}
                />

                <div className={formStyles.acoes}>
                    <Button type={"submit"} colorido={true}>
                        Realizar saída
                    </Button>
                </div>
            </FormFlat>
        </>
    );
}
