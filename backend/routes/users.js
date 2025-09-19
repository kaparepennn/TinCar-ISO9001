const express = require('express');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('../utils/jsonStorage');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Listar usuarios – solo admin
router.get('/', verifyToken, authorizeRoles('admin'), (req, res) => {
  const users = readJSON('users.json').map(({ password, ...rest }) => rest);
  res.json(users);
});

// Crear usuario admin solo
router.post('/', verifyToken, authorizeRoles('admin'), (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ message: 'Missing data' });

  const users = readJSON('users.json');
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username exists' });
  }

  const hash = bcrypt.hashSync(password, 8);
  const newUser = { id: Date.now(), username, password: hash, role };
  users.push(newUser);
  writeJSON('users.json', users);
  res.status(201).json({ message: 'User created' });
});

// Actualizar usuario
router.put('/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
  const { username, password, role } = req.body;
  const users = readJSON('users.json');
  const idx = users.findIndex(u => u.id == req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'User not found' });

  if (username) users[idx].username = username;
  if (password) users[idx].password = bcrypt.hashSync(password, 8);
  if (role) users[idx].role = role;

  writeJSON('users.json', users);
  res.json({ message: 'User updated' });
});

// Borrar usuario
router.delete('/:id', verifyToken, authorizeRoles('admin'), (req, res) => {
  const users = readJSON('users.json');
  const filtered = users.filter(u => u.id != req.params.id);
  writeJSON('users.json', filtered);
  res.json({ message: 'User deleted' });
});

module.exports = router;x