export function toResponse(response) {
    return {
        id: response.idFuncionario,
        nome: response.nome,
        cargo: response.cargo,
        isAtivo: response.isAtivo,
        dataCadastro: response.dataCadastro
    }
}
