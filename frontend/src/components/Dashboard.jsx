import { useState, useEffect } from 'react';

export default function Dashboard() {
  // Simulación datos, en backend puedes crear ruta para traer KPI reales
  const [data, setData] = useState({
    projectsOnTime: 78,
    incidentsResolved: 65,
    customerSatisfaction: 90,
    openNonConformities: 5,
    tasks: [
      "Planificar funcionalidades",
      "Codificar módulos",
      "Revisar código",
      "Ejecutar casos de prueba"
    ],
  });

  return (
    <div className="ml-64 p-6 text-tinCarDark min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <main className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-tinCarDark text-white rounded-lg p-6 flex flex-col items-center">
          <svg viewBox="0 0 36 36" className="w-24 h-24 mb-4">
            <circle className="text-gray-600" strokeWidth="4" stroke="currentColor" fill="none" cx="18" cy="18" r="16" />
            <circle
              className="text-tinCarOrange"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${data.projectsOnTime}, 100`}
              stroke="currentColor"
              fill="none"
              cx="18"
              cy="18"
              r="16"
            />
            <text x="18" y="22" className="text-3xl font-bold fill-current text-tinCarOrange" textAnchor="middle">
              {data.projectsOnTime}%
            </text>
          </svg>
          <p>% Proyectos entregados a tiempo</p>
        </div>
        <div className="bg-tinCarDark text-white p-6 rounded-lg flex flex-col justify-center">
          <p className="text-lg font-semibold mb-3">% Incidencias resueltas a tiempo</p>
          <progress max="100" value={data.incidentsResolved} className="w-full h-4 rounded mb-2" />
          <p>{data.incidentsResolved}%</p>
        </div>
        <div className="bg-tinCarDark text-white p-6 rounded-lg flex flex-col justify-center">
          <p className="text-lg font-semibold mb-3">Nivel de satisfacción del cliente</p>
          <svg viewBox="0 0 100 40" className="w-full h-6">
            <polyline
              fill="none"
              stroke="#d68d2e"
              strokeWidth="2"
              points="0,40 20,20 40,28 60,15 80,25 100,10"
            />
          </svg>
          <p>{data.customerSatisfaction}%</p>
        </div>
        <div className="bg-tinCarDark text-white p-6 rounded-lg flex flex-col justify-center items-center">
          <p className="text-xl font-semibold">No conformidades abiertas</p>
          <p className="text-5xl font-bold">{data.openNonConformities}</p>
        </div>
      </main>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold mb-4">Gestión de Documentos</h2>
          <ul className="list-disc list-inside space-y-1 text-sm leading-relaxed text-gray-700">
            <li>Manual de Calidad</li>
            <li>Política de Calidad</li>
            <li>Objetivos de Calidad</li>
            <li>Alcance del SGC</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold mb-4">Gestión de Incidencias y No Conformidades</h2>
          <button className="bg-tinCarOrange text-white px-3 py-1 rounded mb-3 hover:bg-yellow-600">
            + Nueva Incidencia
          </button>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-tinCarDark text-white">
                <th className="p-2">Tipo</th>
                <th className="p-2">Descripción</th>
                <th className="p-2">Prioridad</th>
                <th className="p-2">Responsable</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Fecha de Detección</th>
              </tr>
            </thead>
            <tbody>
              <tr className="even:bg-gray-100">
                <td className="p-2">Incidencia</td>
                <td className="p-2">Fallo en módulo # Alta</td>
                <td className="p-2">Alta</td>
                <td className="p-2">Juan Pérez</td>
                <td className="p-2">Abierta</td>
                <td className="p-2">15/04/2024</td>
              </tr>
              <tr>
                <td className="p-2">No Conformidad</td>
                <td className="p-2">Proceso no documentado</td>
                <td className="p-2">Media</td>
                <td className="p-2">Ana López</td>
                <td className="p-2">En Análisis</td>
                <td className="p-2">10/04/2024</td>
              </tr>
              <tr className="even:bg-gray-100">
                <td className="p-2">Incidencia</td>
                <td className="p-2">Error en reporte</td>
                <td className="p-2">Baja</td>
                <td className="p-2">Carlos Ruiz</td>
                <td className="p-2">Cerrada</td>
                <td className="p-2">05/04/2024</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold mb-4">Procesos y Responsabilidades</h2>
          <div className="mb-2">
            <span className="inline-block bg-tinCarOrange py-1 px-3 rounded-full text-white font-semibold">Procesos:</span>
            <span className="inline-block ml-2 bg-tinCarDark text-white py-1 px-3 rounded-full font-semibold">Software</span>
          </div>
          {/* Más contenido si quieres */}
        </div>
      </section>
    </div>
  );
}