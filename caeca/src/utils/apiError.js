const MENSAGENS_POR_STATUS = {
    400: 'Não foi possível concluir a operação. Verifique os dados informados.',
    401: 'Sua sessão expirou. Faça login novamente.',
    403: 'Você não tem permissão para realizar esta ação.',
    404: 'O recurso solicitado não foi encontrado.',
    409: 'Não foi possível concluir a operação por conflito de dados.',
    422: 'Não foi possível concluir a operação. Verifique os dados informados.',
    500: 'Ocorreu um erro no servidor. Tente novamente em instantes.',
};

const extrairMensagemItem = (item) => {
    if (typeof item === 'string') {
        return item;
    }

    if (!item || typeof item !== 'object') {
        return null;
    }

    // Contrato do backend para validação de campos (400):
    // [ { "campo": "<mensagem>", "erro": "<campo>" } ]
    // O texto legível vem em `campo`; `erro` carrega o nome do campo.
    if (typeof item.campo === 'string' && item.campo.trim()) {
        return item.campo;
    }

    return item.mensagem || item.message || item.erro || null;
};

const juntarMensagens = (erros) => {
    const mensagens = erros.map(extrairMensagemItem).filter(Boolean);

    return mensagens.length ? mensagens.join(' ') : null;
};

export function extrairMensagemErro(error, fallback = 'Ocorreu um erro inesperado. Tente novamente.') {
    const data = error?.response?.data;

    if (typeof data === 'string' && data.trim()) {
        return data;
    }

    if (Array.isArray(data)) {
        const mensagem = juntarMensagens(data);
        if (mensagem) {
            return mensagem;
        }
    }

    if (data && typeof data === 'object') {
        const mensagem = data.mensagem || data.erro || data.message;
        if (mensagem) {
            return mensagem;
        }
    }

    const status = error?.response?.status;
    if (status && MENSAGENS_POR_STATUS[status]) {
        return MENSAGENS_POR_STATUS[status];
    }

    if (error?.message) {
        return error.message;
    }

    return fallback;
}
