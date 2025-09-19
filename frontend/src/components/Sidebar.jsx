import { useState } from 'react';

const links = [
  'Dashboard', 'Documentos', 'Incidencias y No Conformidades', 'Procesos',
  'Satisfacción del Cliente', 'Capacitación', 'Auditorias', 'Configuración'
];

export default function Sidebar({ current, setCurrent }) {
  return (
    <aside className="bg-tinCarDark text-white w-64 min-h-screen p-6 fixed md:relative z-10">
      <a href="/" className="flex items-center mb-8">
        <img src="/logo.svg" alt="TinCar logo" className="w-12 h-12 mr-3" />
        <div>
          <h1 className="text-tinCarOrange font-bold text-2xl">TinCar</h1>
          <span className="text-sm">SGC TinCar - ISO 9001</span>
        </div>
      </a>
      <nav>
        <ul>
          {links.map(link => (
            <li key={link} className="mb-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-md hover:bg-tinCarOrange hover:text-white ${
                  current === link ? 'bg-tinCarOrange text-white' : ''
                }`}
                onClick={() => setCurrent(link)}
              >
                {link}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}