function resolverAtivo(response) {
    if (typeof response.isAtivo === 'boolean') return response.isAtivo;
    if (typeof response.ativo === 'boolean') return response.ativo;
    if (typeof response.is_ativo === 'boolean') return response.is_ativo;

    const status = String(response.status ?? '').toLowerCase();
    if (['ativo', 'ativa', 'active'].includes(status)) return true;
    if (['inativo', 'inativa', 'inactive'].includes(status)) return false;
    return null;
}

export function toResponse(response) {
    return {
        id: response.idFornecedor,
        nome: response.nome,
        instagram: response.instagram,
        telefone: response.telefone,
        isAtivo: resolverAtivo(response),
        dataCadastro: response.dataCadastro
    }
}