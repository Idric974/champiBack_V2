// Les constantes

const io = require('socket.io-client');
const bleu = '\x1b[34m';
//-------------------------------------

// Les variables.

let Gpio = require('onoff').Gpio;
let test = 27;
let eauAuSol = 16; // 16
let ventilateur = 17; // 17

// Vanne Froid Etat :

let fermetureVanneFroid1 = 22;
let ouvertureVanneFroid1 = 23;

//-------------------------------------

// Initialisation socket.io Client

const socket = io('http://localhost:3003', {
  reconnection: true,
});

socket.on('connect', () => {
  // console.log(
  //   bleu,
  //   '[ SOCKET IO        ] Client Gestion des Relay connecté',
  //   socket.id
  // );
});
//-----------------------------------------------------------

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

  let etatRelay;

  if (relayVanneFroid == 'ON') {
    const relay_22_ON = new Gpio(22, 'out');

    const relay_23_ON = new Gpio(23, 'out');

    etatRelay = 5;

    res.status(200).json({ message: 'Relay Vanne Froid à 5 Secondes ON: OK' });

    console.log('Vanne froid 5S ON');

    setTimeout(() => {
      const relay_22_OFF = new Gpio(22, 'in');

      etatRelay = 0;

      // miseAjourEtatRelay();

      console.log('Vanne froid 5S OFF');
    }, 5000);
  }
  if (relayVanneFroid == 'OFF') {
    const relay_22_OFF = new Gpio(22, 'in');

    etatRelay = 0;

    // miseAjourEtatRelay();

    res.status(200).json({ message: 'Relay Vanne Froid à 5 Secondes OFF: OK' });

    console.log('Vanne froid 5S OFF');
  }
};

//*! ➖ ➖ ➖ ➖ ➖ ➖ Gestion relay Vanne Froid 40 secondes ➖ ➖ ➖ ➖ ➖ ➖ //

exports.relayVanneFroid40SecondesOn = (req, res, next) => {
  //
  let relayVanneFroid = req.body.etatRelay;

  let etatRelay;

  if (relayVanneFroid == 'ON') {
    const relay_22_ON = new Gpio(22, 'out');

    const relay_23_ON = new Gpio(23, 'out');

    etatRelay = 5;

    res.status(200).json({ message: 'Relay Vanne Froid à 40 Secondes ON: OK' });

    console.log('Vanne froid 40S ON');

    setTimeout(() => {
      const relay_22_OFF = new Gpio(22, 'in');

      etatRelay = 0;

      // miseAjourEtatRelay();

      console.log('Vanne froid 40S OFF');
    }, 40000);
  }
  if (relayVanneFroid == 'OFF') {
    const relay_22_OFF = new Gpio(22, 'in');

    etatRelay = 0;

    // miseAjourEtatRelay();

    res
      .status(200)
      .json({ message: 'Relay Vanne Froid à 40 Secondes OFF: OK' });

    console.log('Vanne froid 40S OFF');
  }
};
