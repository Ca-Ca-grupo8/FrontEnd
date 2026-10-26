import { Navigate } from 'react-router-dom';
import { usuarioEhAdmin } from '../utils/perfil';

export function AdminRoute({ children }) {
  if (!usuarioEhAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
