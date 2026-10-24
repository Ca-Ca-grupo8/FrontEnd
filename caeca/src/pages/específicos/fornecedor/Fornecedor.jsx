import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AtSign, Phone, Truck } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { EditarFornecedorModal } from '../../../components/modals/EditarFornecedorModal'
import { PerfilPessoa } from '../../../components/ui/PerfilPessoa'
import { fornecedorApi } from '../../../service/fornecedorApi'
import { formatarData } from '../../../utils/formatarData'
import { usuarioEhAdmin } from '../../../utils/perfil'

export function Fornecedor() {
  const { id } = useParams()

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

  const estado = carregando
    ? 'Carregando dados da fornecedora…'
    : erro || !fornecedor
      ? 'Não foi possível carregar os dados da fornecedora.'
      : null

  return (
    <>
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
      />
      <EditarFornecedorModal
        isOpen={editando}
        onClose={() => setEditando(false)}
        fornecedor={fornecedor}
        onAtualizar={() => setVersao((v) => v + 1)}
      />
    </>
  )
}
