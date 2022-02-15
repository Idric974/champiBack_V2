module.exports = (sequelize, Sequelize) => {
  const gestionAirEtalonnageModels = sequelize.define(
    'gestion_airs_etalonnages',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      etalonnageAir: {
        type: Sequelize.FLOAT,
      },
    }
  );

  return gestionAirEtalonnageModels;
};
