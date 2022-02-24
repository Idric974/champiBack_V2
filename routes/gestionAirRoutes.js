const express = require('express');
const router = express.Router();

const affichageTemperatureAir = require('../controllers/gestionAirControllers');
router.get('/getTemperatureAir', affichageTemperatureAir.getTemperatureAir);

const affichageDataAir = require('../controllers/gestionAirControllers');
router.get('/getDataAir', affichageDataAir.getDataAir);

const postConsigneAir = require('../controllers/gestionAirControllers');
router.post('/postConsigneAir', postConsigneAir.postConsigneAir);

const postDataAir = require('../controllers/gestionAirControllers');
router.post('/postDataAir', postDataAir.postDataAir);

module.exports = router;
