const express = require('express');
const router = express.Router();

const affichageLogsBack = require('../controllers/logsControllers');
router.get('/getLogsBack', affichageLogsBack.getLogsBack);

module.exports = router;
