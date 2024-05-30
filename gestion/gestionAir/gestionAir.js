//! Les constantes.

const Gpio = require('onoff').Gpio;
const jaune = '\x1b[33m';
const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../../models');
const axios = require('axios');
const numSalle = require('../../configNumSalle');

//! -------------------------------------------------- !

// ! Les fonctions appelées.


//? Mise à jour de l'état des relay.

let etatRelay;

let miseAjourEtatRelay = () => {
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
                .update(
                    { actionRelay: actionRelay, etatRelay: etatRelay },
                    { where: { id: lastId } }
                )

                .then(function (result) {
                    // console.log('Nb mise à jour data =======> ' + result);
                })

                .catch((err) => console.log(err));
        });
};

//? --------------------------------------------------

//? Envoyer un SMS d’alerte.

const sendSMS = (temperatureDuMessage) => {

    console.log('temperatureDuMessage :', temperatureDuMessage);

    //! Url de la master.
    const url = 'http://192.168.1.10:5000/api/postSms/postSms';

    let date1 = new Date();

    let dateLocale = date1.toLocaleString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });

    let message = `ALERTE : Salle ${numSalle} | ${temperatureDuMessage} | ${dateLocale}`;

    axios
        .post(url, {
            message,
        })
        .then(function (response) {
            console.log('Reponse de SMS808 : ', response.data);

        })
        .catch(function (error) {
            console.log(error);

        });

}

//? --------------------------------------------------

//! --------------------------------------------------

//! Les fonctions asynchrones.

//? Recupération de la vanne à utiliser.

let relayVanne;
let vanneActive;

const gestionAirVannesModels = db.gestionAirVannes;

let recuperationDeLaVanneActive = () => {
    return new Promise((resolve, reject) => {

        try {
            gestionAirVannesModels
                .findOne({
                    attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
                    raw: true,
                })
                .then((id) => {
                    // console.log(id.maxid);

                    gestionAirVannesModels
                        .findOne({
                            where: { id: id.maxid },
                        })
                        .then((result) => {
                             console.log(result.vanneActive);
                             vanneActive = result.vanneActive;
                            
                        })
                        .then(() => {
                            if (vanneActive === "a") {
                                relayVanne = 23
                                console.log("relayVanne ==> ",relayVanne);
                                resolve();
                             }
                             
                             if (vanneActive === "b") {
                                relayVanne = 24
                                 console.log("relayVanne ==> ",relayVanne);
                                 resolve();
                              }
                            
                        });
                });
        } catch (error) {

            console.log("❌ %c ERREUR ==> gestions Air ==> Récupération de l'étalonage",
                'color: orange', error);

            reject();
        }
    });
}

//? --------------------------------------------------

//? Récupération de la consigne.

let consigne;
let pas;
let objectif;

const gestionAirsDataModels = db.gestionAirData;

let recupérationDeLaConsigne = () => {
    return new Promise((resolve, reject) => {

        try {
            gestionAirsDataModels
                .findOne({
                    attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
                    raw: true,
                })
                .then((id) => {
                    // console.log(id.maxid);

                    gestionAirsDataModels
                        .findOne({
                            where: { id: id.maxid },
                        })
                        .then((result) => {
                            // console.log(result);

                            lastId = result['id'];
                            // console.log('LastId :   ', lastId);

                            consigne = result['consigneAir'];

                            // console.log(
                            //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération de la Consigne Air ============>",
                            //     'color: green', consigne
                            // );

                            pas = result['pasAir'];

                            // console.log(
                            //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération du Pas Air ====================>",
                            //     'color: green', pas
                            // );

                            objectif = result['objectifAir'];

                            // console.log(
                            //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération de l'Objectif Air =============>",
                            //     'color: green', objectif
                            // );
                        })
                        .then(() => {

                            resolve();

                        });
                });
        } catch (error) {

            console.log('❌ %c ERREUR ==> gestions Air ==> Récupération de la consigne',
                'color: orange', error);

            reject();
        }

    });
}

//? --------------------------------------------------

//? Récupération de l'étalonage.

const gestionAirEtalonnageModels = db.etalonnageAir;

