// ⭐⭐⭐⭐⭐⭐ Liste des routes disponibles dans l'application ⭐⭐⭐⭐⭐⭐

const express = require('express');
const router = express.Router();
const relayCtrl = require('../controllers/relayControllers');

// router.delete('/:id', auth, stuffCtrl.deleteThing);

router.post('/relay', relayCtrl.relay);
router.post('/relayEau', relayCtrl.relayEau);
router.post('/relayVentilo', relayCtrl.relayVentilo);
router.post('/relayVanneFroid', relayCtrl.relayVanneFroid);
router.post('/relayVanneFroid2', relayCtrl.relayVanneFroid2);

module.exports = router;
