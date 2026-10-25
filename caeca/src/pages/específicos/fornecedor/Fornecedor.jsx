import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AtSign, Phone, Truck } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { EditarFornecedorModal } from '../../../components/modals/EditarFornecedorModal'
import { MensagemPerfil, PerfilPessoa, TituloSecaoPerfil } from '../../../components/ui/PerfilPessoa'
import { Pagination } from '../../../components/ui/Pagination'
import { Table } from '../../../components/ui/Table'
import { Toast } from '../../../components/ui/Toast'
import { fornecedorApi } from '../../../service/fornecedorApi'
import { joiaApi } from '../../../service/joiaApi'
import { formatarData } from '../../../utils/formatarData'
import { obterIniciais } from '../../../utils/obterIniciais'
import { usuarioEhAdmin } from '../../../utils/perfil'
import styles from './Fornecedor.module.css'

const colunas = ['PRODUTO', 'CATEGORIA', 'QUANTIDADE', 'PREÇO (R$)', 'ATUALIZAÇÃO', 'STATUS']
const POR_PAGINA = 10

const statusJoia = {
  OK: { rotulo: 'OK', classe: 'ok' },
  ALERTA: { rotulo: 'ALERTA', classe: 'alerta' },
  CRITICO: { rotulo: 'EM FALTA', classe: 'critico' },
  INATIVO: { rotulo: 'INATIVO', classe: 'inativo' }
}

function formatarMoeda(valor) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return '-'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor))
}

export function Fornecedor() {
  const { id } = useParams()

  const [fornecedor, setFornecedor] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [editando, setEditando] = useState(false)
  const [versao, setVersao] = useState(0)
  const [joias, setJoias] = useState([])
  const [carregandoJoias, setCarregandoJoias] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [toast, setToast] = useState(null)

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

  const fornecedorCarregado = Boolean(fornecedor)

  useEffect(() => {
    if (!fornecedorCarregado) return undefined
    let ignore = false

    async function carregarJoias() {
      setCarregandoJoias(true)
      try {
        const pagina = await joiaApi.listarPorFornecedor(id, { page: paginaAtual - 1, size: POR_PAGINA })

        if (!ignore) {
          setJoias(pagina.content ?? [])
          setTotalPaginas(pagina.totalPages ?? 1)
        }
      } catch {
        if (!ignore) setToast({ message: 'Não foi possível carregar as joias do fornecedor.' })
      } finally {
        if (!ignore) setCarregandoJoias(false)
      }
    }

    carregarJoias()
    return () => { ignore = true }
  }, [id, fornecedorCarregado, paginaAtual])

  const funcaoRender = {
    render: (joia, coluna) => {
      switch (coluna) {
        case 'PRODUTO':
          return joia.nome ?? '-'
        case 'CATEGORIA':
          return joia.categoria?.nome ?? '-'
        case 'QUANTIDADE':
          return joia.quantidade ?? '-'
        case 'PREÇO (R$)':
          return formatarMoeda(joia.preco)
        case 'ATUALIZAÇÃO':
          return formatarData(joia.dataAtualizacao)
        case 'STATUS': {
          const { rotulo, classe } = statusJoia[joia.status] ?? { rotulo: joia.status || '-', classe: 'inativo' }
          return <span className={`${styles.badge} ${styles[classe]}`}>{rotulo}</span>
        }
        default:
          return null
      }
    }
  }

  const estado = carregando
    ? 'Carregando dados da fornecedora…'
    : erro || !fornecedor
      ? 'Não foi possível carregar os dados da fornecedora.'
      : null

  return (
    <>
      {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}
      <PerfilPessoa
        titulo="Informações sobre a fornecedora"
        ariaLabel="Dados da fornecedora"
        estado={estado}
        acoes={usuarioEhAdmin() && fornecedor && (
          <Button type="button" colorido={false} onClick={() => setEditando(true)}>
            Editar
          </Button>
        )}
        icone={Truck}
        iniciais={obterIniciais(fornecedor?.nome)}
        nome={fornecedor?.nome}
        ativo={fornecedor?.isAtivo ?? null}
        textoStatus={{
          ativo: 'Fornecedor ativo',
          inativo: 'Fornecedor inativo',
          indefinido: 'Atividade não informada'
        }}
        dataCadastro={fornecedor?.dataCadastro ?? null}
        contatos={fornecedor ? [
          { rotulo: 'Instagram', valor: fornecedor.instagram, icone: AtSign },
          { rotulo: 'Telefone', valor: fornecedor.telefone, href: fornecedor.telefone && `tel:${fornecedor.telefone}`, icone: Phone }
        ] : []}
        painel={fornecedor && {
          titulo: 'Atividade recente',
          rotulo: 'Cadastro realizado em',
          valor: formatarData(fornecedor.dataCadastro)
        }}
      >
        <TituloSecaoPerfil>Joias relacionadas</TituloSecaoPerfil>
        {carregandoJoias ? (
          <MensagemPerfil>Carregando joias...</MensagemPerfil>
        ) : joias.length > 0 ? (
          <Table colunas={colunas} funcaoRender={funcaoRender} data={joias} />
        ) : (
          <MensagemPerfil>Nenhuma joia encontrada para este fornecedor.</MensagemPerfil>
        )}
        <Pagination
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          aoMudarPagina={setPaginaAtual}
        />
      </PerfilPessoa>
      <EditarFornecedorModal
        isOpen={editando}
        onClose={() => setEditando(false)}
        fornecedor={fornecedor}
        onAtualizar={() => setVersao((v) => v + 1)}
      />
    </>
  )
}
