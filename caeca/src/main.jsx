import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

import { Layout } from './components/layout/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ToastHost } from './components/feedback/ToastHost.jsx';
import { EntradaJoia } from './pages/EntradaJoia.jsx'
import { ReentradaJoia } from './pages/reentradaJoia/ReentradaJoia.jsx'
import { EntradaJoiaExistente } from './pages/entradaJoiaExistente/EntradaJoiaExistente.jsx'
import { Login } from './pages/Login.jsx';
import { SaidaJoia } from './pages/SaidaJoia.jsx';
import { Home } from './pages/home/Home.jsx';
import { MovimentacaoEscolhas } from './pages/movimentacao/MovimentacaoEscolhas.jsx';
import { CadastroContribuintes } from './pages/cadastroContribuintes/CadastroContribuintes.jsx';
import { MovimentacaoEstoque } from './pages/movimentacaoEstoque/MovimentacaoEstoque.jsx';
import { InventarioProdutos } from './pages/joias/InventarioProdutos.jsx';
import { JoiaDetalhes } from './pages/entradaJoia/JoiaDetalhes.jsx';
import { Fornecedores } from './pages/fornecedores/Fornecedores.jsx';
import { Funcionarios } from './pages/funcionarios/Funcionarios.jsx';
import { Maletas } from './pages/Maletas/Maletas.jsx';
import { MaletaDetalhes } from './pages/Maletas/MaletaDetalhes.jsx';
import { CadastroRevendedora } from './pages/revendedoras/CadastroRevendedora.jsx';
import { Revendedoras } from './pages/revendedoras/Revendedoras.jsx';
import { RevendedoraDetalhes } from './pages/revendedoras/RevendedoraDetalhes.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/contribuintes',
        element: <CadastroContribuintes />,
      },
      {
        path: '/contribuintes/revendedoras',
        element: <Revendedoras />,
      },
      {
        path: '/contribuintes/revendedoras/cadastro',
        element: <CadastroRevendedora />,
      },
      {
        path: '/contribuintes/revendedoras/:id',
        element: <RevendedoraDetalhes />,
      },
      {
        path: '/movimentacoes',
        element: <MovimentacaoEscolhas />,
      },
      {
        path: '/movimentacoes/entrada',
        element: <EntradaJoia />,
      },
      {
        path: '/movimentacoes/entradaexistente',
        element: <EntradaJoiaExistente />,
      },
      {
        path: '/movimentacoes/reentrada',
        element: <ReentradaJoia />,
      },
      {
        path: '/movimentacoes/saida',
        element: <SaidaJoia />,
      },
      {
        path: '/joias/movimentacoes',
        element: <MovimentacaoEstoque />,
      },
      {
        path: '/joias',
        element: <InventarioProdutos />,
      },
      {
        path: '/joias/:id',
        element: <JoiaDetalhes />,
      },
      {
path: '/joias/maletas',
        element: <Maletas />,
      },
      {
        path: '/joias/maletas/:id',
        element: <MaletaDetalhes />,
      },
      {
        path: '/contribuintes/fornecedores',
        element: <Fornecedores />,
      },
      {
        path: '/contribuintes/funcionarios',
        element: <Funcionarios />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router}/>
      <ToastHost />
    </ErrorBoundary>
  </StrictMode>,
)