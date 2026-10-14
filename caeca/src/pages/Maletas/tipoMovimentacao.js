import { TIPO_MOVIMENTACAO } from '../../utils/tipoMovimentacaoEnum';

const TIPO_INFO = Object.freeze({
    [TIPO_MOVIMENTACAO.SAIDA]: { classe: 'badge-saida', rotulo: 'Saída' },
    [TIPO_MOVIMENTACAO.REENTRADA]: { classe: 'badge-reentrada', rotulo: 'Reentrada' },
    [TIPO_MOVIMENTACAO.ENTRADA]: { classe: 'badge-neutro', rotulo: 'Entrada' }
});

const CLASSE_PADRAO = 'badge-neutro';

const normalizar = (tipo) => String(tipo ?? '').toUpperCase();

const humanizar = (nome) =>
    nome
        .toLowerCase()
        .split('_')
        .filter(Boolean)
        .map((palavra, indice) => indice === 0
            ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
            : palavra)
        .join(' ');

const infoTipo = (tipo) => TIPO_INFO[normalizar(tipo)] ?? null;

export const rotuloTipoMovimentacao = (tipo) => {
    const info = infoTipo(tipo);

    return info ? info.rotulo : humanizar(normalizar(tipo)) || '-';
};

export const classeTipoMovimentacao = (tipo) => infoTipo(tipo)?.classe ?? CLASSE_PADRAO;

export const ehReentrada = (movimentacao) =>
    normalizar(movimentacao?.tipo) === TIPO_MOVIMENTACAO.REENTRADA;

export const contarItens = (movimentacoes) =>
    (movimentacoes ?? [])
        .filter((movimentacao) => !ehReentrada(movimentacao))
        .reduce((acc, movimentacao) => acc + (movimentacao?.quantidade ?? 0), 0);
