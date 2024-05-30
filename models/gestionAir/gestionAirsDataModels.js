module.exports = (sequelize, Sequelize) => {
  const gestionAirsDataModels = sequelize.define('gestion_airs_datas', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    consigneAir: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    pasAir: {
      type: Sequelize.FLOAT,
    },

    objectifAir: {
      type: Sequelize.FLOAT,
    },
  });

  return gestionAirsDataModels;
};
