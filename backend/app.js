const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const documentsRoutes = require('./routes/documents');
const auditRoutes = require('./routes/audit');
const trainingRoutes = require('./routes/training');
const usersRoutes = require('./routes/users');
const companiesRoutes = require('./routes/companies');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/companies', companiesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`TinCar backend running on port ${PORT}`));