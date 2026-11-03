// Quantidades de joias são sempre inteiras.

// Usado nos inputs: descarta a parte decimal e qualquer caractere que não seja dígito.
// "1.5" vira "1" (e não "15"), "-3" vira "3".
export const somenteInteiros = (valor) =>
    String(valor ?? "").split(/[.,]/)[0].replace(/\D/g, "");

// Usado em valores vindos da API: arredonda para o inteiro mais próximo.
export const arredondarQuantidade = (valor) => {
    const numero = Math.round(Number(valor));
    return Number.isFinite(numero) ? numero : 0;
};
