module.exports = (sequelize, Sequelize) => {
  const gestionAirModels = sequelize.define('gestion_airs', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    temperatureAir: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    deltaAir: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    days: {
      type: Sequelize.FLOAT,
    },

    heures: {
      type: Sequelize.FLOAT,
    },

    actionRelay: {
      type: Sequelize.FLOAT,
    },

    etatRelay: {
      type: Sequelize.FLOAT,
    },

    consigne: {
      type: Sequelize.STRING,
    },

    valeurAxeX: {
      type: Sequelize.STRING,
    },

    jourDuCycle: {
      type: Sequelize.STRING,
    },
  });

  return gestionAirModels;
};
