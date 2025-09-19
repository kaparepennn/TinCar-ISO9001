const express = require('express');
const multer = require('multer');
const path = require('path');
const { readJSON, writeJSON } = require('../utils/jsonStorage');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Subir archivo
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Missing file' });

  const documents = readJSON('documents.json');
  const doc = {
    id: Date.now(),
    name: req.file.originalname,
    filename: req.file.filename,
    uploadedBy: req.user.username,
    timestamp: new Date(),
    type: 'file'
  };
  documents.push(doc);
  writeJSON('documents.json', documents);
  res.json({ message: 'File uploaded', document: doc });
});

// Agregar enlace a Google Drive u otro
router.post('/link', verifyToken, (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) return res.status(400).json({ message: 'Missing name or url' });

  const documents = readJSON('documents.json');
  const doc = {
    id: Date.now(),
    name,
    url,
    uploadedBy: req.user.username,
    timestamp: new Date(),
    type: 'link'
  };
  documents.push(doc);
  writeJSON('documents.json', documents);
  res.json({ message: 'Link added', document: doc });
});

// Obtener documentos
router.get('/', verifyToken, (req, res) => {
  const documents = readJSON('documents.json');
  res.json(documents);
});

// Descargar archivo local
router.get('/download/:id', verifyToken, (req, res) => {
  const documents = readJSON('documents.json');
  const doc = documents.find(d => d.id == req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });
  if (doc.type !== 'file') return res.status(400).json({ message: 'Document not downloadable' });

  const filePath = path.join(uploadDir, doc.filename);
  res.download(filePath, doc.name);
});

module.exports = router;