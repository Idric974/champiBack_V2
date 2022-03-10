const express = require('express');
const router = express.Router();

// GET
const affichageDataCourbe = require('../controllers/gestionCourbeControllers');
router.get('/getDataCourbe', affichageDataCourbe.getDataCourbe);

module.exports = router;
