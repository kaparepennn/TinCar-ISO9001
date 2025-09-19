const express = require('express');
const { readJSON, writeJSON } = require('../utils/jsonStorage');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Listar empresas
router.get('/', verifyToken, (req, res) => {
  const companies = readJSON('companies.json');
  res.json(companies);
});

// Crear empresa
router.post('/', verifyToken, (req, res) => {
  const {
    razonSocial,
    numeroEmpresa,
    nit,
    email,
    representanteLegal,
    paginaWeb,
    sectorEconomico,
    tipoEmpresa,
    direccion,
    redesSociales,
    usuariosAsignados
  } = req.body;
  // Validar campos mínimos si quieres

  const companies = readJSON('companies.json');
  const newCompany = {
    id: Date.now(),
    razonSocial,
    numeroEmpresa,
    nit,
    email,
    representanteLegal,
    paginaWeb,
    sectorEconomico,
    tipoEmpresa,
    direccion,
    redesSociales: redesSociales || [],
    usuariosAsignados: usuariosAsignados || []
  };
  companies.push(newCompany);
  writeJSON('companies.json', companies);
  res.status(201).json({ message: 'Company created' });
});

// Actualizar empresa
router.put('/:id', verifyToken, (req, res) => {
  const companies = readJSON('companies.json');
  const idx = companies.findIndex(c => c.id == req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Company not found' });

  companies[idx] = { ...companies[idx], ...req.body };
  writeJSON('companies.json', companies);
  res.json({ message: 'Company updated' });
});

// Borrar empresa
router.delete('/:id', verifyToken, (req, res) => {
  let companies = readJSON('companies.json');
  companies = companies.filter(c => c.id != req.params.id);
  writeJSON('companies.json', companies);
  res.json({ message: 'Company deleted' });
});

module.exports = router;