module.exports = (sequelize, Sequelize) => {
  const gestionLogsModels = sequelize.define('gestion_logs', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    fichier: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    nomModule: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    typeErreur: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });

  return gestionLogsModels;
};