let recuperationDeEtalonage = () => {
    return new Promise((resolve, reject) => {

        try {
            gestionAirEtalonnageModels
                .findOne({
                    attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
                    raw: true,
                })
                .then((id) => {
                    // console.log(id.maxid);

                    gestionAirEtalonnageModels
                        .findOne({
                            where: { id: id.maxid },
                        })
                        .then((result) => {
                            // console.log(result);

                            etalonnage = result['etalonnageAir'];

                            // console.log(
                            //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération de l'étalonage ================>",
                            //     'color: green', etalonnage
                            // );
                        })
                        .then(() => {

                            resolve();

                        });
                });
        } catch (error) {

            console.log("❌ %c ERREUR ==> gestions Air ==> Récupération de l'étalonage",
                'color: orange', error);

            reject();
        }

    });
}

//? --------------------------------------------------

//? Récupération de l'état de la vanne froid.

let etatVanneBDD;
let deltaAirPrecedent;

const gestionAirModels = db.gestionAir;

let recuperationEtatVanneFroid = () => {
    return new Promise((resolve, reject) => {

        try {
            gestionAirModels
                .findOne({
                    attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
                    raw: true,
                })
                .then((id) => {
                    // console.log(id.maxid);

                    gestionAirModels
                        .findOne({
                            where: { id: id.maxid },
                        })
                        .then((result) => {
                            // console.log('⭐ Result gestionAirModels ====> ', result);

                            etatVanneBDD = result['etatRelay'];

                            // console.log(
                            //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération de l'état de la vanne froid ===>",
                            //     'color: green', etatVanneBDD
                            // );

                            deltaAirPrecedent = result['deltaAir'];

                            // console.log(
                            //     "✅ %c SUCCÈS ==> gestions Air ==> Récupération du delta air ==================>",
                            //     'color: green', deltaAirPrecedent
                            // );

                        }).then(() => {

                            resolve();

                        });
                });

        } catch (error) {

            console.log("❌ %c ERREUR ==> gestions Air ==> Récupération de l'état de la vanne froid",
                'color: orange', error);

            reject();
        }

    });
}

//? --------------------------------------------------

//? Construction de la valeur de l'axe x.

let dateDuJour;
let dateDemarrageCycle;
let jourDuCycle;
let heureDuCycle;
let minuteDuCycle;
let heureMinute;
let valeurAxeX;

const gestionCourbesModels = db.gestionCourbes;

let constructionAxeX = () => {
    return new Promise((resolve, reject) => {

        try {

            gestionCourbesModels
                .findOne({
                    attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
                    raw: true,
                })
                .then((id) => {
                    // console.log('Le dernier id de gestionAir est : ', id);
                    // console.log(id.maxid);

                    gestionCourbesModels
                        .findOne({
                            where: { id: id.maxid },
                        })
                        .then((result) => {

                            //* dade démarrage du cycle.
                            // console.log("result => ",result);
                            dateDemarrageCycle = result['dateDemarrageCycle'];

                            // console.log(
                            //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X",
                            //     'color: green', dateDemarrageCycle
                            // );

                            //* --------------------------------------------------

                            // console.log('Le dernier id de gestionAir est : ', id);
                            // console.log(id.maxid);

                            gestionCourbesModels
                                .findOne({
                                    where: { id: id.maxid },
                                })
                                .then((result) => {

                                    //* Date de démarrage du cycle.

                                    dateDemarrageCycle = new Date(result['dateDemarrageCycle']);

                                    // console.log(
                                    //     "✅ %c SUCCÈS ==> gestions Air ==> Date de démarrage du cycle ===>",
                                    //     'color: green', dateDemarrageCycle
                                    // );

                                    //* --------------------------------------------------

                                    //* Date du jour.

                                    dateDuJour = new Date();

                                    // console.log(
                                    //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X ===> Date du jour",
                                    //     'color: green', dateDuJour
                                    // );

                                    //* --------------------------------------------------

                                    //* Calcul du nombre de jour du cycle.

                                    let nbJourBrut = dateDuJour.getTime() - dateDemarrageCycle.getTime();
                                    jourDuCycle = Math.round(nbJourBrut / (1000 * 3600 * 24)) + 1;

                                    // console.log(
                                    //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X ===> Calcul du nombre de jour du cycle",
                                    //     'color: green', jourDuCycle
                                    // );

                                    //* --------------------------------------------------

                                    //* Affichage de l'heure.
                                    heureDuCycle = new Date().getHours();
                                    minuteDuCycle = new Date().getMinutes();
                                    heureMinute = heureDuCycle + 'h' + minuteDuCycle;

                                    // console.log(
                                    //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe x ===> Affichage de l'heure",
                                    //     'color: green', heureMinute
                                    // );

                                    //* --------------------------------------------------

                                    //* Valeure de l'axe x.
                                    valeurAxeX = 'Jour ' + jourDuCycle + ' - ' + heureMinute;

                                    // console.log(
                                    //     "✅ %c SUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe x ===> Valeure de l'axe X",
                                    //     'color: green', valeurAxeX
                                    // );

                                    //* --------------------------------------------------

                                })

                        })

                        .then(() => {

                            resolve();

                        });
                });

        } catch (error) {

            console.log("❌ %c ERREUR ==> gestions Air ==> Construction de la valeur de l'axe X",
                'color: orange', error);

            reject();

        }

    });
}

