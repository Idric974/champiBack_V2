// ⭐⭐⭐⭐⭐⭐ Liste des routes disponibles dans l'application ⭐⭐⭐⭐⭐⭐

const express = require('express');
const router = express.Router();
const relayCtrl = require('../controllers/relayControllers');

router.post('/relay', relayCtrl.relay);
router.post('/relayEau', relayCtrl.relayEau);
router.post('/relayVentilo', relayCtrl.relayVentilo);
router.post(
  '/relayVanneFroid5SecondesOn',
  relayCtrl.relayVanneFroid5SecondesOn
);

router.post(
  '/relayVanneFroid40SecondesOn',
  relayCtrl.relayVanneFroid40SecondesOn
);

module.exports = router;
