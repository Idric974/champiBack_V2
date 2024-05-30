const Sequelize = require('sequelize');
const db = require('../models');
const getlogsBack = db.gestionLogsBack;

//* ➖ ➖ ➖ ➖ ➖ ➖ GET Température ➖ ➖ ➖ ➖ ➖ ➖ //
exports.getLogsBack = (req, res) => {
  getlogsBack
    .findAll()

    .then((logsBack) => {
      res.status(200).json({ logsBack });
    });
};

//* ➖ ➖ ➖ ➖ ➖ ➖ GET Data ➖ ➖ ➖ ➖ ➖ ➖ //