//? --------------------------------------------------

//? Mesure de la température Air.

let mcpBroche = 2;
const mcpadc = require('mcp-spi-adc');

let getTemperatures = () => {
    return new Promise((resolve, reject) => {

        try {

            let temps = 0;

            let count = () => {
                temps = temps++;

                //console.log(temps++);

                if (temps++ === 9) {
                    clearInterval(conteur);

                }

                // console.log(jaune, '[ GESTION SUBSTRAT CALCULES  ] temps', temps);

                const tempSensor = mcpadc.open(mcpBroche, { speedHz: 20000 }, (err) => {
                    if (err) throw err;

                    tempSensor.read((err, reading) => {
                        if (err) throw err;
                        listValAir.push(reading.value * 40);

                        // console.log(
                        //     "✅ %c SUCCÈS ==> gestions Air ==> Mesure de la température Air",
                        //     'color: green', listValAir
                        // );

                        if (listValAir.length >= 10) {
                            // console.log('listValAir.length >=10');
                            resolve()
                        }
                    });
                });

            };

            let conteur = setInterval(count, 1000);

        } catch (error) {

            console.log("❌ %c ERREUR ==> gestions Air ==> Mesure de la température Air",
                'color: orange', error);

            reject();

        }

    });
}

//? --------------------------------------------------

//? Calcule de la température moyenne.

let listValAir = [];

let temperatureMoyenneAir;

let calculeDeLaTemperatureMoyenne = () => {
    return new Promise((resolve, reject) => {

        try {

            let arrayLength = listValAir.length
            // console.log('Nb valeurs de listValAir :', arrayLength);

            const reducer = (accumulator, curr) => accumulator + curr;
            let sumlistValAir = listValAir.reduce(reducer)
            // console.log('Somme valeurs listValAir : ', sumlistValAir);

            temperatureMoyenneAir = Math.round((sumlistValAir / arrayLength) * 100) / 100;

            // console.log(
            //     "✅ %c SUCCÈS ==> gestions Air ==> Temperature air moyenne ====================>",
            //     'color: green ', temperatureMoyenneAir
            // );

            resolve();

        } catch (error) {

            console.log("❌ %c ERREUR ==> gestions Air ==> Temperature air moyenne",
                'color: orange', error);

            reject();

        }

    });
}

//? --------------------------------------------------

//? Définition de la température air corrigée.

let temperatureCorrigee;

let definitionTemperatureAirCorrigee = () => {
    return new Promise((resolve, reject) => {

        try {

            temperatureCorrigee =
                parseFloat(temperatureMoyenneAir.toFixed(1)) + etalonnage;

            // console.log(
            //     "✅ %c SUCCÈS ==> gestions Air ==> Définition de la température air corrigée ==>",
            //     'color: green', temperatureCorrigee
            // );

            resolve();

        } catch (error) {

            console.log("❌ %c ERREUR ==> gestions Air ==> Définition de la température air corrigée",
                'color: orange', error);

            reject();

        }

    });
}

