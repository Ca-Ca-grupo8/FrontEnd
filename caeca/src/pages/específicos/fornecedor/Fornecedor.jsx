import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
    Truck, 
    ArrowLeft, 
} from 'lucide-react'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Button } from '../../../components/ui/Button'
import { fornecedorApi } from '../../../service/fornecedorApi'

import style from './Fornecedor.module.css';

export function Fornecedor() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [fornecedor, setFornecedor] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [editando, setEditando] = useState(false)
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ignore = false

    async function carregarFornecedor() {
      try {
        setCarregando(true)
        setErro(false)
        // Como o fornecedorApi já aplica o toResponse internamente, 
        // os dados já vêm formatados prontos para uso!
        const dadosFormatados = await fornecedorApi.buscarPorId(id)
        
        if (!ignore) {
          setFornecedor(dadosFormatados)
        }
      } catch (err) {
        if (!ignore) setErro(true)
      } finally {
        if (!ignore) setCarregando(false)
      }
    }

    carregarFornecedor()
    return () => { ignore = true }
  }, [id, versao])

  if (carregando) {
    return (
      <div className="jewelry-page">
        <PageHeader titulo="Informações da fornecedora" />
        <div className="jewelry-state">Carregando dados da fornecedora…</div>
      </div>
    )
  }

  if (erro || !fornecedor) {
    return (
      <div className="jewelry-page">
        <PageHeader titulo="Informações da fornecedora" />
        <div className="jewelry-state">Não foi possível carregar os dados da fornecedora.</div>
      </div>
    )
  }

  return (
    <div className="jewelry-page">

      <PageHeader titulo="Informações da fornecedora">
        <Button type="button" colorido={false} onClick={() => setEditando(true)}>
          Editar
        </Button>
      </PageHeader>

      <div className="jewelry-content">
        <section className="jewelry-hero" aria-label="Visão geral da fornecedora">
          <div className="jewelry-image" tabIndex={0} role="img" aria-label="Foto da fornecedora">
            <div className="jewelry-image-empty">
              <Truck size={34} strokeWidth={1.25} />
              <span>{fornecedor.nome}</span>
            </div>
          </div>
        </section>

        <div className="info-cards">
          <section className="info-card" aria-label="Especificações">
            <header className="info-card-header">
              <span className="info-card-icon" aria-hidden="true">
                <Truck size={16} strokeWidth={1.75} />
              </span>
              <h2>Detalhes do Fornecedor</h2>
            </header>
            <dl className="info-grid">
              <div className="info-cell">
                <dt className="info-label">Nome</dt>
                <dd className="info-value">{fornecedor.nome}</dd>
              </div>
              <div className="info-cell">
                <dt className="info-label">Instagram</dt>
                <dd className="info-value">{fornecedor.instagram}</dd>
              </div>
              <div className="info-cell">
                <dt className="info-label">Telefone</dt>
                <dd className="info-value">{fornecedor.telefone}</dd>
              </div>
              <div className="info-cell">
                <dt className="info-label">Status</dt>
                <dd className="info-value">
                  <span className={`status-badge ${fornecedor.isAtivo ? 'status-ok' : 'status-inativo'}`}>
                    {fornecedor.isAtivo ? 'Fornecedor ativo' : 'Inativo'}
                  </span>
                </dd>
              </div>
              <div className="info-cell">
                <dt className="info-label">Data de Cadastro</dt>
                <dd className="info-value">{fornecedor.dataCadastro}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}