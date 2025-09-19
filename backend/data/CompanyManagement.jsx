import { useState, useEffect } from "react";
import api from "../services/api";

const initialForm = {
  id: null,
  razonSocial: "",
  numeroEmpresa: "",
  nit: "",
  email: "",
  representanteLegal: "",
  paginaWeb: "",
  sectorEconomico: "",
  tipoEmpresa: "",
  direccion: "",
  redesSociales: "",
  usuariosAsignados: "",
};

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompanies();
    loadUsers();
  }, []);

  async function loadCompanies() {
    try {
      const data = await api.fetchCompanies();
      setCompanies(data);
    } catch {
      alert("Error cargando empresas");
    }
  }

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
    if (!form.razonSocial || !form.nit) {
      alert("Razón social y NIT son obligatorios");
      return;
    }
    setLoading(true);

    const socialNetworks = form.redesSociales
      ? form.redesSociales.split(",").map((r) => r.trim())
      : [];
    const assignedUsers = form.usuariosAsignados
      ? form.usuariosAsignados.split(",").map((id) => id.trim())
      : [];

    try {
      if (form.id) {
        await api.updateCompany(form.id, {
          ...form,
          redesSociales: socialNetworks,
          usuariosAsignados: assignedUsers,
        });
      } else {
        await api.createCompany({
          ...form,
          redesSociales: socialNetworks,
          usuariosAsignados: assignedUsers,
        });
      }
      await loadCompanies();
      resetForm();
    } catch {
      alert("Error guardando empresa");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Confirma eliminar esta empresa?")) return;
    setLoading(true);
    try {
      await api.deleteCompany(id);
      await loadCompanies();
    } catch {
      alert("Error eliminando empresa");
    }
    setLoading(false);
  }

  function handleEdit(company) {
    setForm({
      ...company,
      redesSociales: company.redesSociales ? company.redesSociales.join(", ") : "",
      usuariosAsignados:
        company.usuariosAsignados ? company.usuariosAsignados.join(", ") : "",
    });
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Gestión de Empresas</h3>

      <form onSubmit={handleSubmit} className="mb-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <input
            name="razonSocial"
            placeholder="Razón Social"
            value={form.razonSocial}
            onChange={handleChange}
            disabled={loading}
            className="border p-2 rounded"
            required
          />
          <input
            name="numeroEmpresa"
            placeholder="Número de Empresa"
            value={form.numeroEmpresa}
            onChange={handleChange}
            disabled={loading}
            className="border p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <input
            name="nit"
            placeholder="NIT"
            value={form.nit}
            onChange={handleChange}
            disabled={loading}
            className="border p-2 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            className="border p-2 rounded"
          />
        </div>
        <input
          name="representanteLegal"
          placeholder="Representante Legal"
          value={form.representanteLegal}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded mb-3"
        />
        <input
          name="paginaWeb"
          placeholder="Página Web"
          value={form.paginaWeb}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded mb-3"
        />
        <input
          name="sectorEconomico"
          placeholder="Sector Económico"
          value={form.sectorEconomico}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded mb-3"
        />
        <input
          name="tipoEmpresa"
          placeholder="Tipo de Empresa"
          value={form.tipoEmpresa}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded mb-3"
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded mb-3"
        />
        <input
          name="redesSociales"
          placeholder="Redes Sociales (separadas por coma)"
          value={form.redesSociales}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded mb-3"
        />
        <input
          name="usuariosAsignados"
          placeholder="IDs de usuarios asignados (separados por coma)"
          value={form.usuariosAsignados}
          onChange={handleChange}
          disabled={loading}
          className="border p-2 rounded"
        />

        <div className="flex gap-3 mt-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-tinCarOrange text-white rounded px-4 py-2 hover:bg-yellow-600 flex-grow"
          >
            {form.id ? "Actualizar Empresa" : "Crear Empresa"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Limpiar
          </button>
        </div>
      </form>

      <h4 className="font-semibold mb-3">Empresas Registradas</h4>
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-tinCarDark text-white">
          <tr>
            <th className="border border-gray-300 p-2">Razón Social</th>
            <th className="border border-gray-300 p-2">NIT</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Representante</th>
            <th className="border border-gray-300 p-2">Sector Económico</th>
            <th className="border border-gray-300 p-2">Usuarios</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id} className="even:bg-gray-100">
              <td className="border border-gray-300 px-2 py-1">{c.razonSocial}</td>
              <td className="border border-gray-300 px-2 py-1">{c.nit}</td>
              <td className="border border-gray-300 px-2 py-1">{c.email}</td>
              <td className="border border-gray-300 px-2 py-1">{c.representanteLegal}</td>
              <td className="border border-gray-300 px-2 py-1">{c.sectorEconomico}</td>
              <td className="border border-gray-300 px-2 py-1">{c.usuariosAsignados ? c.usuariosAsignados.join(", ") : ""}</td>
              <td className="border border-gray-300 px-2 py-1">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-blue-600 text-white rounded px-3 py-1 mr-2 hover:bg-blue-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
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