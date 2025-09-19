const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath);
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error leyendo JSON: ', e);
    return [];
  }
}

function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error escribiendo JSON: ', e);
  }
}

module.exports = { readJSON, writeJSON };