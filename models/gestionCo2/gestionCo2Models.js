module.exports = (sequelize, Sequelize) => {
  const gestionCo2Models = sequelize.define('gestion_co2s', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    tauxCo2: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    deltaCo2: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    daysCo2: {
      type: Sequelize.FLOAT,
    },

    heuresCo2: {
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

  return gestionCo2Models;
};
