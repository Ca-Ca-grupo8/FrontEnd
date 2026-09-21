import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Table } from '../../components/ui/Table'
import { Button } from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'
import { vendaApi } from '../../service/maletasApi'
import '../entradaJoia/JoiaDetalhes.css'
import style from './Maletas.module.css'

const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

const formatarData = (dataStr) =>
    new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).format(new Date(dataStr))

export function MaletaDetalhes() {
    const { id } = useParams()
    const [maleta, setMaleta] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(false)
    const [finalizada, setFinalizada] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        let ignore = false
        async function carregar() {
            try {
                const dados = await vendaApi.buscarPorId(id)
                if (!ignore) { setMaleta(dados); setFinalizada(dados.isFinalizada) }
            } catch {
                if (!ignore) setErro(true)
            } finally {
                if (!ignore) setCarregando(false)
            }
        }
        carregar()
        return () => { ignore = true }
    }, [id])

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

    const finalizarMaleta = async () => {
        try {
            await vendaApi.finalizar(id)
            setFinalizada(true)
        } catch {
            setToast({ message: 'Não foi possível finalizar a maleta.' })
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
                {!finalizada && (
                    <Button colorido={true} onClick={finalizarMaleta}>Finalizar maleta</Button>
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
                                <span className="price-value">{formatarMoeda(maleta.totalVenda)}</span>
                            </div>
                            <div className="stat-divider" aria-hidden="true" />
                            <div className="stat">
                                <span className="stat-label">Status</span>
                                <span className={`${style.badge} ${finalizada ? style['badge-finalizada'] : style['badge-aberta']}`}>
                                    {finalizada ? 'Finalizada' : 'Em aberto'}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <Table colunas={colunas} funcaoRender={funcaoRender} data={maleta.movimentacoes} />
            </div>
        </div>
    )
}
