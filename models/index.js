const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD_CR,
  dialect: 'mysql',
  host: 'localhost',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    // console.log(
    //   '\x1b[32m',
    //   '[ NODE SERVER      ] Connexion à la base de données OK 😃'
    // );
  })

  .catch((err) => {
    console.log(
      '\x1b[32m',
      '[ NODE SERVER      ] Connexion à la base de données ❌❌ échouée ❌❌',
      err
    );
  });

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//? GestionAir

// Mesure.
db.gestionAir = require('./gestionAir/gestionAirModels')(sequelize, Sequelize);

// Data.
db.gestionAirData = require('./gestionAir/gestionAirsDataModels')(
  sequelize,
  Sequelize
);

// Etalonnage.
db.etalonnageAir = require('./gestionAir/gestionAirEtalonnageModels')(
  sequelize,
  Sequelize
);

// Etat relay.
db.gestionAirEtatRelay = require('./gestionAir/gestionAirEtatRelayModels')(
  sequelize,
  Sequelize
);

//* -----------------------------------------------------------------

//? Gestion Humidité.

// Mesure.
db.gestionHum = require('./gestionHum/gestionHumModels')(sequelize, Sequelize);

// Data.
db.gestionHumData = require('./gestionHum/gestionHumDataModels')(
  sequelize,
  Sequelize
);

// Etalonnage.
db.etalonnageSec = require('./gestionHum/gestionHumEtalonnageSecModels')(
  sequelize,
  Sequelize
);

db.etalonnageHum = require('./gestionHum/gestionHumEtalonnageHumModels')(
  sequelize,
  Sequelize
);

//* -----------------------------------------------------------------

//? Gestion Co2.

// Mesure.
db.gestionCo2 = require('./gestionCo2/gestionCo2Models')(sequelize, Sequelize);

// Data.
db.gestionCo2Data = require('./gestionCo2/gestionCo2DataModels')(
  sequelize,
  Sequelize
);

//? Gestion des log.

// Logs du back
db.gestionLogsBack = require('./logsModels/gestionLogsModels')(
  sequelize,
  Sequelize
);

module.exports = db;
