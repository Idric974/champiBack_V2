
const Sequelize = require('sequelize');
const db = require('../models');
const gestionAirsDataModels = db.gestionAirData;
const gestionAirsModels = db.gestionAir;

//consigne = 22;

let miseAJourBaseDonnees = () => {

    return new Promise((resolve, reject) => {

        const miseAJourGestionAirData = db.gestionAirData;

        const newDataCo2 = miseAJourGestionAirData
            .create({
                consigneAir: consigne,

            })
            .then((result) => {
                console.log(`Nouvelle consigne SMS est de ${result.dataValues.consigneAir}°C et est enregistrée sous l'id :", ${result.dataValues.id}`);
                resolve();
            })
            .catch((error) => {
                console.log('Table non mise à jour', error);
                reject();
            });

    });
}

// miseAJourBaseDonnees();

//* ------------------------------------------------------------------------

let consigne;

const getDataAir = () => {

    gestionAirsDataModels
        .findOne({
            attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
            raw: true,
        })
        .then((id) => {
            // console.log('Le dernier id de gestionAir est : ', id);
            // console.log(id.maxid);

            gestionAirsDataModels
                .findOne({
                    where: { id: id.maxid },
                })
                .then((dataTemperatureAir) => {

                    consigne = dataTemperatureAir['consigneAir']
                    console.log('Consigne Air:', consigne);

                }).then(() => {
                    console.log('FIN');
                });
        });
};

// getDataAir();

//* ------------------------------------------------------------------------

const verificationConsigne = () => {
    return new Promise((resolve, reject) => {
        try {

            gestionAirsDataModels
                .findOne({
                    attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
                    raw: true,
                })
                .then((id) => {

                    gestionAirsDataModels
                        .findOne({
                            where: { id: id.maxid },
                        })
                        .then((datatemperatureAir) => {

                            getNewConsigne = datatemperatureAir['consigne']
                            console.log('New Consigne Air:', getNewConsigne);

                        }).then(() => {
                            resolve();
                        });
                });

        } catch (error) {
            console.log("ERROR : Interrogation de la base de données :", error);
            reject();
        }
    });
}

// verificationConsigne();

//* ------------------------------------------------------------------------


let temperatureAir;
let deltaAir;

const recuperationTemperatureEtDeltat = () => {
    return new Promise((resolve, reject) => {
        try {

            gestionAirsModels
                .findOne({
                    attributes: [[Sequelize.fn('max', Sequelize.col('id')), 'maxid']],
                    raw: true,
                })
                .then((id) => {
                    // console.log('Le dernier id de gestionAir est : ', id);
                    // console.log(id.maxid);

                    gestionAirsModels
                        .findOne({
                            where: { id: id.maxid },
                        })
                        .then((temperatureAirData) => {

                            //console.log('temperatureAir :', temperatureAirData);

                            temperatureAir = temperatureAirData['temperatureAir']
                            console.log('Temperature Air:', temperatureAir);

                            deltaAir = temperatureAirData['deltaAir']
                            console.log('Delta Air:', deltaAir);

                        }).then(() => {
                            resolve();
                        });
                });

        } catch (error) {
            console.log("ERROR : Interrogation de la base de données :", error);
            reject();
        }
    });
}

recuperationTemperatureEtDeltat();