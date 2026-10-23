import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Gem, ArrowLeft, Package } from 'lucide-react'
import { PageHeader } from '../../../components/ui/PageHeader'
import { Button } from '../../../components/ui/Button'
import { emitirToast } from '../../../utils/toastBus'
import { funcionarioApi } from '../../../service/funcionarioApi'
import { funcionarioMapper } from '../../../utils/funcionarioMapper'

import style from './Funcionario.module.css';

export function Funcionario() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [funcionario, setFuncionario] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [editando, setEditando] = useState(false)
  const [versao, setVersao] = useState(0)

  useEffect(() => {
    let ignore = false

    async function carregarFuncionario() {
      try {
        setCarregando(true)
        setErro(false)
        const dadosBrutos = await funcionarioApi.buscarPorId(id)
        
        if (!ignore) {
          const dadosFormatados = funcionarioMapper.toView(dadosBrutos)
          setFuncionario(dadosFormatados)
        }
      } catch (err) {
        if (!ignore) setErro(true)
      } finally {
        if (!ignore) setCarregando(false)
      }
    }

    carregarFuncionario()
    return () => { ignore = true }
  }, [id, versao])

  if (carregando) {
    return (
      <div className="jewelry-page">
        <PageHeader titulo="Especificações do(a) funcionário(a)" />
        <div className="jewelry-state">Carregando dados do(a) funcionário(a)…</div>
      </div>
    )
  }

  if (erro || !funcionario) {
    return (
      <div className="jewelry-page">
        <PageHeader titulo="Especificações do funcionário" />
        <div className="jewelry-state">Não foi possível carregar os dados do(a) funcionário(a).</div>
      </div>
    )
  }

  return (
    <div className="jewelry-page">

      <PageHeader titulo="Especificações do(a) funcionário(a)">
        <Button type="button" colorido={false} onClick={() => setEditando(true)}>
          Editar
        </Button>
      </PageHeader>

      <div className="jewelry-content">
        <section className="jewelry-hero" aria-label="Visão geral do(a) funcionário(a)">
          <div className="jewelry-image" tabIndex={0} role="img" aria-label="Foto do(a) funcionário(a)">
            <div className="jewelry-image-empty">
              <Package size={34} strokeWidth={1.25} />
              <span>{funcionario.nome}</span>
            </div>
          </div>
        </section>

        <div className="info-cards">
          <section className="info-card" aria-label="Especificações">
            <header className="info-card-header">
              <span className="info-card-icon" aria-hidden="true">
                <Gem size={16} strokeWidth={1.75} />
              </span>
              <h2>Informações do Funcionário</h2>
            </header>
            <dl className="info-grid">
              <div className="info-cell">
                <dt className="info-label">Nome Completo</dt>
                <dd className="info-value">{funcionario.nome}</dd>
              </div>
              <div className="info-cell">
                <dt className="info-label">E-mail</dt>
                <dd className="info-value">{funcionario.email}</dd>
              </div>
              <div className="info-cell">
                <dt className="info-label">Tipo de Perfil</dt>
                <dd className="info-value">{funcionario.tipoPerfil}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}