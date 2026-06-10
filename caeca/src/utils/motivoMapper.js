export function toResponse(response) {
    return {
        id: response.idTipoMovimentacao,
        nome: response.descricao,
        tipoMovimentacao: response.tipoMovimentacao
    }
}