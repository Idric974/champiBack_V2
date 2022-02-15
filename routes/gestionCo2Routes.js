const express = require('express');
const router = express.Router();

const affichageTauxCo2 = require('../controllers/gestionCo2Controllers');
router.get('/getTauxC2o', affichageTauxCo2.getTauxC2o);

const affichageDataCo2 = require('../controllers/gestionCo2Controllers');
router.get('/getDataCo2', affichageDataCo2.getDataCo2);

const postDataCo2 = require('../controllers/gestionCo2Controllers');
router.post('/postDataCo2', postDataCo2.postDataCo2);

module.exports = router;
