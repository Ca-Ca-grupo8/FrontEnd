const STATUS_MALETA = Object.freeze({
    EM_PREPARACAO: { classe: 'badge-aberto', rotulo: 'Em preparação' },
    EM_CONSIGNACAO: { classe: 'badge-em-consignacao', rotulo: 'Em consignação' },
    EM_ACERTO: { classe: 'badge-em-acerto', rotulo: 'Em acerto' },
    FINALIZADA: { classe: 'badge-finalizada', rotulo: 'Finalizada' },
    ERRO: { classe: 'badge-erro', rotulo: 'Erro' }
});

const CLASSE_PADRAO = 'badge-neutro';

const NOME_NAO_SELECIONAVEL = 'ERRO';

const humanizar = (nome) =>
    nome
        .toLowerCase()
        .split('_')
        .filter(Boolean)
        .map((palavra, indice) => indice === 0
            ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
            : palavra)
        .join(' ');

const statusConhecido = (status) => {
    const nome = status?.nome;
    if (!nome) return null;

    return STATUS_MALETA[String(nome).toUpperCase()] ?? null;
};

export const rotuloStatusMaleta = (status) => {
    const conhecido = statusConhecido(status);

    return conhecido ? conhecido.rotulo : humanizar(String(status?.nome ?? '')) || 'Sem status';
};

export const classeStatusMaleta = (status) => statusConhecido(status)?.classe ?? CLASSE_PADRAO;

export const statusSelecionavel = (status) =>
    String(status?.nome ?? '').toUpperCase() !== NOME_NAO_SELECIONAVEL;

// Fluxo permitido: Em preparação → Em consignação → Em acerto → Finalizada.
// Não é possível voltar nem pular etapas.
const TRANSICOES_MALETA = Object.freeze({
    EM_PREPARACAO: Object.freeze(['EM_CONSIGNACAO']),
    EM_CONSIGNACAO: Object.freeze(['EM_ACERTO']),
    EM_ACERTO: Object.freeze(['FINALIZADA']),
    FINALIZADA: Object.freeze([])
});

const nomeStatus = (status) => String(status?.nome ?? '').toUpperCase();

export const proximosStatusMaleta = (statusAtual) =>
    TRANSICOES_MALETA[nomeStatus(statusAtual)] ?? [];

export const transicaoMaletaPermitida = (statusAtual, novoStatus) =>
    proximosStatusMaleta(statusAtual).includes(nomeStatus(novoStatus));