const express = require('express');
const router = express.Router();
const postSmsOrderCtrl = require('../controllers/gestionSmsOrderControllers');

//! POST SMS.

router.post('/postSmsOrder', postSmsOrderCtrl.postSmsOrder);
router.post('/newConsigne', postSmsOrderCtrl.newConsigne);

module.exports = router;
