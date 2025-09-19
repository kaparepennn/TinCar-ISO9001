const express = require('express');
const { readJSON, writeJSON } = require('../utils/jsonStorage');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

const checklistItems = [
  "Control de documentos",
  "Gestión de no conformidades",
  "Evaluación del desempeño",
  "Mejora continua",
  "Capacitación del personal"
];

// Obtener checklist y logs
router.get('/', verifyToken, (req, res) => {
  const logs = readJSON('auditLogs.json');
  res.json({ checklistItems, logs });
});

// Guardar checklist enviado
router.post('/submit', verifyToken, (req, res) => {
  const { completedItems, auditedUser } = req.body;
  if (!completedItems || !auditedUser) return res.status(400).json({ message: 'Missing fields' });

  const logs = readJSON('auditLogs.json');
  const newLog = {
    id: Date.now(),
    completedItems,
    auditedUser,
    auditUser: req.user.username,
    timestamp: new Date()
  };
  logs.push(newLog);
  writeJSON('auditLogs.json', logs);
  res.json({ message: 'Checklist saved', log: newLog });
});

module.exports = router;