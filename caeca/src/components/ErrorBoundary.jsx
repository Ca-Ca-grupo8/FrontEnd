import { Component } from 'react';
import { Button } from './ui/Button';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { comErro: false };
    }

    static getDerivedStateFromError() {
        return { comErro: true };
    }

    componentDidCatch(error, info) {
        console.error('Erro não tratado na aplicação:', error, info);
    }

    render() {
        if (this.state.comErro) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    minHeight: '100vh',
                    padding: '24px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '1.5rem', color: '#333' }}>Algo deu errado</h1>
                    <p style={{ color: '#667085', maxWidth: '420px' }}>
                        Ocorreu um erro inesperado. Recarregue a página para continuar.
                    </p>
                    <Button onClick={() => window.location.reload()}>Recarregar página</Button>
                </div>
            );
        }

        return this.props.children;
    }
}
