// ⭐⭐⭐⭐⭐⭐ Liste des routes disponibles dans l'application ⭐⭐⭐⭐⭐⭐

const express = require('express');
const router = express.Router();
const brocheCtrl = require('../controllers/broche');

// router.delete('/:id', auth, stuffCtrl.deleteThing);

router.post('/broche', brocheCtrl.broche);

module.exports = router;
