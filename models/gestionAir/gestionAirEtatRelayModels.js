module.exports = (sequelize, Sequelize) => {
  const gestionAirEtatRelayModels = sequelize.define(
    'gestion_airs_etat_relays',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

      etatRelay: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    }
  );

  return gestionAirEtatRelayModels;
};
