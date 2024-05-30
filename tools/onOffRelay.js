const Gpio = require('onoff').Gpio; // Gpio class

try {
  const relay = new Gpio(17, 'out'); // Use GPIO pin 17, and specify that it is an output

  // Toggle the relay state every second
  setInterval(() => {
    const value = relay.readSync(); // 1 = on, 0 = off
    relay.writeSync(value ^ 1);     // Toggle the state
  }, 1000);

  // Clean up when exiting
  process.on('SIGINT', () => {
    relay.unexport();
    process.exit();
  });
} catch (err) {
  console.error('Failed to initialize GPIO', err);
}