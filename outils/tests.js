const Gpio = require('onoff').Gpio;

let relay = 27;
let duree = 3000;

let activationRelay = (relay, duree) => {
  const relay_ON = new Gpio(relay, 'out');
  console.log('Hello');

  setTimeout(() => {
    const relay_OFF = new Gpio(relay, 'in');
    console.log('ReHello');
  }, duree);
};
activationRelay(27, 3000);
