const express = require('express');
const router = express.Router();

// GET
const affichageDataCourbe = require('../controllers/gestionCourbeControllers');
router.get('/getTauxHumiditeCourbe', affichageDataCourbe.getTauxHumiditeCourbe);

const affichageConsigneHumiditeCourbe = require('../controllers/gestionCourbeControllers');
router.get(
  '/getconsigneHumiditeCourbe',
  affichageConsigneHumiditeCourbe.getconsigneHumiditeCourbe
);

module.exports = router;
