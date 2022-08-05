const express = require('express');
const router = express.Router();
const postSmsOrderCtrl = require('../controllers/gestionSmsOrderControllers');

//! POST SMS.

router.post('/postSmsOrder', postSmsOrderCtrl.postSmsOrder);

module.exports = router;
