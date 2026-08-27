import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

import { Layout } from './components/layout/Layout.jsx';
import { EntradaJoia } from './pages/EntradaJoia.jsx'
import { Login } from './pages/Login.jsx';
import { SaidaJoia } from './pages/SaidaJoia.jsx';
import { Home } from './pages/home/Home.jsx';
import { MovimentacaoEscolhas } from './pages/movimentacao/MovimentacaoEscolhas.jsx';
import { CadastroContribuintes } from './pages/cadastroContribuintes/CadastroContribuintes.jsx';
import { MovimentacaoEstoque } from './pages/movimentacaoEstoque/MovimentacaoEstoque.jsx';
import { InventarioProdutos } from './pages/joias/InventarioProdutos.jsx';
import { JoiaDetalhes } from './pages/JoiaDetalhes.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    element: <Layout />,
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
        path: '/movimentacoes/saida',
        element: <SaidaJoia />,
      },
      {
        path: '/historico/movimentacoes',
        element: <MovimentacaoEstoque />,
      },
      {
        path: '/joias/catalogo',
        element: <InventarioProdutos />,
      },
      {
        path: '/joia/:id',
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