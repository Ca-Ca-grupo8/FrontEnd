import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css'

import { Layout } from './components/layout/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AdminRoute } from './components/AdminRoute.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ToastHost } from './components/feedback/ToastHost.jsx';

import { Login } from './pages/Login.jsx';
import { PrimeiroAcesso } from './pages/primeiroAcesso/PrimeiroAcesso.jsx';
import { Home } from './pages/home/Home.jsx';
import { Dashboard } from './pages/dashboard/Dashboard.jsx';
import { CadastroContribuintes } from './pages/cadastroContribuintes/CadastroContribuintes.jsx';
import { Revendedoras } from './pages/revendedoras/Revendedoras.jsx';
import { CadastroRevendedora } from './pages/revendedoras/CadastroRevendedora.jsx';
import { RevendedoraDetalhes } from './pages/revendedoras/RevendedoraDetalhes.jsx';
import { Fornecedores } from './pages/fornecedores/Fornecedores.jsx';
import { Fornecedor } from './pages/específicos/fornecedor/Fornecedor.jsx';
import { Funcionarios } from './pages/funcionarios/Funcionarios.jsx';
import { Funcionario } from './pages/específicos/funcionarios/Funcionario.jsx';
import { Movimentacoes } from './pages/movimentacao/Movimentacoes.jsx';
// import { MovimentacaoEscolhas } from './pages/movimentacao/MovimentacaoEscolhas.jsx';
// import { EntradaJoia } from './pages/EntradaJoia.jsx'
// import { ReentradaJoia } from './pages/reentradaJoia/ReentradaJoia.jsx'
// import { EntradaJoiaExistente } from './pages/entradaJoiaExistente/EntradaJoiaExistente.jsx'
// import { SaidaJoia } from './pages/SaidaJoia.jsx';
import { MovimentacaoEstoque } from './pages/movimentacaoEstoque/MovimentacaoEstoque.jsx';
import { InventarioProdutos } from './pages/joias/InventarioProdutos.jsx';
import { JoiaDetalhes } from './pages/entradaJoia/JoiaDetalhes.jsx';
import { Maletas } from './pages/Maletas/Maletas.jsx';
import { MaletaDetalhes } from './pages/Maletas/MaletaDetalhes.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/primeiro-acesso',
    element: <PrimeiroAcesso />,
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
        path: '/dashboard',
        element: <Dashboard />,
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
        path: '/contribuintes/fornecedores',
        element: <AdminRoute><Fornecedores /></AdminRoute>,
      },
      {
        path: '/contribuintes/fornecedores/:id',
        element: <Fornecedor />,
      },
      {
        path: '/contribuintes/funcionarios',
        element: <Funcionarios />,
      },
      {
        path: '/contribuintes/funcionarios/:id',
        element: <Funcionario />,
      },
      {
        path: '/movimentacoes',
        element: <Movimentacoes />,
      },
      {
        path: '/movimentacoes/escolhas',
        element: <MovimentacaoEscolhas />,
      },
      {
        path: '/movimentacoes/entrada',
        element: <Navigate to="/movimentacoes?fluxo=entrada" replace />,
      },
      {
        path: '/movimentacoes/entradaexistente',
        element: <Navigate to="/movimentacoes?fluxo=entrada-existente" replace />,
      },
      {
        path: '/movimentacoes/reentrada',
        element: <Navigate to="/movimentacoes?fluxo=reentrada" replace />,
      },
      {
        path: '/movimentacoes/saida',
        element: <Navigate to="/movimentacoes?fluxo=saida" replace />,
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