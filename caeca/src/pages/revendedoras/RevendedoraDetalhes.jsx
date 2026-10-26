import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, MapPin, Phone, UserRound } from "lucide-react";
import { Pagination } from "../../components/ui/Pagination";
import { EditarRevendedoraModal } from "../../components/modals/EditarRevendedoraModal";
import { Button } from "../../components/ui/Button";
import { usuarioEhAdmin } from "../../utils/perfil";
import { obterIniciais } from "../../utils/obterIniciais";
import { MensagemPerfil, PerfilPessoa, TituloSecaoPerfil } from "../../components/ui/PerfilPessoa";
import { Table } from "../../components/ui/Table";
import { Toast } from "../../components/ui/Toast";
import { vendaApi } from "../../service/maletasApi";
import { revendedoraApi } from "../../service/revendedoraApi";
import { formatarData } from "../../utils/formatarData";
import { StatusMaletaBadge } from "../Maletas/StatusMaletaBadge";

const colunas = ["CÓDIGO", "DATA", "TOTAL (R$)", "REVENDEDORA", "STATUS"];
const POR_PAGINA = 10;

function formatarMoeda(valor) {
    if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return "-";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor));
}

function obterEndereco(revendedora) {
    const endereco = revendedora?.endereco;
    if (typeof endereco === "string") return endereco || "-";

    const logradouro = endereco?.logradouro ?? revendedora?.logradouro;
    const numero = endereco?.numero ?? revendedora?.numero;
    const complemento = endereco?.complemento ?? revendedora?.complemento;
    const bairro = endereco?.bairro ?? revendedora?.bairro;
    const cidade = endereco?.cidade ?? revendedora?.cidade;
    const uf = endereco?.uf ?? revendedora?.uf;
    const linha = [logradouro, numero].filter(Boolean).join(", ");
    const complementoBairro = [complemento, bairro].filter(Boolean).join(" - ");
    const cidadeEstado = [cidade, uf].filter(Boolean).join(" - ");

    return [linha, complementoBairro, cidadeEstado].filter(Boolean).join(", ") || "-";
}

function obterAtividade(revendedora) {
    if (typeof revendedora?.isAtivo === "boolean") return revendedora.isAtivo;
    if (typeof revendedora?.ativo === "boolean") return revendedora.ativo;

    const status = String(revendedora?.status ?? "").toLowerCase();
    if (["ativo", "ativa", "active"].includes(status)) return true;
    if (["inativo", "inativa", "inactive"].includes(status)) return false;
    return null;
}

