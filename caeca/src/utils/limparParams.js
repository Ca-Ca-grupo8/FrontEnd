// Remove filtros vazios antes de enviar como query params.
export function limparParams(filtros = {}) {
    return Object.fromEntries(
        Object.entries(filtros).filter(([, valor]) => valor !== '' && valor !== null && valor !== undefined)
    );
}
