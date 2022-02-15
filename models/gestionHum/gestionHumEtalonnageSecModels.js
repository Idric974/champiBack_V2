module.exports = (sequelize, Sequelize) => {
  const gestionHumEtalonnageSecModels = sequelize.define(
    'gestion_hums_etalonnage_secs',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      etalonnageSec: {
        type: Sequelize.FLOAT,
      },
    }
  );

  return gestionHumEtalonnageSecModels;
};
