module.exports = (sequelize, Sequelize) => {
  const gestionCo2DataModels = sequelize.define('gestion_co2s_datas', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    consigneCo2: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    pasCo2: {
      type: Sequelize.FLOAT,
    },

    objectifCo2: {
      type: Sequelize.FLOAT,
    },
  });

  return gestionCo2DataModels;
};
