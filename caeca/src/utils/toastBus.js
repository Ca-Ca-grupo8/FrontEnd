const ouvintes = new Set();

let proximoId = 1;

export function emitirToast({ message, type = 'error', duration = 4000 }) {
    if (!message) {
        return null;
    }

    const toast = { id: proximoId++, message, type, duration };
    ouvintes.forEach((ouvinte) => ouvinte(toast));
    return toast.id;
}

export function assinarToast(ouvinte) {
    ouvintes.add(ouvinte);
    return () => ouvintes.delete(ouvinte);
}
