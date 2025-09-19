import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Documents from '../components/Documents';
import AuditChecklist from '../components/AuditChecklist';
import TrainingScheduler from '../components/TrainingScheduler';
import UserManagement from '../components/UserManagement';
import CompanyManagement from '../components/CompanyManagement';
import LoginPage from '../components/LoginPage';

export default function MainApp() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [page, setPage] = useState('Dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  function renderContent() {
    switch (page) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Documentos':
        return <Documents />;
      case 'Auditorias':
        return <AuditChecklist />;
      case 'Capacitación':
        return <TrainingScheduler />;
      case 'Configuración':
        if (user.role !== 'admin') return <div className="p-6 ml-64">No autorizado</div>;
        return (
          <div className="ml-64 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserManagement />
            <CompanyManagement />
          </div>
        );
      default:
        return <div className="ml-64 p-6">Página en construcción...</div>;
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar current={page} setCurrent={setPage} />
      <div className="flex-grow">
        <header className="bg-tinCarDark text-white flex items-center justify-between px-6 py-3 ml-64">
          <h1 className="text-xl font-bold">{page}</h1>
          <div>
            <span className="mr-4">Hola, {user.username}</span>
            <button
              onClick={logout}
              className="bg-tinCarOrange px-3 py-1 rounded hover:bg-yellow-600"
            >
              Salir
            </button>
          </div>
        </header>
        {renderContent()}
      </div>
    </div>
  );
}