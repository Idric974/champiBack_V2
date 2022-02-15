const express = require('express');
const router = express.Router();

// GET
const affichageTauxHumidite = require('../controllers/gestionHumiditeControllers');
router.get('/getTauxHumidite', affichageTauxHumidite.getTauxHumidite);

const affichageConsigne = require('../controllers/gestionHumiditeControllers');
router.get('/getConsigneHumidite', affichageConsigne.getConsigneHumidite);

// POST
const postDataHum = require('../controllers/gestionHumiditeControllers');
router.post('/postDataHum', postDataHum.postDataHum);

module.exports = router;
