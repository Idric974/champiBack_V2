module.exports = (sequelize, Sequelize) => {
  const gestionHumModels = sequelize.define('gestion_hums', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    tauxHumidite: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    deltaHum: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    valeursMesureSec180: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    valeursMesureHum90: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    daysHum: {
      type: Sequelize.INTEGER,
    },

    heuresHum: {
      type: Sequelize.INTEGER,
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

  return gestionHumModels;
};
