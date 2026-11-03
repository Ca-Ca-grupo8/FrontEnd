import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Table } from '../../components/ui/Table'
import { vendaApi } from '../../service/maletasApi'
import { emitirToast } from '../../utils/toastBus'
import { rotuloStatusMaleta, statusSelecionavel, transicaoMaletaPermitida } from './maletaStatus'
import { StatusMaletaBadge } from './StatusMaletaBadge'
import { TipoMovimentacaoBadge } from './TipoMovimentacaoBadge'
import { usuarioEhAdmin } from '../../utils/perfil'
import { useConfirmacao } from '../../hooks/useConfirmacao'
import { ConfirmarAcaoModal } from '../../components/modals/ConfirmarAcaoModal'
import { contarItens, ehReentrada } from './tipoMovimentacao'
import '../entradaJoia/JoiaDetalhes.css'
import style from './Maletas.module.css'

const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

const valorOuTraco = (valor) => (valor ? formatarMoeda(valor) : '-')

const quantidadeLinha = (movimentacao) => movimentacao.quantidade || '-'

const precoLinha = (movimentacao) =>
    ehReentrada(movimentacao) ? '-' : valorOuTraco(movimentacao.precoSaida)

const subtotalLinha = (movimentacao) => {
    if (ehReentrada(movimentacao)) {
        return '-'
    }

    return valorOuTraco((movimentacao.quantidade ?? 0) * (movimentacao.precoSaida ?? 0))
}

const formatarData = (dataStr) => {
    if (!dataStr) {
        return '-'
    }

    const data = new Date(dataStr)
    if (Number.isNaN(data.getTime())) {
        return '-'
    }

    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(data)
}

