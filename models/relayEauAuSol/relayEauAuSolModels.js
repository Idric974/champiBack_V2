module.exports = (sequelize, Sequelize) => {
  const relayEauAuSol = sequelize.define('relay_eau_au_sol', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    etatRelayEauAuSol: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return relayEauAuSol;
};
