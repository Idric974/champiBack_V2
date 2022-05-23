const mcpadc = require('mcp-spi-adc');
let mcpBroche = 2; // Broche 2.

listValAir = [];

let test = () => {
  const tempSensor = mcpadc.open(mcpBroche, { speedHz: 20000 }, (err) => {
    if (err) throw err;

    tempSensor.read((err, reading) => {
      if (err) throw err;
      listValAir.push(reading.value * 40);
      console.log('[ GESTION AIR CALCULES  ] listValAir', listValAir);
    });
  });
};

test();