//? --------------------------------------------------

//? Définition du delta.

let delta;

let definitionDuDelta = () => {
    return new Promise((resolve, reject) => {

        try {

            delta = parseFloat((temperatureCorrigee - consigne).toFixed(1));

            // console.log(
            //     "✅ %c SUCCÈS ==> gestions Air ==> Définition du delta ========================>",
            //     'color: green', delta
            // );

            resolve();

        } catch (error) {

            console.log("❌ %c ERREUR ==> gestions Air ==> Définition du delta",
                'color: orange');

            reject();

        }

    });
}

//? --------------------------------------------------

//? Définition des actions.

let definitionDesActions = () => {
    return new Promise((resolve, reject) => {

        try {

            if (delta >= 3) {

                console.log(
                    "🔺 %c SUCCÈS ==> gestions Air ==> ALERTE, le delta est supérieur à 3°C");

                let temperatureDuMessage = 'le delta est supérieur à 3°C'

                sendSMS(temperatureDuMessage);

                //! Condition à 15 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta >= 3");

                let dureeAction = 15000;

                new Gpio(relayVanne, 'out');

                // console.log('Ouverture du froid');

                if (etatVanneBDD >= 100) {
                    etatRelay = 100;
                } else {
                    etatRelay = 100;
                }

                actionRelay = 1;

                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(relayVanne, 'in');

                    // console.log('FIN Ouverture du froid');

                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------

            } else if (delta > 1.5 && delta < 3) {

                //! Condition à 15 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta > 1.5 && delta < 3");

                let dureeAction = 15000;

                new Gpio(relayVanne, 'out');

                // console.log('Ouverture du froid');

                if (etatVanneBDD >= 100) {
                    etatRelay = 100;
                } else {
                    etatRelay = 100;
                }

                actionRelay = 1;

                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(relayVanne, 'in');

                    // console.log('FIN Ouverture du froid');

                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------
                //
            } else if (delta > 1 && delta <= 1.5) {
                //
                //! Condition à 15 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta > 1 && delta <= 1.5");

                let dureeAction = 5000;

                new Gpio(relayVanne, 'out');

                if (etatVanneBDD >= 100) {
                    etatRelay = 100;
                } else {
                    etatRelay = etatVanneBDD + 37.5;
                }

                actionRelay = 1;
                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(relayVanne, 'in');

                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------
                //
            } else if (delta > 0.5 && delta <= 1) {
                //
                //! Condition à 5 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta > 0.5 && delta <= 1");


                let dureeAction = 2000;

                new Gpio(relayVanne, 'out');

                if (etatVanneBDD >= 100) {
                    etatRelay = 100;
                } else {
                    etatRelay = etatVanneBDD + 12.5;
                }

                actionRelay = 1;
                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(relayVanne, 'in');

                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------
                //
            } else if (delta > 0.3 && delta <= 0.5) {
                //
                //! Condition à 2 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta > 0.3 && delta <= 0.5");

                let dureeAction = 1000;

                new Gpio(relayVanne, 'out');

                if (etatVanneBDD >= 100) {
                    etatRelay = 100;
                } else {
                    etatRelay = etatVanneBDD + 5;
                }

                actionRelay = 1;
                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(relayVanne, 'in');
                    // console.log('ouverture  du froid');
                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------
                //
            } else if (delta >= -0.3 && delta <= 0.3) {

                //***************************************************************

                //! Pas d'action car interval entre -0.3 et 0.3"

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta >= -0.3 && delta <= 0.3");

                etatRelay = etatVanneBDD;
                actionRelay = 0;
                miseAjourEtatRelay();
                resolve();

                //***************************************************************

            } else if (delta < -0.3 && delta >= -0.5) {
                //
                //! Condition à 2 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta < -0.3 && delta >= -0.5");

                let dureeAction = 1000;

                new Gpio(22, 'out');

                if (etatVanneBDD <= 0) {
                    etatRelay = 0;
                } else {
                    etatRelay = etatVanneBDD - 5;
                }

                actionRelay = 1;
                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(22, 'in');

                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------
                //
            } else if (delta < -0.5 && delta >= -1) {
                //
                //! Condition à 5 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta < -0.5 && delta >= -1");

                let dureeAction = 2000;

                new Gpio(22, 'out');

                if (etatVanneBDD <= 0) {
                    etatRelay = 0;
                } else {
                    etatRelay = etatVanneBDD - 12.5;
                }

                actionRelay = 1;
                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(22, 'in');

                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------
                //
            } else if (delta < -1 && delta >= -1.5) {
                //
                //! Condition à 15 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action fermeture ==> delta < -1 && delta >= -1.5");

                let dureeAction = 5000;

                new Gpio(22, 'out');

                if (etatVanneBDD <= 0) {
                    etatRelay = 0;
                } else {
                    etatRelay = etatVanneBDD - 37.5;
                }

                actionRelay = 1;
                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(22, 'in');

                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------
                //
            } else if (delta < -1.5 && delta > -3) {
                //
                //! Condition à 5 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action fermeture ==> delta < -1.5 && delta < -3");

                let dureeAction = 15000;

                new Gpio(22, 'out');

                if (etatVanneBDD <= 0) {
                    etatRelay = 0;
                } else {
                    etatRelay = 0;
                }

                actionRelay = 1;
                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(22, 'in');

                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------
                //
            } else if (delta <= -3) {

                console.log(
                    "🔺 %c SUCCÈS ==> gestions Air ==> ALERTE, le delta est supérieur à -3°C");

                let temperatureDuMessage = 'le delta est inférieur à -3°C'

                sendSMS(temperatureDuMessage);

                //! Condition à 5 secondes.

                console.log(
                    "⭐ %c SUCCÈS ==> gestions Air ==> Action fermeture ==> delta < -1.5");

                let dureeAction = 15000;

                new Gpio(22, 'out');

                if (etatVanneBDD <= 0) {
                    etatRelay = 0;
                } else {
                    etatRelay = 0;
                }

                actionRelay = 1;
                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    new Gpio(22, 'in');

                    actionRelay = 0;
                    miseAjourEtatRelay();
                    //
                    resolve();
                }, dureeAction);

                //! -----------------------------------------------

            }

        } catch (error) {
            // logger.info(
            //     'Fchier source : gestionAir | Module : Définition des actions | Type erreur : ',
            //     error
            // );

            console.log('🔴 Définition des actions :', error);

            reject();

        }


    })

}

