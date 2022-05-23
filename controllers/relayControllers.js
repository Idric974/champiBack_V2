//! Les constantes

const Sequelize = require('sequelize');
const db = require('../models');
const gestionAirModels = db.gestionAir;
const relayBoutonEauAuSol = db.gestionEtatBoutonRelayEauAuSol;
const fs = require('fs');

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Les variables.

let Gpio = require('onoff').Gpio;
let test = 27;
let eauAuSol = 16; // 16
let ventilateur = 17; // 17
let etatRelay;

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Les fonctions.

//? Mise à jour etat Relay.

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

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Mise à jour etat Relay.

miseAjourActionRelay = () => {
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
        .update({ actionRelay: actionRelay }, { where: { id: lastId } })

        .then(function (result) {
          console.log('result etat relay =======> ' + result);
        })

        .catch((err) => console.log(err));
    });
};

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Recuperation état Relay.

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

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Mise à etat Relay eau au sol.

miseAjourEtatRelayEauAuSol = () => {
  relayEauAuSol
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      relayEauAuSol
        .update({ etatRelayEauAuSol: 1 }, { where: { id: lastId } })

        .then(function (result) {
          console.log('result etat relay =======> ' + result);
        })

        .catch((err) => console.log(err));
    });
};

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖

//! Les requêtes.

//? Mise à zéro etat vanne.

exports.miseAZeroEtatVanne = (res, req) => {
  const miseAJourEtatRelay = db.gestionAir;

  const newEtalAir = miseAJourEtatRelay
    .findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
      raw: true,
    })
    .then((id) => {
      // console.log('Le dernier id de gestionAir est : ', id);
      // console.log(id.maxid);
      lastId = id.maxid;

      miseAJourEtatRelay
        .update({ etatRelay: 0 }, { where: { id: lastId } })

        .then(() => {
          console.log('Data Air enregitrées dans la base gestion_airs');
        })

        .catch((err) => console.log(err));
    });
};

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Gestion etat bouton relay eau au sol.

exports.getEtatBoutonEauAuSol = (req, res) => {
  try {
    relayBoutonEauAuSol
      .findOne({
        attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
        raw: true,
      })
      .then((id) => {
        // console.log('Le dernier id de gestionAir est : ', id);
        // console.log(id.maxid);

        relayBoutonEauAuSol
          .findOne({
            where: { id: id.maxid },
          })
          .then((etatBoutonEauAuSol) => {
            res.status(200).json({ etatBoutonEauAuSol });
          });
      });
  } catch (error) {
    console.error(error);
  }
};

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Activer ou désactiver l’eau au sol.

let etatRelayEauAuSol;

exports.relayEauAuSol = (req, res) => {
  //
  //* 1) Determiner la position du boutton.

  const maPromesse = new Promise((resolve, reject) => {
    try {
      relayBoutonEauAuSol
        .findOne({
          attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
          raw: true,
        })
        .then((id) => {
          // console.log('Le dernier id de gestionAir est : ', id);
          // console.log(id.maxid);

          relayBoutonEauAuSol
            .findOne({
              where: { id: id.maxid },
            })
            .then((result) => {
              etatRelayEauAuSol = result['etatRelayEauAuSol'];
              resolve();

              console.log(
                'Etat Relay au eau au Sol de départ : ',
                etatRelayEauAuSol
              );
            });
        });
    } catch (error) {
      console.error(error);
      reject();
    }
  });

  let action = async () => {
    let go = await maPromesse;
    return go;
  };

  action()
    //
    //* Activer ou désactiver l’eau au sol.

    .then(() => {
      if (etatRelayEauAuSol === 0) {
        //

        // const relayOn = new Gpio(27, 'out');
        const relayOn = new Gpio(eauAuSol, 'out');
        console.log('Relay au sol = On');

        //* Mise à jour de la basede donnée.

        relayBoutonEauAuSol
          .findOne({
            attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
            raw: true,
          })
          .then((id) => {
            // console.log('Le dernier id de gestionAir est : ', id);
            // console.log(id.maxid);
            lastId = id.maxid;

            relayBoutonEauAuSol
              .update({ etatRelayEauAuSol: 1 }, { where: { id: lastId } })

              .then(function (result) {
                console.log('Activation relay ===> ', result);
              })

              .catch((err) => console.log(err));
          });

        setTimeout(() => {
          // const relayOn = new Gpio(27, 'in');
          const relayOn = new Gpio(eauAuSol, 'out');
          console.log('Relay au sol = Off');

          //* Mise à jour de la basede donnée.

          relayBoutonEauAuSol
            .findOne({
              attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
              raw: true,
            })
            .then((id) => {
              // console.log('Le dernier id de gestionAir est : ', id);
              // console.log(id.maxid);
              lastId = id.maxid;

              relayBoutonEauAuSol
                .update({ etatRelayEauAuSol: 0 }, { where: { id: lastId } })

                .then(function (result) {
                  console.log(
                    'Déactivation relay après seTimeout  ===> ',
                    result
                  );
                })

                .catch((err) => console.log(err));
            });

          res.status(200).json({ message: 'Eau au sol déactivé ✅' });

          //*-------------------------------------
        }, 120000);
      } else if (etatRelayEauAuSol === 1) {
        //
        // const relayOff = new Gpio(27, 'in');
        const relayOff = new Gpio(eauAuSol, 'in');
        console.log('Relay au sol = Off');

        //* Mise à jour de la basede donnée.

        relayBoutonEauAuSol
          .findOne({
            attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
            raw: true,
          })
          .then((id) => {
            // console.log('Le dernier id de gestionAir est : ', id);
            // console.log(id.maxid);
            lastId = id.maxid;

            relayBoutonEauAuSol
              .update({ etatRelayEauAuSol: 0 }, { where: { id: lastId } })

              .then(function (result) {
                console.log('Déactivation relay au clic  ===> ', result);
              })

              .catch((err) => console.log(err));
          });

        //*-------------------------------------

        res.status(200).json({ message: 'Eau au sol déactivé ✅' });
      }
    })

    //*---------------------------------------------------

    //* Réecriture du fichier.

    .then(() => {})

    //*---------------------------------------------------

    //* Catch des erreur.

    .catch((e) => {
      console.log(e);
    });

  //*---------------------------------------------------
};

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Gestion relay Ventilateur humidité.

