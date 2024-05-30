const express = require('express');
const router = express.Router();
const affichageTemperatureSubstrat = require('../controllers/gestionSubstratControllers');

//! GET

router.get('/getTemperatureSubstrat', affichageTemperatureSubstrat.getTemperatureSubstrat);

router.get('/getDataSubstrat', affichageTemperatureSubstrat.getDataSubstrat);

router.post('/postConsigneSubstrat', affichageTemperatureSubstrat.postConsigneSubstrat);

module.exports = router;
