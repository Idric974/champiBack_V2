//! Les constantes.

const mcpadc = require('mcp-spi-adc');
const Gpio = require('onoff').Gpio;
const jaune = '\x1b[33m';
const sequelize = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../../models');
const gestionSubstratModels = db.gestionSubstrat;
const gestionAirModels = db.gestionAir;
const logger = require('../../src/logger');
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

//! --------------------------------------------------

//! Les fonctions synchrone. 

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
                            console.log(
                                jaune,
                                '[ GESTION AIR CALCULES  ] Dernier état vanne de la BDD : ',
                                etatVanneBDD
                            );

                            resolve();
                        });
                });
        } catch (error) {
            logger.info(
                'Fchier source : gestionAir | Module : recuperation etatVanneBDD | Type erreur : ',
                error
            );

            reject();
        }

    });
}

//? -------------------------------------------------- !

//? Construction de la valeur de l'axe X.

let jourDuCycle;
let heureDuCycle;
let minuteDuCycle;
let heureMinute;
let valeurAxeX;

let getDateDemarrageCycle = () => {
    return new Promise((resolve, reject) => {

        axios
            .get('http://localhost:3003/api/gestionCourbeRoutes/getDateDemarrageCycle')
            .then((response) => {
                // console.log(
                //     'Date démarrage du cycle :----------:',
                //     response.data.dateDemarrageCycle.dateDemarrageCycle
                // );

                //* Date du jour.

                dateDuJour = new Date();
                // console.log('Date du Jour :---------------------:', dateDuJour);

                //* --------------------------------------------------

                //* Date de demarrage du cycle

                dateDemarrageCycle = new Date(
                    response.data.dateDemarrageCycle.dateDemarrageCycle
                );

                // console.log('La date de démarrage du cycle :----:', dateDemarrageCycle);

                //* --------------------------------------------------

                //* Calcul du nombre de jour du cycle.

                let nbJourBrut = dateDuJour.getTime() - dateDemarrageCycle.getTime();

                jourDuCycle = Math.round(nbJourBrut / (1000 * 3600 * 24)) + 1;

                // console.log('Le jour du cycle :-----------------:', jourDuCycle, ' jours');

                //* --------------------------------------------------

                //* Affichage de l'heure.

                heureDuCycle = new Date().getHours();
                minuteDuCycle = new Date().getMinutes();
                heureMinute = heureDuCycle + 'h' + minuteDuCycle;
                // console.log("l'heure du cycle :-----------------:", heureMinute);

                //* --------------------------------------------------

                //* Valeure de l'axe X.

                valeurAxeX = 'Jour ' + jourDuCycle + ' - ' + heureMinute;
                console.log(
                    jaune,
                    "[ GESTION AIR CALCULES  ] Valeure de l'axe X : ",
                    valeurAxeX
                );

                //* --------------------------------------------------
            })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.log(error);

                reject();
            });

    });
}

//? -------------------------------------------------- !

//? Mesure de la température du substrat.

let mcpBroche = 0;

let getTemperatures = () => {
    return new Promise((resolve) => {

        let temps = 0;

        let count = () => {
            temps = temps++;

            //console.log(temps++);

            if (temps++ === 1) {
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

            console.log('Temperature substrat moyenne : ', temperatureSubstratMoyenne);

            resolve();

        } else {

            console.log('ERREUR : Test calcule De La Temperature Moyenne');

            reject();
        }
    });
}

//? --------------------------------------------------

//? Définition des actions.

let definitionAction = () => {
    return new Promise((resolve, reject) => {

        try {

            if (temperatureSubstratMoyenne >= 25) {

                //! Condition à 40 secondes.

                let preconisation = 40000;

                const relay_23_ON = new Gpio(23, 'out');

                console.log('DÉBUT ouverture du froid');

                if (etatVanneBDD >= 100) {
                    etatRelay = 100;
                } else {
                    etatRelay = 100;
                }

                actionRelay = 1;

                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    const relay_23_OFF = new Gpio(23, 'in');

                    console.log('FIN Ouverture du froid');

                    actionRelay = 0;

                    miseAjourEtatRelay();
                    //

                    // resolve();
                }, preconisation);

                //! -----------------------------------------------

            } else {

                //! Condition à 40 secondes.

                let preconisation = 40000;

                const relay_23_ON = new Gpio(23, 'in');

                console.log('DÉBUT fermeture du froid');

                if (etatVanneBDD >= 100) {
                    etatRelay = 100;
                } else {
                    etatRelay = 100;
                }

                actionRelay = 1;

                miseAjourEtatRelay();

                setTimeout(() => {
                    //
                    const relay_23_OFF = new Gpio(23, 'out');

                    console.log('FIN Fermeture du froid');

                    actionRelay = 0;

                    miseAjourEtatRelay();

                    resolve();

                }, preconisation);

                //! -----------------------------------------------

            }

        } catch (error) {
            logger.info(
                'Fchier source : gestionAir | Module : Définition des actions | Type erreur : ',
                error
            );
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
                temperatureSubstrat: temperatureSubstratMoyenne,
                actionRelay: actionRelay,
                etatRelay: etatRelay,
                valeurAxeX: valeurAxeX,
                jourDuCycle: jourDuCycle,
            })

            .then(function (result) {

                // console.log(
                //     'Enregistrement des datas dans la base =======> ' + result
                // );

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

        await recuperationEtatRelay();

        await getDateDemarrageCycle();

        await getTemperatures();

        await calculeDeLaTemperatureMoyenne();

        await definitionAction();

        await enregistrementTemperature();
    }
    catch (err) {
        console.log('err finale :', err);
    }
};

handleMyPromise();

//! --------------------------------------------------
