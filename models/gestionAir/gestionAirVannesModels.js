module.exports = (sequelize, Sequelize) => {
  const gestionAirVannesModels = sequelize.define('gestion_vannes', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    vanneActive: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

  });

  return gestionAirVannesModels;
};