export function MaletaDetalhes() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [maleta, setMaleta] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(false)
    const [statusDisponiveis, setStatusDisponiveis] = useState([])
    const [salvandoStatus, setSalvandoStatus] = useState(false)
    const confirmacao = useConfirmacao()

    useEffect(() => {
        let ignore = false
        async function carregar() {
            try {
                const dados = await vendaApi.buscarPorId(id)
                if (!ignore) setMaleta(dados)
            } catch {
                if (!ignore) setErro(true)
            } finally {
                if (!ignore) setCarregando(false)
            }
        }
        carregar()
        return () => { ignore = true }
    }, [id])

    useEffect(() => {
        let ignore = false
        async function carregarStatus() {
            try {
                const lista = await vendaApi.listarStatus()
                if (!ignore) setStatusDisponiveis(lista)
            } catch {
                // erro exibido pelo interceptor global
            }
        }
        carregarStatus()
        return () => { ignore = true }
    }, [])

    if (carregando) {
        return (
            <div className="jewelry-page">
                <PageHeader titulo="Detalhes da Maleta" />
                <div className="jewelry-state">Carregando dados da maleta…</div>
            </div>
        )
    }

    if (erro || !maleta) {
        return (
            <div className="jewelry-page">
                <PageHeader titulo="Detalhes da Maleta" />
                <div className="jewelry-state">Não foi possível carregar os dados da maleta.</div>
            </div>
        )
    }

    const totalItens = contarItens(maleta.movimentacoes)

    // Só mostra o status atual e os próximos permitidos pelo fluxo.
    const opcoesStatus = statusDisponiveis.filter((status) =>
        status.id === maleta.status?.id || transicaoMaletaPermitida(maleta.status, status)
    ).filter(statusSelecionavel)
    const existeProximoStatus = opcoesStatus.some((status) => status.id !== maleta.status?.id)

    const salvarStatus = async (idStatus) => {
        setSalvandoStatus(true)
        try {
            const atualizada = await vendaApi.atualizarStatus(id, idStatus)
            setMaleta(atualizada?.idMovimentacaoRevendedora ? atualizada : await vendaApi.buscarPorId(id))
            emitirToast({ message: 'Status da maleta atualizado.', type: 'success' })
        } catch {
            // erro exibido pelo interceptor global
        } finally {
            setSalvandoStatus(false)
        }
    }

    // Primeira validação: o fluxo permitido. Segunda: confirmação explícita.
    const alterarStatus = (event) => {
        const idStatus = event.target.value
        if (idStatus === '') return

        const novoStatus = statusDisponiveis.find((status) => String(status.id) === idStatus)
        if (!transicaoMaletaPermitida(maleta.status, novoStatus)) {
            emitirToast({ message: 'Essa mudança de status não é permitida.', type: 'error' })
            return
        }

        confirmacao.solicitar({
            titulo: 'Alterar status da maleta',
            mensagem: `Mudar "${maleta.nome}" de "${rotuloStatusMaleta(maleta.status)}" para "${rotuloStatusMaleta(novoStatus)}"? Não será possível voltar ao status anterior.`,
            textoConfirmar: 'Alterar status',
            executar: () => salvarStatus(Number(idStatus)),
        })
    }

    const colunas = ["PRODUTO", "TIPO", "QUANTIDADE", "PREÇO UNIT.", "SUBTOTAL"]

    const funcaoRender = {
        render: (row, col) => {
            switch (col) {
                case 'PRODUTO':
                    return (
                        <div className={style['product-cell']}>
                            {row.joia.arquivo?.url ? (
                                <img src={row.joia.arquivo.url} alt={row.joia.nome} className={style['product-thumb']} />
                            ) : (
                                <div className={style['product-thumb-placeholder']}><ShoppingBag size={18} /></div>
                            )}
                            <span className={style['product-title']} onClick={() => navigate(`/joias/${row.joia.id}`)}>{row.joia.nome}</span>
                        </div>
                    )
                case 'TIPO':
                    return <TipoMovimentacaoBadge tipo={row.tipo} />
                case 'QUANTIDADE':
                    return <span>{quantidadeLinha(row)}</span>
                case 'PREÇO UNIT.':
                    return <span>{precoLinha(row)}</span>
                case 'SUBTOTAL':
                    return <span className={style['total-value']}>{subtotalLinha(row)}</span>
                default:
                    return null
            }
        }
    }

    return (
        <div className="jewelry-page">
            <PageHeader titulo="Detalhes da Maleta">
                {usuarioEhAdmin() && (
                    <label className={style['status-selector']}>
                        <span>Status</span>
                        <select
                            value={maleta.status?.id ?? ''}
                            onChange={alterarStatus}
                            disabled={salvandoStatus || !existeProximoStatus}
                        >
                            <option value="" disabled>Selecione...</option>
                            {opcoesStatus.map((status) => (
                                <option key={status.id} value={status.id}>{rotuloStatusMaleta(status)}</option>
                            ))}
                        </select>
                    </label>
                )}
            </PageHeader>

            <div className="jewelry-content">
                <section className="jewelry-hero" style={{ gridTemplateColumns: '1fr' }} aria-label="Visão geral da maleta">
                    <div className="jewelry-summary">
                        <span className="eyebrow-tag">Maleta</span>
                        <h1>{maleta.nome}</h1>

                        <div className="summary-stats">
                            <div className="stat">
                                <span className="stat-label">Data</span>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                                    {formatarData(maleta.data)}
                                </span>
                            </div>
                            <div className="stat-divider" aria-hidden="true" />
                            <div className="stat">
                                <span className="stat-label">Data limite</span>
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                                    {formatarData(maleta.dataLimite)}
                                </span>
                            </div>
                            <div className="stat-divider" aria-hidden="true" />
                            <div className="stat">
                                <span className="stat-label">Itens</span>
                                <span className="stat-number">{totalItens}</span>
                            </div>
                            <div className="stat-divider" aria-hidden="true" />
                            <div className="price-block">
                                <span className="stat-label">Total</span>
                                <span className="price-value">{valorOuTraco(maleta.totalVenda)}</span>
                            </div>
                            <div className="stat-divider" aria-hidden="true" />
                            <div className="stat">
                                <span className="stat-label">Status</span>
                                <StatusMaletaBadge status={maleta.status} />
                            </div>
                        </div>
                    </div>
                </section>

                <Table colunas={colunas} funcaoRender={funcaoRender} data={maleta.movimentacoes} />
            </div>

            <ConfirmarAcaoModal
                pendente={confirmacao.pendente}
                carregando={confirmacao.carregando}
                onConfirmar={confirmacao.confirmar}
                onCancelar={confirmacao.cancelar}
            />
        </div>
    )
}
