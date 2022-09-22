// ⭐⭐⭐⭐⭐⭐ Liste des routes disponibles dans l'application ⭐⭐⭐⭐⭐⭐

const express = require('express');
const router = express.Router();
const relayCtrl = require('../controllers/relayControllers');

//! Eau au sol.

//? POST.



router.post('/relayVentilo', relayCtrl.relayVentilo);

router.post(
  '/relayVanneFroid5SecondesOn',
  relayCtrl.relayVanneFroid5SecondesOn
);

router.post(
  '/relayVanneFroid40SecondesOn',
  relayCtrl.relayVanneFroid40SecondesOn
);

router.post('/miseAZeroEtatVanne', relayCtrl.miseAZeroEtatVanne);

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? GET.

router.get('/getEtatBoutonEauAuSol', relayCtrl.getEtatBoutonEauAuSol);

router.get('/relayEauAuSol', relayCtrl.relayEauAuSol);

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

module.exports = router;
