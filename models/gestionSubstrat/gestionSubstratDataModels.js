module.exports = (sequelize, Sequelize) => {
  const gestionSubstratDataModels = sequelize.define('gestion_substrats_datas', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    consigneMaxDataSubstrat: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    consigneMinDataSubstrat: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

  });

  return gestionSubstratDataModels;
};
