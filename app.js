const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Gestion
const gestionAirRoutes = require('./routes/gestionAirRoutes');
const gestionHumidite = require('./routes/gestionHumiditeRoutes');
const gestionCo2 = require('./routes/gestionCo2Routes');
const gestionCourbe = require('./routes/gestionCourbeRoutes');

// Logs
const gestionLogs = require('./routes/logsBackRoutes');

// Outils
const relayRoutes = require('./routes/relayRoutes');
const brocheRoutes = require('./routes/broche');

//! Utilisation de cors pour les connexions

const cors = require('cors');
app.use(cors());

//! --------------------------------------------------

//! Header pour les Cross Origine

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

//! --------------------------------------------------

//! Module de connexion à la base de données.
const db = require('./models');
db.sequelize.sync({
  force: false,
});

//! --------------------------------------------------

//! Utilisation de body parser

app.use(bodyParser.json());

//! --------------------------------------------------

//! Génération des pages html.

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/pageCourbes.html', (req, res) => {
  res.sendFile(__dirname + '/pageCourbes.html');
});

app.get('/pageRelay.html', (req, res) => {
  res.sendFile(__dirname + '/pageRelay.html');
});

//! --------------------------------------------------

//! Les images.

app.use('/images', express.static('/home/pi/Desktop/champiBack_V2/images'));
//! --------------------------------------------------

//! Le CSS.

app.use('/styles', express.static('/home/pi/Desktop/champiBack_V2/styles'));
//! --------------------------------------------------

//! Le Javascript.

app.use('/mainsJs', express.static('/home/pi/Desktop/champiBack_V2/mainsJs'));
//! --------------------------------------------------

//! Liste des routes.

// Gestion
app.use('/api/gestionAirRoutes', gestionAirRoutes);
app.use('/api/gestionHumiditeRoutes', gestionHumidite);
app.use('/api/gestionCo2Routes', gestionCo2);
app.use('/api/gestionCourbeRoutes', gestionCourbe);

// Logs
app.use('/api/logsBackRoutes', gestionLogs);

// Outils
app.use('/api/relayRoutes', relayRoutes);
app.use('/api/broche', brocheRoutes);

//! --------------------------------------------------

module.exports = app;
