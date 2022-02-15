module.exports = (sequelize, Sequelize) => {
  const gestionHumEtalonnageHumModels = sequelize.define(
    'gestion_hums_etalonnage_hums',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      etalonnageHum: {
        type: Sequelize.FLOAT,
      },
    }
  );

  return gestionHumEtalonnageHumModels;
};
