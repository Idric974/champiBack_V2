module.exports = (sequelize, Sequelize) => {
  const gestionCourbesModels = sequelize.define('gestion_courbes', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    dateDemarrageCycle: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  return gestionCourbesModels;
};
