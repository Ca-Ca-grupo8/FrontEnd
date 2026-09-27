export function toResponse(response) {
    return {
        id: response.idFuncionario,
        nome: response.nome,
        cargo: response.cargo,
        telefone: response.telefone,
        isAtivo: response.isAtivo,
        dataCadastro: response.dataCadastro
    }
}
