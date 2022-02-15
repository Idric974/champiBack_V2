module.exports = (sequelize, Sequelize) => {
  const gestionHumDataModels = sequelize.define('gestion_hums_datas', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    consigneHum: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },

    pasHum: {
      type: Sequelize.FLOAT,
    },

    objectifHum: {
      type: Sequelize.FLOAT,
    },
  });

  return gestionHumDataModels;
};
