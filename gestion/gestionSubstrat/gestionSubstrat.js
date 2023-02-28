//! Les constantes.

const mcpadc = require('mcp-spi-adc');
const Gpio = require('onoff').Gpio;
const jaune = '\x1b[33m';
const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../../models');
const gestionSubstratModels = db.gestionSubstrat;
const gestionSubstratDataModels = db.gestionSubstratData;
const gestionAirModels = db.gestionAir;
const logger = require('../../src/logger');
const numSalle = require('../../configNumSalle');
const axios = require('axios');

//! --------------------------------------------------

//! Les fonctions appelées.

//? Mise à jour de l'état des relay.

let etatRelay;
let actionRelay;

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
                    //  console.log('Nb mise à jour data =======> ' + result);
                })

                .catch((err) => console.log(err));
        });
};

//? --------------------------------------------------

//? Envoyer un SMS d’alerte.

const sendSMS = (message) => {

    console.log('Alerte message ==> ', message);

    //! Url de la master.
    // const url = 'http://192.168.1.11:4000/api/postSms/postSms'; //* Idric.
    const url = 'http://192.168.1.10:5000/api/postSms/postSms'; //* Master.


    axios
        .post(url, {
            message,
        })
        .then(function (response) {
            console.log('🟢 SUCCESS : Reponse de SMS808 : ', response.data);
        })
        .catch(function (error) {
            console.log("🔴 ERROR : Poste du message d'alerte", error);
        });

}

//? --------------------------------------------------

//! --------------------------------------------------

//! Les fonctions synchrone. 

//? Récupération de l'étalonnage.

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

                            console.log(
                                "✅ %cSUCCÈS ==> Gestions Substrat ==> Récupération de l'étalonage",
                                'color: green',
                                etalonnage
                            );

                        })
                        .then(() => {
                            resolve();
                        });
                });
        } catch (error) {
            console.log(
                "❌ %c ERREUR ==> Gestions Substrat ==> Récupération de l'étalonage",
                'color: orange',
                error
            );

            reject();
        }
    });
};

//? --------------------------------------------------

//? Récupération des consignes substrat. 

let consigneMaxDataSubstrat;
let consigneMinDataSubstrat;

let getConsignesSubstrat = () => {
    return new Promise((resolve, reject) => {

        try {
            gestionSubstratDataModels
                .findOne({
                    attributes: [[sequelize.fn('max', sequelize.col('id')), 'maxid']],
                    raw: true,
                })
                .then((id) => {
                    // console.log(id.maxid);
                    gestionSubstratDataModels
                        .findOne({
                            where: { id: id.maxid },
                        })
                        .then((result) => {
                            // console.log('gestConsignesSubstrat :', result);

                            consigneMaxDataSubstrat = result['consigneMaxDataSubstrat']
                            console.log('✅ %cSUCCÈS ==> Gestions Substrat ==> Consigne Max Substrat :',
                                'color: green', consigneMaxDataSubstrat);

                            consigneMinDataSubstrat = result['consigneMinDataSubstrat']
                            console.log('✅ %cSUCCÈS ==> Gestions Substrat ==> Consigne Min Substrat :',
                                'color: green', consigneMinDataSubstrat);

                        }).then(() => {
                            resolve()
                        });
                });
        } catch (error) {
            console.log('ERREUR : ', error);
            reject();
        }
    });
}

//? -------------------------------------------------- !

//? Récupération de l'état de la vanne froid.

let etatVanneBDD;

let recuperationEtatRelay = () => {
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
                            // console.log(result);

                            etatVanneBDD = result['etatRelay'];

                            resolve(console.log(
                                '✅ %cSUCCÈS ==> Gestions Substrat ==> Dernier état vanne de la BDD : ',
                                'color: green',
                                etatVanneBDD
                            ));
                        });
                });
        } catch (error) {
            reject(logger.info(
                'Fchier source : Gestions Substrat | Module : recuperation etatVanneBDD | Type erreur : ',
                error
            ));
        }
    });
}

//? -------------------------------------------------- !