exports.relayVentilo = (req, res, next) => {
  let relayVentilo = req.body.relayVentilo;

  if (relayVentilo == 1) {
    const relay27On = new Gpio(ventilateur, 'out');
    // const relay27On = new Gpio(27, 'out');

    res.status(200).json({ message: 'ventilateur ON' });
  }
  if (relayVentilo == 0) {
    const relay27On = new Gpio(ventilateur, 'in');
    // const relay27On = new Gpio(27, 'in');

    res.status(200).json({ message: 'ventilateur OFF' });
  }
};

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Gestion relay Vanne Froid à 5 secondes.

exports.relayVanneFroid5SecondesOn = (req, res, next) => {
  //
  let relayVanneFroid = req.body.etatRelay;

  if (relayVanneFroid == 'ON') {
    actionRelay = 1;
    miseAjourActionRelay();

    recuperationEtatRlay();

    const relay_22_ON = new Gpio(23, 'out'); //! << Mode Test >>
    // const relay_22_ON = new Gpio(27, 'out');

    res.status(200).json({ message: 'Relay Vanne Froid à 5 Secondes ON: OK' });

    setTimeout(() => {
      //
      const relay_22_OFF = new Gpio(23, 'in');
      // const relay_22_OFF = new Gpio(27, 'in'); //! << Mode Test >>

      if (valEtatRelay >= 100) {
        etatRelay = 100;
      } else {
        etatRelay = valEtatRelay + 12.5;
      }

      actionRelay = 0;
      miseAjourActionRelay();

      miseAjourEtatRelay();
    }, 5000);
  }
  if (relayVanneFroid == 'OFF') {
    actionRelay = 1;
    miseAjourActionRelay();

    recuperationEtatRlay();

    const relay_22_ON = new Gpio(22, 'out');
    //const relay_22_ON = new Gpio(27, 'out'); //! << Mode Test >>

    setTimeout(() => {
      const relay_22_OFF = new Gpio(22, 'in');
      // const relay_22_OFF = new Gpio(27, 'in'); //! << Mode Test >>

      if (valEtatRelay <= 0) {
        etatRelay = 0;
      } else {
        etatRelay = valEtatRelay - 12.5;
      }

      actionRelay = 0;
      miseAjourActionRelay();

      miseAjourEtatRelay();
    }, 5000);

    res.status(200).json({ message: 'Relay Vanne Froid à 5 Secondes OFF: OK' });
  }
};

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//? Gestion relay Vanne Froid 40 secondes.

exports.relayVanneFroid40SecondesOn = (req, res, next) => {
  //
  let relayVanneFroid = req.body.etatRelay;

  if (relayVanneFroid == 'ON') {
    actionRelay = 1;
    miseAjourActionRelay();

    recuperationEtatRlay();

    const relay_22_ON = new Gpio(23, 'out');
    // const relay_22_OFF = new Gpio(27, 'out'); //! << Mode Test >>

    res.status(200).json({ message: 'Relay Vanne Froid à 40 Secondes ON: OK' });

    setTimeout(() => {
      const relay_22_OFF = new Gpio(23, 'in');
      // const relay_22_OFF = new Gpio(27, 'in'); //! << Mode Test >>

      if (valEtatRelay >= 100) {
        etatRelay = 100;
      } else {
        etatRelay = valEtatRelay + 100;
      }

      actionRelay = 0;
      miseAjourActionRelay();

      miseAjourEtatRelay();
    }, 40000);
  }
  if (relayVanneFroid == 'OFF') {
    actionRelay = 1;
    miseAjourActionRelay();

    recuperationEtatRlay();

    const relay_22_ON = new Gpio(22, 'out');
    // const relay_22_OFF = new Gpio(27, 'out'); //! << Mode Test >>

    setTimeout(() => {
      const relay_22_OFF = new Gpio(22, 'in');
      //const relay_22_OFF = new Gpio(27, 'in'); //! << Mode Test >>

      if (valEtatRelay <= 0) {
        etatRelay = 0;
      } else {
        etatRelay = valEtatRelay - 100;
      }

      actionRelay = 0;
      miseAjourActionRelay();

      miseAjourEtatRelay();
    }, 40000);

    res
      .status(200)
      .json({ message: 'Relay Vanne Froid à 40 Secondes OFF: OK' });
  }
};

//? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//! ➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
