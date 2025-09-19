import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, loading, error } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(username, password);
    } catch {
      // Error es manejado en contexto
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-tinCarDark">Ingreso TinCar</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          className="border border-gray-300 p-2 mb-4 rounded w-full"
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="border border-gray-300 p-2 mb-6 rounded w-full"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-tinCarOrange text-white w-full py-2 rounded hover:bg-yellow-600"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}