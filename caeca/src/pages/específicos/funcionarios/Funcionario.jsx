import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PerfilFuncionario } from '../../perfil/PerfilFuncionario'
import { usuarioApi } from '../../../service/usuarioApi'

export function Funcionario() {
  const { id } = useParams()
  const [idLogado, setIdLogado] = useState(null)

  useEffect(() => {
    let ignore = false

    // O id do usuário logado vem do servidor (/usuarios/me), que lê a sessão do JWT.
    async function carregarUsuarioLogado() {
      try {
        const resposta = await usuarioApi.getMe()
        const dados = resposta?.data || resposta
        if (!ignore) setIdLogado(dados?.userId ?? dados?.id ?? dados?.idUsuario ?? null)
      } catch {
        // sem sessão válida a rota já terá redirecionado para o login
      }
    }

    carregarUsuarioLogado()
    return () => { ignore = true }
  }, [])

  const propriaConta = idLogado !== null && String(idLogado) === String(id)

  return (
    <PerfilFuncionario
      id={id}
      titulo="Informações sobre o(a) funcionário(a)"
      propriaConta={propriaConta}
    />
  )
}
