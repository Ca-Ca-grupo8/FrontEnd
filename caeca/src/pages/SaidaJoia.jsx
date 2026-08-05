import { useEffect, useState } from "react";
import CardForm from "../components/layout/CardForm";
import { InputField } from "../components/ui/InputField";
import { SelectField } from "../components/ui/SelectField";
import { Button } from "../components/ui/Button";
import { Header } from "../components/layout/Header";
import { PageHeader } from "../components/ui/PageHeader";
import { Footer } from "../components/layout/Footer";
import { CirclePlus } from "lucide-react";
import { SucessoModal } from "../components/modals/SucessoModal";

// Substitua pelas APIs reais do seu projeto
import { movimentacaoApi } from "../service/movimentacaoApi";
import { joiaApi } from "../service/joiaApi";
import { revendedoraApi } from "../service/revendedoraApi";
import { motivoApi } from "../service/motivoApi";

import '../styles/EntradaJoia.css'; // Reaproveitando os estilos base de formulário
import { NovaCategoriaModal } from "../components/modals/NovaCategoriaModal";
import { NovaRevendedoraModal } from "../components/modals/NovaRevendedora";

export function SaidaJoia() {
    const [motivos, setMotivos] = useState([]);
    const [joias, setJoias] = useState([]);
    const [revendedoras, setRevendedoras] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const [isRevendedoraOpen, setIsRevendedoraOpen] = useState(false);
    const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);


    const [formValues, setFormValues] = useState({
        motivoSaidaId: "",
        joiaId: "",
        quantidade: "",
        revendedoraId: ""
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
                    joiaApi?.listarJoias() || [],
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            idMotivoMovimentacao: Number(formValues.motivoSaidaId) || 0,
            idJoia: Number(formValues.joiaId) || 0,
            quantidade: Number(formValues.quantidade) || 0,
            idRevendedora: formValues.revendedoraId ? Number(formValues.revendedoraId) : null,
            dadosNovaJoia: null,
            precoBanho: null,
            precoCompraRevendedor: null,
            multiplicador: null,
            idFornecedor: null
        };

        try {
            await movimentacaoApi.realizarMovimentacao(payload);
            setIsSuccess(true);
            setFormValues({
                motivoSaidaId: "",
                joiaId: "",
                quantidade: "",
                revendedoraId: ""
            });
        } catch (error) {
            console.error("Erro ao realizar a saída da joia:", error);
        }
    };

    return (
        <>
            <div className="page-wrapper">

                <Header />
                <main className="main-content">
                    <PageHeader titulo={"Saída de jóias"}>
                        <Button type={"button"} colorido={false} onClick={() => setIsCategoriaOpen(true)}>
                            Cadastrar nova categoria
                        </Button>
                    </PageHeader>

                    <NovaCategoriaModal
                        isOpen={isCategoriaOpen}
                        onClose={() => setIsCategoriaOpen(false)} />

                    <SucessoModal
                        text={"Saída registrada com sucesso!"}
                        IsSuccess={isSuccess}
                        onClose={() => setIsSuccess(false)}
                    />

                    <NovaRevendedoraModal
                                    isOpen={isRevendedoraOpen}
                                    onClose={() => setIsRevendedoraOpen(false)} />

                    <CardForm onSubmit={handleSubmit}>

                        <SelectField
                            data={motivos}
                            label={"Motivo da saída"}
                            value={formValues.motivoSaidaId}
                            required={true}
                            onChange={(e) => handleChange("motivoSaidaId", e.target.value)}
                        />
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
                            value={formValues.quantidade}
                            onChange={(e) => handleChange("quantidade", e.target.value)}
                        />


                        <div className="card-form-actions">
                            <Button type={"submit"} colorido={true}>
                                Realizar saída
                            </Button>
                        </div>
                    </CardForm>
                </main>


                <Footer />
            </div>
        </>
    );
}