export function RevendedoraDetalhes() {
    const { id } = useParams();
    const [revendedora, setRevendedora] = useState(null);
    const [vendas, setVendas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoVendas, setCarregandoVendas] = useState(false);
    const [erro, setErro] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [toast, setToast] = useState(null);
    const [editando, setEditando] = useState(false);
    const [versao, setVersao] = useState(0);

    useEffect(() => {
        let ignore = false;

        async function carregarRevendedora() {
            setCarregando(true);
            setErro(false);
            setRevendedora(null);

            try {
                const lista = await revendedoraApi.listarRevendedoras();
                const encontrada = lista.find((item) => String(item.id ?? item.idRevendedora) === id);
                if (!ignore) {
                    if (encontrada) {
                        setRevendedora(encontrada);
                    } else {
                        setErro(true);
                    }
                }
            } catch {
                if (!ignore) setErro(true);
            } finally {
                if (!ignore) setCarregando(false);
            }
        }

        carregarRevendedora();
        return () => { ignore = true; };
    }, [id, versao]);

    useEffect(() => {
        if (!revendedora?.nome) return undefined;
        let ignore = false;

        async function carregarVendas() {
            setCarregandoVendas(true);
            try {
                const pagina = await vendaApi.buscarMaletas({
                    nomeRevendedora: revendedora.nome,
                    page: paginaAtual - 1,
                    size: POR_PAGINA,
                    sort: "data,desc"
                });
                const idRevendedora = String(revendedora.id ?? revendedora.idRevendedora);
                const vendasDaRevendedora = (pagina.content ?? []).filter(
                    (venda) => String(venda.revendedora?.id ?? venda.revendedora?.idRevendedora) === idRevendedora
                );

                if (!ignore) {
                    setVendas(vendasDaRevendedora);
                    setTotalPaginas(pagina.totalPages ?? 1);
                }
            } catch {
                if (!ignore) setToast({ message: "Não foi possível carregar as vendas da revendedora." });
            } finally {
                if (!ignore) setCarregandoVendas(false);
            }
        }

        carregarVendas();
        return () => { ignore = true; };
    }, [revendedora, paginaAtual]);

    const atividade = useMemo(() => revendedora && obterAtividade(revendedora), [revendedora]);

    const funcaoRender = {
        render: (venda, coluna) => {
            switch (coluna) {
                case "CÓDIGO":
                    return venda.idMovimentacaoRevendedora ?? venda.id ?? "-";
                case "DATA":
                    return formatarData(venda.data);
                case "TOTAL (R$)":
                    return <strong>{formatarMoeda(venda.totalVenda)}</strong>;
                case "REVENDEDORA":
                    return venda.revendedora?.nome ?? revendedora.nome;
                case "STATUS":
                    return <StatusMaletaBadge status={venda.status} />;
                default:
                    return null;
            }
        }
    };

    const estado = carregando
        ? "Carregando informações da revendedora..."
        : erro || !revendedora
            ? "Não foi possível carregar a revendedora."
            : null;

    return (
        <>
            {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
            <PerfilPessoa
                titulo="Informações sobre a revendedora"
                ariaLabel="Dados da revendedora"
                estado={estado}
                acoes={usuarioEhAdmin() && revendedora && (
                    <Button type="button" colorido={false} onClick={() => setEditando(true)}>
                        Editar
                    </Button>
                )}
                icone={UserRound}
                iniciais={obterIniciais(revendedora?.nome)}
                nome={revendedora?.nome}
                ativo={atividade}
                textoStatus={{
                    ativo: "Revendedora ativa",
                    inativo: "Revendedora inativa",
                    indefinido: "Atividade não informada"
                }}
                dataCadastro={revendedora?.dataCadastro ?? null}
                contatos={revendedora ? [
                    { rotulo: "Email", valor: revendedora.email, href: revendedora.email && `mailto:${revendedora.email}`, icone: Mail },
                    { rotulo: "Endereço", valor: obterEndereco(revendedora), icone: MapPin },
                    { rotulo: "Telefone", valor: revendedora.telefone, href: revendedora.telefone && `tel:${revendedora.telefone}`, icone: Phone },
                    ...(revendedora.telefoneReserva
                        ? [{ rotulo: "Telefone reserva", valor: revendedora.telefoneReserva, href: `tel:${revendedora.telefoneReserva}`, icone: Phone }]
                        : [])
                ] : []}
                painel={revendedora && {
                    titulo: "Atividade recente",
                    rotulo: "Cadastro realizado em",
                    valor: formatarData(revendedora.dataCadastro)
                }}
            >
                <TituloSecaoPerfil>Maletas relacionadas</TituloSecaoPerfil>
                {carregandoVendas ? (
                    <MensagemPerfil>Carregando vendas...</MensagemPerfil>
                ) : vendas.length > 0 ? (
                    <Table colunas={colunas} funcaoRender={funcaoRender} data={vendas} />
                ) : (
                    <MensagemPerfil>Nenhuma venda encontrada para esta revendedora.</MensagemPerfil>
                )}
                <Pagination
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    aoMudarPagina={setPaginaAtual}
                />
            </PerfilPessoa>
            <EditarRevendedoraModal
                isOpen={editando}
                onClose={() => setEditando(false)}
                revendedora={revendedora}
                id={id}
                onAtualizar={() => setVersao((v) => v + 1)}
            />
        </>
    );
}
