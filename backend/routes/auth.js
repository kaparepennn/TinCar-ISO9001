const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readJSON, writeJSON } = require('../utils/jsonStorage');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

// Registro usuario
router.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

  const users = readJSON('users.json');
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username exists' });
  }
  const hash = bcrypt.hashSync(password, 8);
  const newUser = { id: Date.now(), username, password: hash, role: role || 'user' };
  users.push(newUser);
  writeJSON('users.json', users);
  res.status(201).json({ message: 'User created' });
});

// Login usuario
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJSON('users.json');
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: 'Bad credentials' });

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ message: 'Bad credentials' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

module.exports = router;