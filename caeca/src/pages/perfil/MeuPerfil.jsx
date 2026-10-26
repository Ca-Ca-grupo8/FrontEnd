import { useEffect, useState } from 'react'
import { UserRound } from 'lucide-react'
import { PerfilPessoa } from '../../components/ui/PerfilPessoa'
import { usuarioApi } from '../../service/usuarioApi'
import { PerfilFuncionario } from './PerfilFuncionario'

export function MeuPerfil() {
  const [idUsuario, setIdUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ignore = false

    // O id do usuário atual vem do servidor (/usuarios/me), que lê a sessão do JWT.
    async function carregarUsuarioAtual() {
      try {
        const resposta = await usuarioApi.getMe()
        const dados = resposta?.data || resposta
        if (!ignore) setIdUsuario(dados?.userId ?? dados?.id ?? dados?.idUsuario ?? null)
      } catch {
        // sem sessão válida a rota já terá redirecionado para o login
      } finally {
        if (!ignore) setCarregando(false)
      }
    }

    carregarUsuarioAtual()
    return () => { ignore = true }
  }, [])

  if (carregando || idUsuario === null) {
    return (
      <PerfilPessoa
        titulo="Meu perfil"
        icone={UserRound}
        estado={carregando ? 'Carregando seu perfil…' : 'Não foi possível identificar o seu usuário.'}
      />
    )
  }

  return (
    <PerfilFuncionario
      id={idUsuario}
      titulo="Meu perfil"
      propriaConta
    />
  )
}
