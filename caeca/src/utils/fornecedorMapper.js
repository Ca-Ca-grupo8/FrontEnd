export function toResponse(response) {
    return {
        id: response.idFornecedor,
        nome: response.nome,
        instagram: response.instagram,
        telefone: response.telefone,
        isAtivo: response.isAtivo,
        dataCadastro: response.dataCadastro
    }
}