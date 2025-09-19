const express = require('express');
const { readJSON, writeJSON } = require('../utils/jsonStorage');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Listar capacitaciones
router.get('/', verifyToken, (req, res) => {
  const trainings = readJSON('trainingEvents.json');
  res.json(trainings);
});

// Crear o actualizar capacitación
router.post('/', verifyToken, (req, res) => {
  const { id, title, description, date, time, attendees } = req.body;
  if (!title || !date || !time) return res.status(400).json({ message: 'Missing fields' });

  const trainings = readJSON('trainingEvents.json');
  if (id) {
    // Actualizar
    const idx = trainings.findIndex(t => t.id === id);
    if (idx >= 0) {
      trainings[idx] = { id, title, description, date, time, attendees: attendees || [] };
    } else {
      return res.status(404).json({ message: 'Training not found' });
    }
  } else {
    const newTraining = {
      id: Date.now(),
      title,
      description,
      date,
      time,
      attendees: attendees || []
    };
    trainings.push(newTraining);
  }
  writeJSON('trainingEvents.json', trainings);
  res.json({ message: 'Training saved', trainings });
});

// Eliminar capacitación
router.delete('/:id', verifyToken, (req, res) => {
  const trainings = readJSON('trainingEvents.json');
  const filtered = trainings.filter(t => t.id != req.params.id);
  writeJSON('trainingEvents.json', filtered);
  res.json({ message: 'Training deleted' });
});

module.exports = router;