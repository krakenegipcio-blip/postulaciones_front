import { useState, useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ToastContainer from './components/ui/Toast';
import Sidebar from './components/layout/Sidebar';
import type { Page } from './components/layout/Sidebar';
import PostulacionesPage from './pages/PostulacionesPage';
import AnalisisPage from './pages/AnalisisPage';
import TecnologiasPage from './pages/TecnologiasPage';
import MetodosPage from './pages/MetodosPage';
import EmpresasPage from './pages/EmpresasPage';
import CargosPage from './pages/CargosPage';
import PlataformasPage from './pages/PlataformasPage';
import ModalidadesPage from './pages/ModalidadesPage';
import UbicacionesPage from './pages/UbicacionesPage';
import EstadosPage from './pages/EstadosPage';
import NivelesPage from './pages/NivelesPage';

export default function App() {
  const [page, setPage] = useState<Page>('postulaciones');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const props = { onMenuOpen: () => setSidebarOpen(true) };

  if (isCheckingAuth) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showRegister 
      ? <RegisterPage onSwitch={() => setShowRegister(false)} /> 
      : <LoginPage onSwitch={() => setShowRegister(true)} />;
  }

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        current={page}
        onNavigate={setPage}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {page === 'postulaciones' && <PostulacionesPage {...props} />}
        {page === 'analisis' && <AnalisisPage {...props} />}
        {page === 'tecnologias' && <TecnologiasPage {...props} />}
        {page === 'metodos' && <MetodosPage {...props} />}
        {page === 'empresas' && <EmpresasPage {...props} />}
        {page === 'cargos' && <CargosPage {...props} />}
        {page === 'plataformas' && <PlataformasPage {...props} />}
        {page === 'modalidades' && <ModalidadesPage {...props} />}
        {page === 'ubicaciones' && <UbicacionesPage {...props} />}
        {page === 'estados' && <EstadosPage {...props} />}
        {page === 'niveles' && <NivelesPage {...props} />}
      </div>
      <ToastContainer />
    </div>
  );
}
