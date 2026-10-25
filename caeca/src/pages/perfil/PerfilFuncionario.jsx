import { useEffect, useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { EditarFuncionarioModal } from '../../components/modals/EditarFuncionarioModal'
import { AreasAcesso, PerfilPessoa } from '../../components/ui/PerfilPessoa'
import { funcionarioApi } from '../../service/funcionarioApi'
import { funcionarioMapper } from '../../utils/funcionarioMapper'
import { obterIniciais } from '../../utils/obterIniciais'

const ROLE_ADMIN = 'ROLE_ADMIN'

// PENDENTE é o usuário criado pelo convite que ainda não definiu a senha.
const SITUACOES = {
  ATIVO: { texto: 'Ativo', tom: 'ok' },
  INATIVO: { texto: 'Inativo', tom: 'inativo' },
  PENDENTE: { texto: 'Pendente', tom: 'pendente' }
}

// Espelha o menu e as rotas da aplicação: Fornecedores fica atrás do AdminRoute
// e só aparece no menu para administradores.
const AREAS = [
  { nome: 'Dashboard', apenasAdmin: false },
  { nome: 'Catálogo', apenasAdmin: false },
  { nome: 'Movimentações', apenasAdmin: false },
  { nome: 'Histórico de movimentações', apenasAdmin: false },
  { nome: 'Maletas', apenasAdmin: false },
  { nome: 'Contribuintes', apenasAdmin: false },
  { nome: 'Revendedoras', apenasAdmin: false },
  { nome: 'Fornecedores', apenasAdmin: true },
  { nome: 'Funcionários', apenasAdmin: false }
]

export function PerfilFuncionario({ id, titulo, propriaConta }) {
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

  const estado = carregando
    ? 'Carregando dados do(a) funcionário(a)…'
    : erro || !funcionario
      ? 'Não foi possível carregar os dados do(a) funcionário(a).'
      : null

  const admin = funcionario?.tipoPerfil === ROLE_ADMIN
  const perfil = admin ? 'Administrador' : 'Funcionário'
  const areas = AREAS.map(({ nome, apenasAdmin }) => ({ nome, restrita: apenasAdmin && !admin }))
  const areasLiberadas = areas.filter((area) => !area.restrita).length

  return (
    <>
      <PerfilPessoa
        titulo={titulo}
        ariaLabel="Dados do(a) funcionário(a)"
        estado={estado}
        acoes={
          <Button type="button" colorido={false} onClick={() => setEditando(true)}>
            Editar
          </Button>
        }
        iniciais={obterIniciais(funcionario?.nome)}
        nome={funcionario?.nome}
        situacao={funcionario && SITUACOES[funcionario.status]}
        dataCadastro={funcionario?.dataCadastro ?? null}
        dataAtualizacao={funcionario?.dataAtualizacao ?? null}
        contatos={funcionario ? [
          { rotulo: 'Email', valor: funcionario.email, href: funcionario.email && `mailto:${funcionario.email}`, icone: Mail }
        ] : []}
        painel={funcionario && {
          titulo: 'Acesso',
          rotulo: perfil,
          valor: `${areasLiberadas} de ${areas.length}`,
          descricao: 'áreas liberadas',
          tom: 'neutro'
        }}
      >
        <AreasAcesso
          titulo="Áreas do sistema"
          descricao={admin
            ? 'Administradores têm acesso a todas as áreas, incluindo o cadastro de fornecedores.'
            : 'Este perfil tem acesso às áreas operacionais. As áreas administrativas ficam restritas.'}
          areas={areas}
        />
      </PerfilPessoa>
      <EditarFuncionarioModal
        isOpen={editando}
        onClose={() => setEditando(false)}
        funcionario={funcionario}
        propriaConta={propriaConta}
        onAtualizar={() => setVersao((v) => v + 1)}
      />
    </>
  )
}
