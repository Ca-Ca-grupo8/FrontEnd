import { useEffect, useState } from "react";

// Campo de data sempre em dd/mm/aaaa, independente do idioma do navegador/sistema.
// Recebe e devolve a data em ISO (aaaa-mm-dd), então o restante do app e a API não mudam.
// Quando o texto está incompleto ou inválido, onChange recebe "".

const aMascara = (bruto) => {
    const digitos = String(bruto ?? "").replace(/\D/g, "").slice(0, 8);
    if (digitos.length <= 2) return digitos;
    if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
    return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
};

const doIso = (iso) => {
    const [ano, mes, dia] = String(iso ?? "").slice(0, 10).split("-");
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : "";
};

const paraIso = (texto) => {
    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
    if (!partes) return "";

    const dia = Number(partes[1]);
    const mes = Number(partes[2]);
    const ano = Number(partes[3]);
    const data = new Date(ano, mes - 1, dia);

    const valida = data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
    return valida ? `${partes[3]}-${partes[2]}-${partes[1]}` : "";
};

export function InputData({ value = "", onChange, className = "", placeholder = "dd/mm/aaaa", ...props }) {
    const [texto, setTexto] = useState(() => doIso(value));

    // Acompanha mudanças externas do valor (ex.: carregamento de um registro para edição).
    useEffect(() => {
        if (paraIso(texto) !== String(value ?? "").slice(0, 10)) {
            setTexto(doIso(value));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const aoMudar = (event) => {
        const novoTexto = aMascara(event.target.value);
        setTexto(novoTexto);
        onChange?.(paraIso(novoTexto));
    };

    // Ao sair do campo com data incompleta, volta para o último valor válido.
    const aoSair = () => {
        if (texto && !paraIso(texto)) {
            setTexto(doIso(value));
        }
    };

    const invalido = texto.length > 0 && !paraIso(texto);

    return (
        <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            placeholder={placeholder}
            className={className}
            value={texto}
            aria-invalid={invalido}
            onChange={aoMudar}
            onBlur={aoSair}
            {...props}
        />
    );
}
