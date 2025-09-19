import { useState, useEffect } from "react";
import api from "../services/api";

export default function TrainingScheduler() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    date: "",
    time: "",
    attendees: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await api.fetchTrainingEvents();
      setEvents(data);
    } catch {
      alert("Error cargando capacitaciones");
    }
  }

  function handleInput(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({ id: null, title: "", description: "", date: "", time: "", attendees: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { id, title, description, date, time, attendees } = form;
    if (!title || !date || !time) {
      alert("Título, fecha y hora son obligatorios");
      return;
    }
    setLoading(true);
    try {
      if (id) {
        await api.saveTrainingEvent({ id, title, description, date, time, attendees: attendees.split(",").map(a => a.trim()) });
      } else {
        await api.saveTrainingEvent({ title, description, date, time, attendees: attendees.split(",").map(a => a.trim()) });
      }
      await loadEvents();
      resetForm();
    } catch {
      alert("Error guardando capacitación");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Confirma eliminar esta capacitación?")) return;
    setLoading(true);
    try {
      await api.deleteTrainingEvent(id);
      await loadEvents();
    } catch {
      alert("Error eliminando capacitación");
    }
    setLoading(false);
  }

  function handleEdit(event) {
    setForm({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      attendees: event.attendees.join(", "),
    });
  }

  return (
    <div className="p-6 ml-64 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-6">Agenda de Capacitación</h2>

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="font-semibold block mb-1">Título:</label>
          <input
            name="title"
            value={form.title}
            onChange={handleInput}
            type="text"
            className="border w-full p-2 rounded"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-1">Descripción:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInput}
            className="border w-full p-2 rounded"
            rows="3"
            disabled={loading}
          />
        </div>

        <div className="mb-4 grid md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold block mb-1">Fecha:</label>
            <input
              name="date"
              value={form.date}
              onChange={handleInput}
              type="date"
              className="border w-full p-2 rounded"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Hora:</label>
            <input
              name="time"
              value={form.time}
              onChange={handleInput}
              type="time"
              className="border w-full p-2 rounded"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-1">Asistentes (lista, separados por coma):</label>
          <input
            name="attendees"
            value={form.attendees}
            onChange={handleInput}
            type="text"
            className="border w-full p-2 rounded"
            disabled={loading}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-tinCarOrange text-white px-4 py-2 rounded hover:bg-yellow-600 flex-grow"
          >
            {form.id ? "Actualizar Capacitación" : "Agregar Capacitación"}
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

      <h3 className="text-xl font-semibold mb-3">Capacitaciones programadas</h3>
      {events.length === 0 && <p>No hay capacitaciones programadas.</p>}
      <ul className="space-y-3">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="border p-4 bg-white rounded shadow flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div>
              <h4 className="font-semibold text-lg">{ev.title}</h4>
              <p>{ev.description}</p>
              <p>
                <strong>Fecha:</strong> {ev.date} <strong>Hora:</strong> {ev.time}
              </p>
              <p>
                <strong>Asistentes:</strong> {ev.attendees?.join(", ") || "N/A"}
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
              <button
                onClick={() => handleEdit(ev)}
                className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(ev.id)}
                className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}