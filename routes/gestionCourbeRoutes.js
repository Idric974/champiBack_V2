const express = require('express');
const router = express.Router();

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

//!--------------------------------------------------------------

//! Cestion Humidité.

//* GET.

const affichageDataCourbe = require('../controllers/gestionCourbeControllers');
router.get('/getTauxHumiditeCourbe', affichageDataCourbe.getTauxHumiditeCourbe);

const affichageConsigneHumiditeCourbe = require('../controllers/gestionCourbeControllers');
router.get(
  '/getconsigneHumiditeCourbe',
  affichageConsigneHumiditeCourbe.getconsigneHumiditeCourbe
);

const funcGetDateDemarrageCycle = require('../controllers/gestionCourbeControllers');
router.get(
  '/getDateDemarrageCycle',
  funcGetDateDemarrageCycle.getDateDemarrageCycle
);

//*-------------------------------

//* POST.
const postDateDemarrageCycle = require('../controllers/gestionCourbeControllers');
router.post('/dateDemarrageCycle', postDateDemarrageCycle.dateDemarrageCycle);

module.exports = router;

//!--------------------------------------------------------------

//! Cestion Co2.

//!--------------------------------------------------------------
