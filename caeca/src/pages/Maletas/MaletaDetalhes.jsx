import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Table } from '../../components/ui/Table'
import { Toast } from '../../components/ui/Toast'
import { vendaApi } from '../../service/maletasApi'
import { rotuloStatusMaleta } from './maletaStatus'
import { StatusMaletaBadge } from './StatusMaletaBadge'
import '../entradaJoia/JoiaDetalhes.css'
import style from './Maletas.module.css'

const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

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
    const [maleta, setMaleta] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(false)
    const [statusDisponiveis, setStatusDisponiveis] = useState([])
    const [salvandoStatus, setSalvandoStatus] = useState(false)
    const [toast, setToast] = useState(null)

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
                if (!ignore) setToast({ message: 'Não foi possível carregar os status da maleta.' })
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

    const totalItens = maleta.movimentacoes.reduce((acc, m) => acc + m.quantidade, 0)

    const alterarStatus = async (event) => {
        const idStatus = event.target.value
        if (idStatus === '') return

        setSalvandoStatus(true)
        try {
            const atualizada = await vendaApi.atualizarStatus(id, Number(idStatus))
            setMaleta(atualizada?.idMovimentacaoRevendedora ? atualizada : await vendaApi.buscarPorId(id))
            setToast({ message: 'Status da maleta atualizado.' })
        } catch {
            setToast({ message: 'Não foi possível atualizar o status da maleta.' })
        } finally {
            setSalvandoStatus(false)
        }
    }

    const colunas = ["PRODUTO", "QUANTIDADE", "PREÇO UNIT.", "SUBTOTAL"]

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
                            <span className={style['product-title']}>{row.joia.nome}</span>
                        </div>
                    )
                case 'QUANTIDADE':
                    return <span>{row.quantidade}</span>
                case 'PREÇO UNIT.':
                    return <span>{formatarMoeda(row.precoSaida)}</span>
                case 'SUBTOTAL':
                    return <span className={style['total-value']}>{formatarMoeda(row.quantidade * row.precoSaida)}</span>
                default:
                    return null
            }
        }
    }

    return (
        <div className="jewelry-page">
            {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
            <PageHeader titulo="Detalhes da Maleta">
                <label className={style['status-selector']}>
                    <span>Status</span>
                    <select
                        value={maleta.status?.id ?? ''}
                        onChange={alterarStatus}
                        disabled={salvandoStatus || statusDisponiveis.length === 0}
                    >
                        <option value="" disabled>Selecione...</option>
                        {statusDisponiveis.map((status) => (
                            <option key={status.id} value={status.id}>{rotuloStatusMaleta(status)}</option>
                        ))}
                    </select>
                </label>
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
                                <span className="price-value">{formatarMoeda(maleta.totalVenda)}</span>
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
        </div>
    )
}
