export function formatarData(data) {
    if (!data) return "-";
    const dataValida = new Date(data);
    if (Number.isNaN(dataValida.getTime())) return "-";

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(dataValida);
}
