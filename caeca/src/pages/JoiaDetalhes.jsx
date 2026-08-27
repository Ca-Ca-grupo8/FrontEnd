import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Gem,
  History,
  Package,
  Truck,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { joiaApi } from '../service/joiaApi'
import './JoiaDetalhes.css'

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

const formatarData = (dataISO) =>
  dataISO
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dataISO))
    : '—'

const statusConfig = {
  OK: { label: 'OK', variant: 'ok' },
  ALERTA: { label: 'ALERTA', variant: 'alert' },
  CRITICO: { label: 'EM FALTA', variant: 'critico' },
  INATIVO: { label: 'INATIVO', variant: 'inativo' },
}

const obterStatus = (status) => statusConfig[status] || { label: status || '—', variant: 'inativo' }

function InfoCard({ title, icon: Icon, rows, toolbar }) {
  return (
    <section className="info-card" aria-label={title}>
      <header className="info-card-header">
        <span className="info-card-icon" aria-hidden="true">
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <h2>{title}</h2>
      </header>
      {toolbar}
      <dl className="info-grid">
        {rows.map(({ label, value, status }) => (
          <div className="info-cell" key={label}>
            <dt className="info-label">{label}</dt>
            <dd className="info-value">
              {status ? <span className="status-badge">{value}</span> : value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function JoiaDetalhes() {
  const { id } = useParams()
  const [joia, setJoia] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [fornecedorId, setFornecedorId] = useState('')

  useEffect(() => {
    let ignore = false

    async function carregarJoia() {
      try {
        const dados = await joiaApi.buscarPorId(id)
        if (!ignore) setJoia(dados)
        if (!ignore && dados?.fornecedores?.length) {
          setFornecedorId(String(dados.fornecedores[0].idFornecedor))
        }
      } catch {
        if (!ignore) setErro(true)
      } finally {
        if (!ignore) setCarregando(false)
      }
    }

    carregarJoia()
    return () => { ignore = true }
  }, [id])

  if (carregando) {
    return (
      <div className="jewelry-page">
        <PageHeader titulo="Especificações da joia" />
        <div className="jewelry-state">Carregando dados da joia…</div>
      </div>
    )
  }

  if (erro || !joia) {
    return (
      <div className="jewelry-page">
        <PageHeader titulo="Especificações da joia" />
        <div className="jewelry-state">Não foi possível carregar os dados da joia.</div>
      </div>
    )
  }

  const fornecedores = joia.fornecedores || []
  const fornecedor = fornecedores.find((f) => String(f.idFornecedor) === fornecedorId)
  const { label: statusLabel, variant } = obterStatus(joia.status)
  const statusClass = `status-badge--${variant}`

  const fornecedorToolbar = fornecedores.length > 1 && (
    <div className="fornecedor-select">
      <select
        className="fornecedor-select-field"
        aria-label="Selecionar fornecedor"
        value={fornecedorId}
        onChange={(e) => setFornecedorId(e.target.value)}
      >
        {fornecedores.map((f) => (
          <option key={f.idFornecedor} value={f.idFornecedor}>
            {f.nome}
          </option>
        ))}
      </select>
    </div>
  )

  const infoCards = [
    {
      title: 'Fornecedor',
      icon: Truck,
      toolbar: fornecedorToolbar,
      rows: [
        { label: 'Nome', value: fornecedor?.nome || '—' },
        { label: 'Instagram', value: fornecedor?.instagram || '—' },
        { label: 'Telefone', value: fornecedor?.telefone || '—' },
        { label: 'Status', value: fornecedor?.ativo ? 'Ativo' : 'Inativo', status: true },
        { label: 'Dt. cadastro', value: formatarData(fornecedor?.dataCadastro) },
      ],
    },
    {
      title: 'Especificações',
      icon: Gem,
      rows: [
        { label: 'Banho', value: joia.banho?.nome || '—' },
        { label: 'Material', value: joia.material?.nome || '—' },
        { label: 'Qt. mínima', value: String(joia.quantidadeMinima ?? '—') },
        { label: 'Preço unitário', value: formatarMoeda(joia.preco) },
      ],
    },
  ]

  return (
    <div className="jewelry-page">
      <PageHeader titulo="Especificações da joia" />

      <div className="jewelry-content">
        <section className="jewelry-hero" aria-label="Visão geral da joia">
          <div className="jewelry-image" tabIndex={0} role="img" aria-label="Foto da joia">
            {joia.arquivo?.url ? (
              <img src={joia.arquivo.url} alt={joia.nome} className="jewelry-photo" />
            ) : (
              <div className="jewelry-image-empty">
                <Package size={34} strokeWidth={1.25} />
                <span>Adicionar foto</span>
              </div>
            )}
          </div>

          <div className="jewelry-summary">
            <span className="eyebrow-tag">{joia.categoria?.nome || 'Joia'}</span>
            <h1>{joia.nome}</h1>

            <div className="summary-stats">
              <div className="stat">
                <span className="stat-label">Em estoque</span>
                <span className="stat-number">{joia.quantidade ?? '—'}</span>
              </div>
              <div className="stat-divider" aria-hidden="true" />
              <div className="stat">
                <span className="stat-label">Situação</span>
                <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
              </div>
            </div>

            <div className="price-row">
              <div className="price-block">
                <span className="stat-label">Preço de venda</span>
                <span className="price-value">{formatarMoeda(joia.preco)}</span>
              </div>
              <button
                className="history-button"
                type="button"
                aria-label="Ver histórico de preço do produto"
                title="Histórico de preço"
              >
                <History size={17} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </section>

        <div className="info-cards">
          {infoCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}
