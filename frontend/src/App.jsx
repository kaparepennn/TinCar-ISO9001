import { AuthProvider } from './contexts/AuthContext';
import MainApp from './pages/MainApp';

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}