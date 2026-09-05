import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

import { Layout } from './components/layout/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
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
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)