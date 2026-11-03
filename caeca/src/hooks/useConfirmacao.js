import { useCallback, useState } from "react";

// Controla o modal de confirmação de ações críticas.
// solicitar({ titulo, mensagem, textoConfirmar, executar }) abre o modal;
// confirmar() roda `executar` e só então fecha. cancelar() descarta a ação.
export function useConfirmacao() {
    const [pendente, setPendente] = useState(null);
    const [carregando, setCarregando] = useState(false);

    const solicitar = useCallback((acao) => setPendente(acao), []);

    const cancelar = useCallback(() => {
        if (!carregando) setPendente(null);
    }, [carregando]);

    const confirmar = useCallback(async () => {
        if (!pendente) return;

        setCarregando(true);
        try {
            await pendente.executar();
        } catch {
            // Erro exibido pelo interceptor global.
        } finally {
            setCarregando(false);
            setPendente(null);
        }
    }, [pendente]);

    return { pendente, carregando, solicitar, cancelar, confirmar };
}
