const schedule = require('node-schedule');

//*! 1) Gestion Air.

//? Calcules.

const gestionAir = schedule.scheduleJob(' */5 * * * * ', () => {
    var childProcess = require('child_process');

    function runScript(scriptPath, callback) {
        // keep track of whether callback has been invoked to prevent multiple invocations
        var invoked = false;

        var process = childProcess.fork(scriptPath);

        // listen for errors as they may prevent the exit event from firing
        process.on('error', function (err) {
            if (invoked) return;
            invoked = true;
            callback(err);
        });

        // execute the callback once the process has finished running
        process.on('exit', function (code) {
            if (invoked) return;
            invoked = true;
            var err = code === 0 ? null : new Error('exit code ' + code);
            callback(err);
        });
    }

    // Now we can run a script and invoke a callback when complete, e.g.
    runScript('./gestion/gestionAir/gestionAir.js', function (err) {
        if (err) throw err;
        // console.log(
        //   jaune,
        //   '[ GESTION AIR CRON TAB  ] CALCULES Calcules sont  terminés'
        // );
    });
});

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Consigne automatique AIR

const consigneAirAuto = schedule.scheduleJob(' 0 * * * * ', () => {
    var childProcess = require('child_process');

    function runScript(scriptPath, callback) {
        // keep track of whether callback has been invoked to prevent multiple invocations
        var invoked = false;

        var process = childProcess.fork(scriptPath);

        // listen for errors as they may prevent the exit event from firing
        process.on('error', function (err) {
            if (invoked) return;
            invoked = true;
            callback(err);
        });

        // execute the callback once the process has finished running
        process.on('exit', function (code) {
            if (invoked) return;
            invoked = true;
            var err = code === 0 ? null : new Error('exit code ' + code);
            callback(err);
        });
    }

    // Now we can run a script and invoke a callback when complete, e.g.
    runScript('./gestion/gestionAir/consigneAirAuto.js', function (err) {
        if (err) throw err;
        // console.log(
        //   jaune,
        //   '[ GESTION AIR CRON TAB  ] Gestion Consigne Automatique Air terminé'
        // );
    });
});

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//*! 2) Gestion humidité.

//? Calcules.

const gestionHum = schedule.scheduleJob(' */15 * * * * ', () => {
    // const gestionHum = schedule.scheduleJob(' */10 * * * * ', () => {
    var childProcess = require('child_process');

    function runScript(scriptPath, callback) {
        // keep track of whether callback has been invoked to prevent multiple invocations
        var invoked = false;

        var process = childProcess.fork(scriptPath);

        // listen for errors as they may prevent the exit event from firing
        process.on('error', function (err) {
            if (invoked) return;
            invoked = true;
            callback(err);
        });

        // execute the callback once the process has finished running
        process.on('exit', function (code) {
            if (invoked) return;
            invoked = true;
            var err = code === 0 ? null : new Error('exit code ' + code);
            callback(err);
        });
    }

    // Now we can run a script and invoke a callback when complete, e.g.
    runScript('./gestion/gestionHum/gestionHum.js', function (err) {
        if (err) throw err;
        // console.log(
        //   bleu,
        //   '[ GESTION HUM CRON TAB  ] GESTION HUMIDITÉ finished running some-script.js'
        // );
    });
});

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Consigne automatique Hum

const consigneHumAuto = schedule.scheduleJob(' */15  * * * * ', () => {
    var childProcess = require('child_process');

    function runScript(scriptPath, callback) {
        // keep track of whether callback has been invoked to prevent multiple invocations
        var invoked = false;

        var process = childProcess.fork(scriptPath);

        // listen for errors as they may prevent the exit event from firing
        process.on('error', function (err) {
            if (invoked) return;
            invoked = true;
            callback(err);
        });

        // execute the callback once the process has finished running
        process.on('exit', function (code) {
            if (invoked) return;
            invoked = true;
            var err = code === 0 ? null : new Error('exit code ' + code);
            callback(err);
        });
    }

    // Now we can run a script and invoke a callback when complete, e.g.
    runScript('./gestion/gestionHum/consigneHumAuto.js', function (err) {
        if (err) throw err;
        // console.log(
        //   bleu,
        //   '[ GESTION HUM CRON TAB  ] Gestion Consigne Automatique Hum terminé'
        // );
    });
});

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//*! 3) Gestion Co2

//? Calculs.

const gestionCo2 = schedule.scheduleJob(' 01 * * * * ', () => {
    var childProcess = require('child_process');

    function runScript(scriptPath, callback) {
        // keep track of whether callback has been invoked to prevent multiple invocations
        var invoked = false;

        var process = childProcess.fork(scriptPath);

        // listen for errors as they may prevent the exit event from firing
        process.on('error', function (err) {
            if (invoked) return;
            invoked = true;
            callback(err);
        });

        // execute the callback once the process has finished running
        process.on('exit', function (code) {
            if (invoked) return;
            invoked = true;
            var err = code === 0 ? null : new Error('exit code ' + code);
            callback(err);
        });
    }

    // Now we can run a script and invoke a callback when complete, e.g.
    runScript('./gestion/gestionCo2/gestionCo2.js', function (err) {
        if (err) throw err;
        // console.log(
        //   cyan,
        //   '[ GESTION CO2 CRON TAB  ] GESTION CO2 finished running some-script.js'
        // );
    });
});

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Consigne automatique Co2

const consigneCo2Auto = schedule.scheduleJob(' 02 * * * * ', () => {
    var childProcess = require('child_process');

    function runScript(scriptPath, callback) {
        // keep track of whether callback has been invoked to prevent multiple invocations
        var invoked = false;

        var process = childProcess.fork(scriptPath);

        // listen for errors as they may prevent the exit event from firing
        process.on('error', function (err) {
            if (invoked) return;
            invoked = true;
            callback(err);
        });

        // execute the callback once the process has finished running
        process.on('exit', function (code) {
            if (invoked) return;
            invoked = true;
            var err = code === 0 ? null : new Error('exit code ' + code);
            callback(err);
        });
    }

    // Now we can run a script and invoke a callback when complete, e.g.
    runScript('./gestion/gestionCo2/consigneCo2Auto.js', function (err) {
        if (err) throw err;
        // console.log(
        //   cyan,
        //   '[ GESTION CO2 CRON TAB  ] Gestion Consigne Automatique Co2 terminé'
        // );
    });
});

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//*! 4) Gestion Substrat cronTab.

//? Calcules.

// const gestionSubstrat = schedule.scheduleJob(' */5 * * * * ', () => {
//   var childProcess = require('child_process');

//   function runScript(scriptPath, callback) {
//     // keep track of whether callback has been invoked to prevent multiple invocations
//     var invoked = false;

//     var process = childProcess.fork(scriptPath);

//     // listen for errors as they may prevent the exit event from firing
//     process.on('error', function (err) {
//       if (invoked) return;
//       invoked = true;
//       callback(err);
//     });

//     // execute the callback once the process has finished running
//     process.on('exit', function (code) {
//       if (invoked) return;
//       invoked = true;
//       var err = code === 0 ? null : new Error('exit code ' + code);
//       callback(err);
//     });
//   }

//   // Now we can run a script and invoke a callback when complete, e.g.
//   runScript('./gestion/gestionSubstrat/gestionSubstrat.js', function (err) {
//     if (err) throw err;
//     // console.log(
//     //   jaune,
//     //   '[ GESTION AIR CRON TAB  ] CALCULES Calcules sont  terminés'
//     // );
//   });
// });

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
