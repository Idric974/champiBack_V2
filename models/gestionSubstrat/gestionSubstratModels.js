module.exports = (sequelize, Sequelize) => {
  const gestionSubstratModels = sequelize.define('gestion_substrats', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    temperatureSubstrat: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    actionRelay: {
      type: Sequelize.FLOAT,
    },

    etatRelay: {
      type: Sequelize.FLOAT,
    },

    valeurAxeX: {
      type: Sequelize.STRING,
    },

    jourDuCycle: {
      type: Sequelize.STRING,
    },
  });

  return gestionSubstratModels;
};
