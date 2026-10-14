export async function buscarEnderecoPorCep(cep, { signal } = {}) {
    const cepDigits = cep.replace(/\D/g, "");

    if (cepDigits.length !== 8) {
        throw new Error("CEP deve conter 8 números.");
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`, { signal });

    if (!response.ok) {
        throw new Error("Falha ao consultar o CEP.");
    }

    return response.json();
}