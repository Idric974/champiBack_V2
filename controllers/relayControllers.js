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

let fermetureVanneFroid2 = 22;
let ouvertureVanneFroid2 = 23;

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

//*! ➖ ➖ ➖ ➖ ➖ ➖ Gestion relay Vanne Froid Etat ##1 ➖ ➖ ➖ ➖ ➖ ➖ //

exports.relayVanneFroid = (req, res, next) => {
  let relayVanneFroid = req.body.relayVanneFroid;

  // console.log('relayVanneFroid', relayVanneFroid);

  if (relayVanneFroid == 1) {
    let relay27On = () => {
      new Gpio(ouvertureVanneFroid1, 'out');
    };
    relay27On();
    // console.log('Le relayVanneFroid 1 est ON');
  }
  if (relayVanneFroid == 0) {
    let relay27Off = () => {
      new Gpio(fermetureVanneFroid1, 'in');
    };
    relay27Off();
    // console.log('Le relayVanneFroid 1 est OFF');
  }

  res.status(200).json({ message: 'Requete relayVanneFroid : OK' });
};

//*! ➖ ➖ ➖ ➖ ➖ ➖ Gestion relay Vanne Froid Etat ##2 ➖ ➖ ➖ ➖ ➖ ➖ //

exports.relayVanneFroid2 = (req, res, next) => {
  let relayVanneFroid2 = req.body.relayVanneFroid2;

  // console.log('relayVanneFroid2', relayVanneFroid2);

  if (relayVanneFroid2 == 1) {
    let relay27On = () => {
      new Gpio(ouvertureVanneFroid2, 'out');
    };
    relay27On();
    // console.log('Le relayVanneFroid 2 est ON');
  }
  if (relayVanneFroid2 == 0) {
    let relay27Off = () => {
      new Gpio(fermetureVanneFroid2, 'in');
    };
    relay27Off();
    // console.log('Le relayVanneFroid 2 est OFF');
  }

  res.status(200).json({ message: 'Requete relayVanneFroid2 : OK' });
};
