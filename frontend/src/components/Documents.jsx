import { useState, useEffect } from "react";
import api from "../services/api";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadDocuments() {
    try {
      const docs = await api.fetchDocuments();
      setDocuments(docs);
    } catch (e) {
      alert("Error cargando documentos");
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      alert("Selecciona un archivo primero");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.uploadDocument(formData);
      setFile(null);
      await loadDocuments();
      alert("Archivo subido exitosamente");
    } catch {
      alert("Error subiendo archivo");
    }
    setLoading(false);
  }

  async function handleAddLink(e) {
    e.preventDefault();
    if (!linkName || !linkUrl) {
      alert("Nombre y URL son obligatorios");
      return;
    }
    setLoading(true);
    try {
      await api.addLinkDocument({ name: linkName, url: linkUrl });
      setLinkName("");
      setLinkUrl("");
      await loadDocuments();
      alert("Link añadido exitosamente");
    } catch {
      alert("Error agregando link");
    }
    setLoading(false);
  }

  function renderDocument(doc) {
    if (doc.type === "file") {
      return (
        <li key={doc.id} className="mb-1">
          <a
            href={`http://localhost:4000/uploads/${doc.filename}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tinCarOrange hover:underline"
            download
          >
            {doc.name}
          </a>{" "}
          <small>({new Date(doc.timestamp).toLocaleDateString()})</small>
        </li>
      );
    } else if (doc.type === "link") {
      return (
        <li key={doc.id} className="mb-1">
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tinCarOrange hover:underline"
          >
            {doc.name}
          </a>{" "}
          <small>({new Date(doc.timestamp).toLocaleDateString()})</small>
        </li>
      );
    }
    return null;
  }

  return (
    <div className="p-6 ml-64 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Gestión de Documentos</h2>

      <form onSubmit={handleUpload} className="mb-6">
        <label className="block mb-2 font-semibold">Subir archivo desde PC:</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={loading}
          className="mb-3"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-tinCarOrange text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {loading ? "Subiendo..." : "Subir Archivo"}
        </button>
      </form>

      <form onSubmit={handleAddLink} className="mb-8">
        <label className="block mb-2 font-semibold">Añadir enlace a Drive u otro sitio:</label>
        <input
          type="text"
          placeholder="Nombre documento"
          value={linkName}
          onChange={(e) => setLinkName(e.target.value)}
          disabled={loading}
          className="border p-2 mb-2 rounded w-full"
        />
        <input
          type="url"
          placeholder="URL"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          disabled={loading}
          className="border p-2 mb-2 rounded w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-tinCarOrange text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          {loading ? "Guardando..." : "Agregar enlace"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Documentos disponibles</h3>
      <ul>{documents.map(renderDocument)}</ul>
    </div>
  );
}