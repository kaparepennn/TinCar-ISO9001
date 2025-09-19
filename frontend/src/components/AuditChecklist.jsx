import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";

export default function AuditChecklist() {
  const { user } = useContext(AuthContext);
  const [checklistItems, setChecklistItems] = useState([]);
  const [logs, setLogs] = useState([]);
  const [completed, setCompleted] = useState({});
  const [auditedUser, setAuditedUser] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    try {
      const { checklistItems, logs } = await api.fetchAuditChecklist();
      setChecklistItems(checklistItems);
      setLogs(logs.reverse());
    } catch {
      alert("Error cargando checklist");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function toggleItem(index) {
    setCompleted(prev => ({ ...prev, [index]: !prev[index] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const completedItems = checklistItems.filter((_, i) => completed[i]);
    if (completedItems.length === 0 || !auditedUser.trim()) {
      alert("Complete al menos un ítem y especifique el usuario auditado");
      return;
    }
    setLoading(true);
    try {
      await api.submitAuditChecklist({ completedItems, auditedUser });
      alert("Checklist guardado");
      setAuditedUser("");
      setCompleted({});
      await loadData();
    } catch {
      alert("Error guardando checklist");
    }
    setLoading(false);
  }

  return (
    <div className="p-6 ml-64 max-w-4xl overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Checklist Auditoría ISO 9001</h2>

      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow bg-white">
        <label className="block mb-2 font-semibold">Usuario auditado (nombre o ID):</label>
        <input
          type="text"
          value={auditedUser}
          onChange={e => setAuditedUser(e.target.value)}
          required
          className="border p-2 rounded mb-4 w-full"
          disabled={loading}
        />

        <fieldset className="mb-4">
          <legend className="font-semibold mb-2">Items a evaluar:</legend>
          {checklistItems.map((item, i) => (
            <div key={i} className="mb-1">
              <label>
                <input
                  type="checkbox"
                  checked={!!completed[i]}
                  onChange={() => toggleItem(i)}
                  disabled={loading}
                  className="mr-2"
                />
                {item}
              </label>
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={loading}
          className="bg-tinCarOrange text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {loading ? "Guardando..." : "Guardar Checklist"}
        </button>
      </form>

      <h3 className="text-xl mb-3 font-semibold">Historial de Auditorías</h3>
      {logs.length === 0 && <p>No se han registrado auditorías aún.</p>}
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-tinCarDark text-white">
            <th className="border border-gray-300 p-2">Fecha y Hora</th>
            <th className="border border-gray-300 p-2">Auditado</th>
            <th className="border border-gray-300 p-2">Realizado por</th>
            <th className="border border-gray-300 p-2">Items Completados</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} className="even:bg-gray-100">
              <td className="border border-gray-300 px-2 py-1">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="border border-gray-300 px-2 py-1">{log.auditedUser}</td>
              <td className="border border-gray-300 px-2 py-1">{log.auditUser}</td>
              <td className="border border-gray-300 px-2 py-1">
                <ul className="list-disc list-inside text-sm">
                  {log.completedItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}