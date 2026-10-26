// Regra única para os filtros de período: ou as duas datas, ou nenhuma,
// e a data de início não pode ser depois da data de fim.
export function validarPeriodo({ dataInicio, dataFim }) {
    if (Boolean(dataInicio) !== Boolean(dataFim)) {
        return { valido: false, mensagem: 'Preencha as duas datas ou deixe ambas vazias.' };
    }

    if (dataInicio && dataInicio > dataFim) {
        return { valido: false, mensagem: 'A data de início não pode ser maior que a data de fim.' };
    }

    return { valido: true, mensagem: '' };
}
