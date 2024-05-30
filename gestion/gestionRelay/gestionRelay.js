//! Les constantes.

const axios = require('axios');

//! -------------------------------------------------- !

//! Rafraichissement de la page.

setInterval(() => {
  window.location.reload();
}, 1800000);

let myDate = new Date();
let date = myDate.toLocaleString();

console.log('Page actualisée le : ' + date);

//! -------------------------------------------------

//! Afficher la date.

function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function afficherDate() {
  while (true) {
    await pause(1000);
    var cejour = new Date();
    var options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
    var date = cejour.toLocaleDateString('fr-RU', options);
    var heure =
      ('0' + cejour.getHours()).slice(-2) +
      ':' +
      ('0' + cejour.getMinutes()).slice(-2) +
      ':' +
      ('0' + cejour.getSeconds()).slice(-2);
    var dateheure = date + ' ' + heure;
    var dateheure = dateheure.replace(/(^\w{1})|(\s+\w{1})/g, (lettre) =>
      lettre.toUpperCase()
    );
    document.getElementById('afficheDate').innerHTML = dateheure;
  }
}

afficherDate();

//! -------------------------------------------------

//! Gestion de l'eau au sol.

//? Récupération de l’état du bouton eau au sol.

let etatBoutonEauAuSol;

let getEtatBoutonEauAuSol = () => {
  axios
    .get('http://localhost:3003/api/relayRoutes/getEtatBoutonEauAuSol/')
    .then(function (response) {
      etatBoutonEauAuSol = response.data.etatBoutonEauAuSol.etatRelayEauAuSol;
      console.log('etatBoutonEauAuSol : ', etatBoutonEauAuSol);
    })
    .then(() => {
      if (etatBoutonEauAuSol == 0) {
        let element = document.getElementById('btnRelayEauSol');
        element.style.backgroundColor = 'green';
        element.innerHTML = 'Activation';
      } else {
        let element = document.getElementById('btnRelayEauSol');
        element.style.backgroundColor = 'red';
        element.innerHTML = 'Eau au sol activée';
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};
getEtatBoutonEauAuSol();

//! -------------------------------------------------

//! Clic sur le bouton eau au sol.

document
  .getElementById('btnRelayEauSol')
  .addEventListener('click', function () {
    //
    let element = document.getElementById('btnRelayEauSol');
    element.style.backgroundColor = 'red';
    element.innerHTML = 'Eau au sol activée';

    axios
      .get('http://localhost:3003/api/relayRoutes/relayEauAuSol/')
      .then(function (response) {
        console.log(response.data);

        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  });

//! -------------------------------------------------

//! Gestion ventilateur humidité.

let ventilateurHumidite = 0;

//? Ventilateur ON.

document
  .getElementById('ventilateurHumiditeOn')
  .addEventListener('click', function () {
    //
    // console.log('Ventilateur Humidite ON');

    ventilateurHumidite = 1;

    axios
      .post('http://localhost:3003/api/relayRoutes/relayVentilo/', {
        relayVentilo: ventilateurHumidite,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

//? -------------------------------------------------

//? Ventilateur OFF.
document
  .getElementById('ventilateurHumiditeOff')
  .addEventListener('click', function () {
    //
    // console.log('Ventilateur Humidite OFF');
    ventilateurHumidite = 0;

    axios
      .post('http://localhost:3003/api/relayRoutes/relayVentilo/', {
        relayVentilo: ventilateurHumidite,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });

//? -------------------------------------------------

//! -------------------------------------------------

//! Gestion vanne froid état.

//? Mise a zero de l'étatvanne.

let miseAZeroEtatVanne = () => {
  axios
    .post('http://localhost:3003/api/relayRoutes/miseAZeroEtatVanne/', {
      etatVanne: 'ZERO',
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

//! -------------------------------------------------

//! Affichage de l'état de la vanne froid.

let etatRelay;
let etatRelayBrute;
let etatRelayLocalStorage;

let afficheEtatRelay = () => {
  axios
    .get('http://localhost:3003/api/gestionAirRoutes/getTemperatureAir/')
    .then(function (response) {
      etatRelayBrute = response.data.temperatureAir.etatRelay;
      // console.log('etatRelayBrute ===> ' + etatRelayBrute);
      // console.log('etatRelayBrute ===> ' + typeof etatRelayBrute);
      etatRelayLocalStorage = etatRelayBrute;
    })

    .then(() => {
      etatRelay = JSON.stringify(etatRelayLocalStorage);

      localStorage.setItem('Etat relay : ', etatRelay);

      document.getElementById('etatRelay').innerHTML =
        'Etat Vanne froid à : ' + etatRelay + '%';
    })
    .catch(function (error) {
      console.log(error);
    });
};

afficheEtatRelay();

//! -------------------------------------------------

//! Gestion de vanne frois à 5 secondes ON.

document
  .getElementById('vanneFroid5SesoncdesOn')
  .addEventListener('click', function () {
    //
    let valeurEtatVanne;

    let captureEtatRelay = () => {
      axios
        .get('http://localhost:3003/api/gestionAirRoutes/getTemperatureAir/')
        .then(function (response) {
          // console.log(response.data.temperatureAir.actionRelay);

          valeurEtatVanne = response.data.temperatureAir.actionRelay;
          // console.log(
          //   'Valeur de la vanne au clic' + typeof valeurEtatVanne
          // );
          // console.log(
          //   'TYPE de valeur de la vanne au clic' + valeurEtatVanne
          // );
        })

        .then(() => {
          if (valeurEtatVanne == 1) {
            afficheEtatRelay();
            alert('ATTENTION!! ACTION VANNE EN COURS');
            return;
          } else if (etatRelayBrute >= 100) {
            alert('VANNE DEJA OUVERTE À 100%');
            return;
          } else {
            console.log('Vanne froid à 5 secondes ON');
            let etatVanne = 'ON';

            axios
              .post(
                'http://localhost:3003/api/relayRoutes/relayVanneFroid5SecondesOn/',
                {
                  etatRelay: etatVanne,
                }
              )
              .then(function (response) {
                console.log(response.data);
                console.log('Clic sur bouton ouverture à 5s');
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    captureEtatRelay();

    setTimeout(() => {
      afficheEtatRelay();
    }, 6000);
  });

//! -------------------------------------------------

//! Gestion de vanne frois à 5 secondes OFF.

document
  .getElementById('vanneFroid5SesoncdesOff')
  .addEventListener('click', function () {
    //
    let valeurEtatVanne;

    let captureEtatRelay = () => {
      axios
        .get('http://localhost:3003/api/gestionAirRoutes/getTemperatureAir/')
        .then(function (response) {
          // console.log(response.data.temperatureAir.actionRelay);

          valeurEtatVanne = response.data.temperatureAir.actionRelay;
          // console.log(
          //   'Valeur de la vanne au clic' + typeof valeurEtatVanne
          // );
          // console.log(
          //   'TYPE de valeur de la vanne au clic' + valeurEtatVanne
          // );
        })

        .then(() => {
          if (valeurEtatVanne == 1) {
            afficheEtatRelay();
            alert('ATTENTION!! ACTION VANNE EN COURS');
            return;
          } else if (etatRelayBrute <= 0) {
            alert('VANNE DEJA FERMÉE');
          } else {
            // console.log('Vanne froid à 5 secondes OFF');
            let etatVanne = 'OFF';

            axios
              .post(
                'http://localhost:3003/api/relayRoutes/relayVanneFroid5SecondesOn/',
                {
                  etatRelay: etatVanne,
                }
              )
              .then(function (response) {
                console.log(response.data);
                console.log('Clic sur bouton fermeture à 5s');
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    captureEtatRelay();

    setTimeout(() => {
      afficheEtatRelay();
    }, 6000);
  });

//! -------------------------------------------------

//! Gestion de vanne frois à 40 secondes ON.

document
  .getElementById('vanneFroid40SesoncdesOn')
  .addEventListener('click', function () {
    // console.log('Vanne froid à 40 secondes ON');

    let valeurEtatVanne;

    let captureEtatRelay = () => {
      axios
        .get('http://localhost:3003/api/gestionAirRoutes/getTemperatureAir/')
        .then(function (response) {
          // console.log(response.data.temperatureAir.actionRelay);

          valeurEtatVanne = response.data.temperatureAir.actionRelay;
          // console.log(
          //   'Valeur de la vanne au clic' + typeof valeurEtatVanne
          // );
          // console.log(
          //   'TYPE de valeur de la vanne au clic' + valeurEtatVanne
          // );
        })

        .then(() => {
          if (valeurEtatVanne == 1) {
            afficheEtatRelay();
            alert('ATTENTION!! ACTION VANNE EN COURS');
            return;
          } else if (etatRelayBrute >= 100) {
            alert('VANNE DEJA OUVERTE À 100%');
            return;
          } else {
            console.log('Vanne froid à 40 secondes ON');
            let etatVanne = 'ON';

            axios
              .post(
                'http://localhost:3003/api/relayRoutes/relayVanneFroid40SecondesOn/',
                {
                  etatRelay: etatVanne,
                }
              )
              .then(function (response) {
                console.log(response.data);
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    captureEtatRelay();

    setTimeout(() => {
      afficheEtatRelay();
    }, 40500);
  });

//? Gestion de vanne frois à 40 secondes OFF.

document
  .getElementById('vanneFroid40SesoncdesOff')
  .addEventListener('click', function () {
    // console.log('Vanne froid à 40 secondes OFF');

    let valeurEtatVanne;

    let captureEtatRelay = () => {
      axios
        .get('http://localhost:3003/api/gestionAirRoutes/getTemperatureAir/')
        .then(function (response) {
          // console.log(response.data.temperatureAir.actionRelay);

          valeurEtatVanne = response.data.temperatureAir.actionRelay;
          // console.log(
          //   'Valeur de la vanne au clic' + typeof valeurEtatVanne
          // );
          // console.log(
          //   'TYPE de valeur de la vanne au clic' + valeurEtatVanne
          // );
        })

        .then(() => {
          if (valeurEtatVanne == 1) {
            afficheEtatRelay();
            alert('ATTENTION!! ACTION VANNE EN COURS');
            return;
          } else if (etatRelayBrute <= 0) {
            alert('VANNE DEJA FERMÉE');
          } else {
            console.log('Vanne froid à 40 secondes OFF');

            let etatVanne = 'OFF';

            axios
              .post(
                'http://localhost:3003/api/relayRoutes/relayVanneFroid40SecondesOn/',
                {
                  etatRelay: etatVanne,
                }
              )
              .then(function (response) {
                console.log(response.data);
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    captureEtatRelay();

    setTimeout(() => {
      afficheEtatRelay();
    }, 40500);
  });

//! -------------------------------------------------


