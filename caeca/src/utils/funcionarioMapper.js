export const funcionarioMapper = {
    toView(response) {
        if (!response) return null;
        return {
            id: response.id ?? response.idUsuario,
            nome: response.nome,
            email: response.email,
            tipoPerfil: response.role,
            status: response.status?.toUpperCase() ?? null,
            dataCadastro: response.dataCadastro,
            dataAtualizacao: response.dataAtualizacao
        };
    }
};