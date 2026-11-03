import { useEffect } from "react";
import { Button } from "../ui/Button";

// Segunda validação para ações críticas (inativar, mudar status, salvar alterações).
// Use junto com o hook useConfirmacao.
export function ConfirmarAcaoModal({ pendente, carregando = false, onConfirmar, onCancelar }) {
    const aberto = Boolean(pendente);

    useEffect(() => {
        if (!aberto) return;

        const aoPressionarTecla = (event) => {
            if (event.key === "Escape" && !carregando) onCancelar();
        };

        document.addEventListener("keydown", aoPressionarTecla);
        return () => document.removeEventListener("keydown", aoPressionarTecla);
    }, [aberto, carregando, onCancelar]);

    if (!aberto) return null;

    return (
        // Pode ser renderizado dentro de outro modal: não deixa o clique vazar.
        <div
            className="modal-overlay"
            onClick={(event) => {
                event.stopPropagation();
                if (!carregando) onCancelar();
            }}
        >
            <div
                className="modal-container"
                role="alertdialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <h2>{pendente.titulo}</h2>
                    <p>{pendente.mensagem}</p>
                </div>

                <div className="modal-actions">
                    <Button type="button" colorido={true} onClick={onConfirmar} disabled={carregando}>
                        {carregando ? "Aguarde..." : (pendente.textoConfirmar ?? "Confirmar")}
                    </Button>
                </div>

                <div className="modal-actions">
                    <Button type="button" colorido={false} onClick={onCancelar} disabled={carregando}>
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    );
}
