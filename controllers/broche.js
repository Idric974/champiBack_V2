const io = require('socket.io-client');
const mcpadc = require('mcp-spi-adc');
let ValTemp;

//* ➖ ➖ ➖ ➖ ➖ ➖ Testeur broche ➖ ➖ ➖ ➖ ➖ ➖ //
exports.broche = (req, res, next) => {
  //let values = req.body;

  let numBroche = JSON.parse(req.body.numBroche);
  // console.log('Le numBroche', numBroche);

  let nbTour = JSON.parse(req.body.nbTour);
  // console.log('Le nbTour', nbTour);

  listVal = [];

  // Clacule des la temprature.

  function ArrayAvg(listVal) {
    let i = 0,
      summ = 0,
      ArrayLen = listVal.length;
    while (i < ArrayLen) {
      summ = summ + listVal[i++];
    }
    return summ / ArrayLen;
  }

  let calculeTemperatureMoyenne = () => {
    return new Promise((resolve) => {
      const tempSensor = mcpadc.open(numBroche, { speedHz: 20000 }, (err) => {
        if (err) throw err;

        for (let mesure = 0; mesure < nbTour; mesure++) {
          tempSensor.read((err, reading) => {
            if (err) throw err;
            listVal.push(reading.value * 40);
          });
        }
      });
      setTimeout(() => {
        resolve(ArrayAvg(listVal));
      }, 1000);
    });
  };

  let resultats = async () => {
    let temperatureMoyenneAir = await calculeTemperatureMoyenne();

    return temperatureMoyenneAir;
  };

  resultats()
    .then((temperatureMoyenneAir) => {
      // Calcule de la température.

      ValTemp = parseFloat(temperatureMoyenneAir.toFixed(1));
      // console.log(
      //   ' \x1b[33m ',
      //   "[ GESTION AIR ] Temperature Moyenne de l'air : ",
      //   ValTemp
      // );
    })
    .then(() => {
      // Initialisation socket.io Client
      // const socket = io('http://localhost:3001', {
      //   reconnection: true,
      // });
      // // socket.on('connect', () => {});
      // // Transmission des données au serveur.
      // socket.emit('infoFront', {
      //   valTempAir: ValTemp,
      // });
      //-----------------------------------------------------------
    });

  res.status(200).json({ message: 'Requete relay : OK' });
};
