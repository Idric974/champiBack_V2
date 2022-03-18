//! Les constantes

const Sequelize = require('sequelize');
const db = require('../models');
const gestionAirModels = db.gestionAir;
//⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

//! Les variables.

let Gpio = require('onoff').Gpio;
let test = 27;
let eauAuSol = 16; // 16
let ventilateur = 17; // 17
let etatRelay;
//⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

//! Les fonctions.

miseAjourEtatRelay = () => {
  gestionAirModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      gestionAirModels
        .update({ etatRelay: etatRelay }, { where: { id: lastId } })

        .then(function (result) {
          console.log('result etat relay =======> ' + result);
        })

        .catch((err) => console.log(err));
    });
};

let valEtatRelay;

recuperationEtatRlay = () => {
  gestionAirModels
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);

      gestionAirModels
        .findOne({
          where: { id: id.maxid },
        })
        .then((result) => {
          valEtatRelay = result['etatRelay'];

          // console.log('valEtatRelay : ' + valEtatRelay);
          // console.log('valEtatRelay : ' + typeof valEtatRelay);
        });
    });
};

//!⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐

//* ➖ ➖ ➖ ➖ ➖ ➖ Testeur relay ➖ ➖ ➖ ➖ ➖ ➖ //

exports.relay = (req, res, next) => {
  let newRelay = req.body.relay;

  if (newRelay == 1) {
    let relay27On = () => {
      new Gpio(test, 'out');
    };
    relay27On();
    // console.log('Le ralay est ON');
  }
  if (newRelay == 0) {
    let relay27Off = () => {
      new Gpio(test, 'in');
    };
    relay27Off();
    // console.log('Le ralay est OFF');
  }

  res.status(200).json({ message: 'Requete relay : OK' });
};

//*! ➖ ➖ ➖ ➖ ➖ ➖ Gestion relay eau au sol ➖ ➖ ➖ ➖ ➖ ➖ //

exports.relayEau = (req, res, next) => {
  let relayEau = req.body.relayEau;

  // console.log('relayEau', relayEau);

  if (relayEau == 1) {
    let relay27On = () => {
      new Gpio(eauAuSol, 'out');
    };
    relay27On();
    // console.log('Le relayEau est ON');
  }
  if (relayEau == 0) {
    let relay27Off = () => {
      new Gpio(eauAuSol, 'in');
    };
    relay27Off();
    // console.log('Le relayEau est OFF');
  }

  res.status(200).json({ message: 'Requete relayEau : OK' });
};

//*! ➖ ➖ ➖ ➖ ➖ ➖ Gestion relay Ventilateur humidité ➖ ➖ ➖ ➖ ➖ ➖ //

exports.relayVentilo = (req, res, next) => {
  let relayVentilo = req.body.relayVentilo;

  // console.log('relayVentilo', relayVentilo);

  if (relayVentilo == 1) {
    let relay27On = () => {
      new Gpio(ventilateur, 'out');
    };
    relay27On();
    // console.log('Le relayVentilo est ON');
  }
  if (relayVentilo == 0) {
    let relay27Off = () => {
      new Gpio(ventilateur, 'in');
    };
    relay27Off();
    // console.log('Le relayVentilo est OFF');
  }

  res.status(200).json({ message: 'Requete relayVentilo : OK' });
};

//*! ➖ ➖ ➖ ➖ ➖ ➖ Gestion relay Vanne Froid à 5 secondes ➖ ➖ ➖ ➖ ➖ ➖ //

exports.relayVanneFroid5SecondesOn = (req, res, next) => {
  //
  let relayVanneFroid = req.body.etatRelay;

  if (relayVanneFroid == 'ON') {
    recuperationEtatRlay();

    // setTimeout(() => {
    //   console.log('etatRelayBDD ++++++++++> ' + valEtatRelay);
    // }, 500);

    const relay_22_ON = new Gpio(23, 'out');

    res.status(200).json({ message: 'Relay Vanne Froid à 5 Secondes ON: OK' });

    setTimeout(() => {
      const relay_22_OFF = new Gpio(22, 'in');

      if (valEtatRelay >= 40000) {
        etatRelay = 40000;
      } else {
        etatRelay = valEtatRelay + 5000;
      }

      miseAjourEtatRelay();
    }, 5000);
  }
  if (relayVanneFroid == 'OFF') {
    recuperationEtatRlay();

    // setTimeout(() => {
    //   console.log('etatRelayBDD ----------> ' + valEtatRelay);
    // }, 500);

    const relay_22_ON = new Gpio(23, 'out');

    setTimeout(() => {
      const relay_22_OFF = new Gpio(22, 'in');

      if (valEtatRelay <= 0) {
        etatRelay = 0;
      } else {
        etatRelay = valEtatRelay - 5000;
      }

      miseAjourEtatRelay();
    }, 5000);

    res.status(200).json({ message: 'Relay Vanne Froid à 5 Secondes OFF: OK' });
  }
};

//*! ➖ ➖ ➖ ➖ ➖ ➖ Gestion relay Vanne Froid 40 secondes ➖ ➖ ➖ ➖ ➖ ➖ //

exports.relayVanneFroid40SecondesOn = (req, res, next) => {
  //
  let relayVanneFroid = req.body.etatRelay;

  if (relayVanneFroid == 'ON') {
    recuperationEtatRlay();

    // setTimeout(() => {
    //   console.log('etatRelayBDD ++++++++++> ' + valEtatRelay);
    // }, 500);

    const relay_22_ON = new Gpio(23, 'out');

    res.status(200).json({ message: 'Relay Vanne Froid à 40 Secondes ON: OK' });

    setTimeout(() => {
      const relay_22_OFF = new Gpio(22, 'in');

      if (valEtatRelay >= 40000) {
        etatRelay = 40000;
      } else {
        etatRelay = valEtatRelay + 40000;
      }

      miseAjourEtatRelay();
    }, 40000);
  }
  if (relayVanneFroid == 'OFF') {
    recuperationEtatRlay();

    // setTimeout(() => {
    //   console.log('etatRelayBDD ----------> ' + valEtatRelay);
    // }, 500);

    const relay_22_ON = new Gpio(23, 'out');

    setTimeout(() => {
      const relay_22_OFF = new Gpio(22, 'in');

      if (valEtatRelay <= 0) {
        etatRelay = 0;
      } else {
        etatRelay = valEtatRelay - 40000;
      }

      miseAjourEtatRelay();
    }, 40000);

    res
      .status(200)
      .json({ message: 'Relay Vanne Froid à 40 Secondes OFF: OK' });
  }
};
