const express = require('express');
const router = express.Router();

//! Cestion date de démarrage courbes.

//* GET.

const funcGetDateDemarrageCycle = require('../controllers/gestionCourbeControllers');
router.get(
  '/getDateDemarrageCycle',
  funcGetDateDemarrageCycle.getDateDemarrageCycle
);

//* POST.

const postDateDemarrageCycle = require('../controllers/gestionCourbeControllers');
router.post('/dateDemarrageCycle', postDateDemarrageCycle.dateDemarrageCycle);

module.exports = router;

//!--------------------------------------------------------------

//! Cestion Air.

//* GET.

const affichageTemperatureAirCourbe = require('../controllers/gestionCourbeControllers');
router.get(
  '/getTemperatureAirCourbe',
  affichageTemperatureAirCourbe.getTemperatureAirCourbe
);

const affichageConsigneAirCourbe = require('../controllers/gestionCourbeControllers');
router.get(
  '/getConsigneAirCourbe',
  affichageConsigneAirCourbe.getConsigneAirCourbe
);

const affichageJourCycleAirCourbe = require('../controllers/gestionCourbeControllers');
router.get('/getJourDuCycle', affichageJourCycleAirCourbe.getJourDuCycle);

//!--------------------------------------------------------------

//! Cestion Humidité.

//* GET.

const affichageDataCourbe = require('../controllers/gestionCourbeControllers');
router.get('/getTauxHumiditeCourbe', affichageDataCourbe.getTauxHumiditeCourbe);

const affichageConsigneHumiditeCourbe = require('../controllers/gestionCourbeControllers');
router.get(
  '/getConsigneHumiditeCourbe',
  affichageConsigneHumiditeCourbe.getConsigneHumiditeCourbe
);

//!--------------------------------------------------------------

//! Cestion Co2.

//* GET.

const affichageDataCourbeCo2 = require('../controllers/gestionCourbeControllers');
router.get('/getTauxCo2Courbe', affichageDataCourbeCo2.getTauxCo2Courbe);

const affichageConsigneCo2Courbe = require('../controllers/gestionCourbeControllers');
router.get(
  '/getConsigneCo2Courbe',
  affichageConsigneCo2Courbe.getConsigneCo2Courbe
);

//!--------------------------------------------------------------