//? Construction de la valeur de l'axe X.

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
                            //* date démarrage du cycle.

                            // dateDemarrageCycle = result['dateDemarrageCycle'];

                            // console.log(
                            //     "✅ %cSUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X",
                            //     'color: green', dateDemarrageCycle
                            // );

                            //* --------------------------------------------------

                            //* Date de démarrage du cycle.

                            dateDemarrageCycle = new Date(result['dateDemarrageCycle']);

                            // console.log(
                            //     "✅ %cSUCCÈS ==> gestions Air ==> Date de démarrage du cycle ===>",
                            //     'color: green', dateDemarrageCycle
                            // );

                            //* --------------------------------------------------

                            //* Date du jour.

                            dateDuJour = new Date();

                            // console.log(
                            //     "✅ %cSUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X ===> Date du jour",
                            //     'color: green', dateDuJour
                            // );

                            //* --------------------------------------------------

                            //* Calcul du nombre de jour du cycle.

                            let nbJourBrut =
                                dateDuJour.getTime() - dateDemarrageCycle.getTime();
                            jourDuCycle = Math.round(nbJourBrut / (1000 * 3600 * 24)) + 1;

                            // console.log(
                            //     "✅ %cSUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe X ===> Calcul du nombre de jour du cycle",
                            //     'color: green', jourDuCycle
                            // );

                            //* --------------------------------------------------

                            //* Affichage de l'heure.

                            heureDuCycle = new Date().getHours();
                            minuteDuCycle = new Date().getMinutes();
                            heureMinute = heureDuCycle + 'h' + minuteDuCycle;

                            // console.log(
                            //     "✅ %cSUCCÈS ==> gestions Air ==> Construction de la valeur de l'axe x ===> Affichage de l'heure",
                            //     'color: green', heureMinute
                            // );

                            //* --------------------------------------------------

                            //* Valeure de l'axe x.

                            valeurAxeX = 'Jour ' + jourDuCycle + ' - ' + heureMinute;

                            console.log(
                                "✅ %cSUCCÈS ==> Gestions Substrat ==> Valeure de l'axe X",
                                'color: green', valeurAxeX
                            );

                            //* --------------------------------------------------
                        })

                        .then(() => {
                            resolve();
                        });
                });
        } catch (error) {
            console.log(
                "❌ %c ERREUR ==> gestions Air ==> Construction de la valeur de l'axe X",
                'color: orange',
                error
            );

            reject();
        }
    });
};

//? -------------------------------------------------- !

//? Mesure de la température du substrat.

let mcpBroche = 2;

let getTemperatures = () => {
    return new Promise((resolve) => {

        let temps = 0;

        let count = () => {
            temps = temps++;

            //console.log(temps++);

            if (temps++ === 9) {
                clearInterval(conteur);

                setTimeout(() => {
                    resolve()
                }, 1500);

            }

            // console.log(jaune, '[ GESTION SUBSTRAT CALCULES  ] temps', temps);

            const tempSensor = mcpadc.open(mcpBroche, { speedHz: 20000 }, (err) => {
                if (err) throw err;

                tempSensor.read((err, reading) => {
                    if (err) throw err;
                    listValAir.push(reading.value * 40);
                    // console.log(jaune, '[ GESTION AIR CALCULES  ] listValAir', listValAir);
                });
            });

        };

        let conteur = setInterval(count, 1000);

    });
}

//? --------------------------------------------------

//? Calcule de la température moyenne.

let listValAir = [];
let temperatureSubstratMoyenne;

let calculeDeLaTemperatureMoyenne = () => {
    return new Promise((resolve, reject) => {
        if (listValAir.length > 0) {

            let arrayLength = listValAir.length
            // console.log('Nb valeurs de listValAir :', arrayLength);

            const reducer = (accumulator, curr) => accumulator + curr;
            let sumlistValAir = listValAir.reduce(reducer)
            // console.log('Somme valeurs listValAir : ', sumlistValAir);

            temperatureSubstratMoyenne = Math.round((sumlistValAir / arrayLength) * 100) / 100;

            console.log(
                "✅ %cSUCCÈS ==> Gestions Substrat ==> Temperature substrat moyenne :",
                'color: green', temperatureSubstratMoyenne
            );

            resolve();

        } else {

            console.log('ERREUR : Test calcule De La Temperature Moyenne');

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
                temperatureSubstratMoyenne + etalonnage;

            console.log(
                '✅ %cSUCCÈS ==> Gestions Substrat ==> Définition de la température Substrat corrigée ===> ',
                'color: green',
                temperatureCorrigee
            );

            resolve();
        } catch (error) {
            console.log(
                '❌ %c ERREUR ==> Gestions Substrat ==> Définition de la température Substrat corrigée',
                'color: orange',
                error
            );

            reject();
        }
    });
};

//? --------------------------------------------------