//? --------------------------------------------------

//? Enregistrement des datas dans la base.

let enregistrementDatas = () => {
    return new Promise((resolve, reject) => {

        try {

            gestionAirModels
                .create({
                    temperatureAir: temperatureCorrigee,
                    deltaAir: delta,
                    actionRelay: actionRelay,
                    etatRelay: etatRelay,
                    consigne: consigne,
                    valeurAxeX: valeurAxeX,
                    jourDuCycle: jourDuCycle,
                })

                .then(function (result) {

                    console.log(
                        "✅ %c SUCCÈS ==> gestions Air ==> Enregistrement des datas dans la base de données sous l'id :",
                        'color: green', result["dataValues"].id
                    );

                })

                .then(() => {

                    resolve();

                })

        } catch (error) {


            console.log("❌ %c ERREUR ==> gestions Air ==> Enregistrement des datas dans la base",
                'color: orange', error);

            reject();

        }

    });
}

//? --------------------------------------------------

//? Affichage des datas





//? --------------------------------------------------


//! -------------------------------------------------- !

//! Exécution des fonctions asynchrones.

let handleMyPromise = async () => {

    try {

        await recuperationDeLaVanneActive();

        await recupérationDeLaConsigne();

        await recuperationDeEtalonage();

        await recuperationEtatVanneFroid();

        await constructionAxeX();

        await getTemperatures();

        await calculeDeLaTemperatureMoyenne();

        await definitionTemperatureAirCorrigee();

        await definitionDuDelta();

        await definitionDesActions();

        await enregistrementDatas();

    }
    catch (err) {
        console.log('err finale :', err);
    }
};

handleMyPromise();

//! -------------------------------------------------- !