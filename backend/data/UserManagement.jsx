import { useState, useEffect } from "react";
import api from "../services/api";

const initialForm = { id: null, username: "", password: "", role: "user" };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await api.fetchUsers();
      setUsers(data);
    } catch {
      alert("Error cargando usuarios");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username) {
      alert("El usuario es obligatorio");
      return;
    }
    setLoading(true);
    try {
      if (form.id) {
        if (form.password) {
          await api.updateUser(form.id, form);
        } else {
          await api.updateUser(form.id, { username: form.username, role: form.role });
        }
      } else {
        if (!form.password) {
          alert("La contraseña es obligatoria para crear usuario");
          setLoading(false);
          return;
        }
        await api.createUser(form);
      }
      await loadUsers();
      resetForm();
    } catch {
      alert("Error guardando usuario");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Confirma eliminar este usuario?")) return;
    setLoading(true);
    try {
      await api.deleteUser(id);
      await loadUsers();
    } catch {
      alert("Error eliminando usuario");
    }
    setLoading(false);
  }

  function handleEdit(user) {
    setForm({ id: user.id, username: user.username, password: "", role: user.role });
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Gestión de Usuarios y Roles</h3>

      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña (dejar vacío para no cambiar)"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded w-full mb-3"
          minLength={6}
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-tinCarOrange text-white px-4 py-2 rounded hover:bg-yellow-600 flex-grow"
          >
            {form.id ? "Actualizar Usuario" : "Crear Usuario"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Limpiar
          </button>
        </div>
      </form>

      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-tinCarDark text-white">
          <tr>
            <th className="border border-gray-300 px-2 py-1">ID</th>
            <th className="border border-gray-300 px-2 py-1">Usuario</th>
            <th className="border border-gray-300 px-2 py-1">Rol</th>
            <th className="border border-gray-300 px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="even:bg-gray-100">
              <td className="border border-gray-300 px-2 py-1">{u.id}</td>
              <td className="border border-gray-300 px-2 py-1">{u.username}</td>
              <td className="border border-gray-300 px-2 py-1">{u.role}</td>
              <td className="border border-gray-300 px-2 py-1">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-blue-600 text-white rounded px-3 py-1 mr-2 hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}