//? Définition des actions.

const ouvertureRelay = 23;
const fermetureRelay = 22;
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

let definitionAction = () => {
    return new Promise((resolve, reject) => {

        try {

            if (temperatureCorrigee > consigneMaxDataSubstrat) {

                let deltaTemp = temperatureCorrigee - consigneMaxDataSubstrat;

                let message = `ALERTE TEMPÉRATURE : la température de la salle ${numSalle} est supérieur de ${deltaTemp}° | Température relevée : ${temperatureCorrigee}° | Consigne Max Substrat : ${consigneMaxDataSubstrat}° | ${dateLocale}`

                sendSMS(message);

                // console.log('🟠 Action ==> Gestions Substrat ==> (Temperature corrigée >= Consigne Max Substrat)');

                // //! Condition à 40 secondes.

                // let preconisation = 40000;

                // new Gpio(ouvertureRelay, 'out');

                // console.log('🟢 OUVERTURE DU FROID');

                // actionRelay = 1;

                // miseAjourEtatRelay();

                // setTimeout(() => {
                //     //
                //     new Gpio(ouvertureRelay, 'in');

                //     console.log('🔴 FERMETURE DU FROID');

                //     if (etatVanneBDD >= 100) {
                //         etatRelay = 100;
                //     } else {
                //         etatRelay = 100;
                //     }

                //     actionRelay = 0;

                //     miseAjourEtatRelay();
                //     //

                //     resolve();
                // }, preconisation);

                //! -----------------------------------------------

            }

            if (temperatureCorrigee < consigneMinDataSubstrat) {

                let deltaTemp = consigneMinDataSubstrat - temperatureCorrigee;

                let message = `ALERTE TEMPÉRATURE : la température de la salle ${numSalle} est inférieure de ${deltaTemp}° | Température relevée : ${temperatureCorrigee}° | Consigne Min Substrat : ${consigneMinDataSubstrat}° | ${dateLocale}`

                sendSMS(message);

                //! Condition à 40 secondes.

                // console.log('🟠 Action sélectionnée ==> Gestions Substrat ==> (Temperature corrigée <= Consigne Min Substrat)');

                // let preconisation = 40000;

                // new Gpio(fermetureRelay, 'in');

                // console.log('🟢 DÉBUT fermeture du froid.');

                // actionRelay = 1;

                // miseAjourEtatRelay();

                // setTimeout(() => {
                //     //
                //     new Gpio(fermetureRelay, 'out');

                //     console.log('🔴 FIN Fermeture du froid.');

                //     if (etatVanneBDD <= 0) {
                //         etatRelay = 0;
                //     } else {
                //         etatRelay = 0;
                //     }

                //     actionRelay = 0;

                //     miseAjourEtatRelay();

                //     resolve();

                // }, preconisation);

                //! -----------------------------------------------

            }
        } catch (error) {
            console.log("❌ %c ERREUR =====> Definition des actions delta",
                'color: orange');
            reject();
        }
    });
}

//? --------------------------------------------------

//? Enregistrement des datas dans la base.

let enregistrementTemperature = () => {
    return new Promise((resolve, reject) => {

        gestionSubstratModels
            .create({
                temperatureSubstrat: temperatureCorrigee,
                actionRelay: actionRelay,
                etatRelay: etatRelay,
                valeurAxeX: valeurAxeX,
                jourDuCycle: jourDuCycle,
            })

            .then(function (result) {

                console.log(
                    "✅ %cSUCCÈS ==> Gestions Substrat ==> Enregistrement des datas dans la base sous l'ID :",
                    'color: green', result["dataValues"].id
                );

                resolve();
            })

            .catch((error) => {

                console.log(
                    jaune,
                    '[ GESTION SUBSTRAT CALCULES  ] Erreur dans le processus d’enregistrement',
                    error
                );

                reject();
            });

    });
}

//? --------------------------------------------------

//! --------------------------------------------------

//! Resolve promise. 

let handleMyPromise = async () => {

    try {

        await recuperationDeEtalonage();

        await getConsignesSubstrat();

        await recuperationEtatRelay();

        await constructionAxeX();

        await getTemperatures();

        await calculeDeLaTemperatureMoyenne();

        await definitionTemperatureAirCorrigee();

        await definitionAction();

        await enregistrementTemperature();
    }
    catch (err) {
        console.log('err finale :', err);
    }
};

handleMyPromise();

//! --------------------------------------------------
