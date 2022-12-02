const axios = require('axios');
require('dotenv').config();
const db = require('../models');
const Sequelize = require('sequelize');
const gestionAirsDataModels = db.gestionAirData;
const gestionAirsModels = db.gestionAir;

let pi = '10'

//! RÉCUPÉRATION DES DATAS.

exports.postSmsOrder = (req, res) => {

    let numSalle = req.body.numSalle;
    console.log('NUMERO DE LA SALLE :', numSalle);

    //!  les promesses.

    //? Interrogation de la base de données.

    let consigne;

    //? récupération de la consigne. 

    const recuperationConsigne = () => {
        return new Promise((resolve, reject) => {
            try {

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
                                resolve();
                            });
                    });

            } catch (error) {
                console.log("ERROR : Interrogation de la base de données :", error);
                reject();
            }
        });
    }

    //? ------------------------------------------------- 

    //? récupération de la température et du deltat. 

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

    //? ------------------------------------------------- 

    //? Post des résultats de la requête.

    let postResultatsRequete = () => {

        return new Promise((resolve, reject) => {
            try {

                //* Url de la master.

                const url = `http://192.168.1.${pi}:4000/api/postSms/postSms`; //* Idric
                // const url = 'http://192.168.0.10:4000/api/postSms/postSms'; //* Antoine

                //* -------------------------------------------------

                //* Paramétrage du message.

                let message = `Salle = ${numSalle} | Temperature Air = ${temperatureAir} | Consigne Air = ${consigne} | Delta Air = ${deltaAir}`;
                console.log('message :', message);

                //* -------------------------------------------------

                //* Post du message. 

                axios
                    .post(url, {
                        message,
                    })
                    .then(function (response) {

                        console.log('Reponse de SMS808 : ', response.data);
                        resolve();

                    })
                    .catch(function (error) {
                        reject();
                        console.log('ERROR AXIOS : Envoi des résultats de la requête par SMS', error);

                    });

                //* -------------------------------------------------

            } catch (error) {
                reject();
                console.log('ERROR CATCH : Envoi des résultats de la requête par SMS', error);
            }

        });
    }

    //? --------------------------------------------------

    //! -------------------------------------------------   

    //! Exécution des promesses. 

    let handleMyPromise = async () => {

        try {
            await recuperationConsigne();
            await recuperationTemperatureEtDeltat();
            await postResultatsRequete();
        }
        catch (err) {
            console.log('err :', err);
        }
    };

    handleMyPromise();

    //! -------------------------------------------------  

};

//! CHANGER LA CONSIGNE. 

exports.newConsigne = (req, res) => {

    let numSalle = req.body.numSalleConsigne;
    console.log('NUMERO DE LA SALLE :', numSalle);

    let consigne = req.body.consigne;
    console.log('CONSIGNE :', consigne);


    //!  les promesses.

    //? Mise à jour de la base de données avec la nouvelle consigne.

    let miseAJourBaseDonnees = () => {
        return new Promise((resolve, reject) => {

            const miseAJourGestionAirData = db.gestionAirData;

            const newDataCo2 = miseAJourGestionAirData
                .create({
                    consigneAir: consigne,

                })
                .then((result) => {
                    console.log("Nouvelle consigne SMS enregistrée sous l'id :", result.dataValues.id);
                    resolve();
                })
                .catch((error) => {
                    console.log('Table non mise à jour', error);
                    reject();
                });

        });
    }

    //? -------------------------------------------------  

    //? Verification de la nouvelle consigne.

    let getNewConsigne;

    const verificationNouvelleConsigne = () => {
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

                                getNewConsigne = datatemperatureAir['consigneAir']
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

    //? ------------------------------------------------- 

    //? Envoi des résultats de la requête par SMS.

    let envoiNouvelleConsigne = () => {
        return new Promise((resolve, reject) => {
            try {

                //* Url de la master.

                const url = `http://192.168.1.${pi}:4000/api/postSms/postSms`; //* Idric
                // const url = 'http://192.168.0.10:4000/api/postSms/postSms'; //* Antoine

                //* -------------------------------------------------

                //* Paramétrage du message.

                let message = `Salle = ${numSalle} | Nouvelle Consigne Air = ${getNewConsigne}`;

                //* -------------------------------------------------

                //* Post du message. 

                axios
                    .post(url, {
                        message,
                    })
                    .then(function (response) {

                        console.log('Reponse de SMS808 : ', response.data);
                        resolve();

                    })
                    .catch(function (error) {
                        reject();
                        console.log('ERROR AXIOS : Envoi des résultats de la requête get consigne par SMS', error);

                    });

                //* -------------------------------------------------

            } catch (error) {
                reject();
                console.log('ERROR CATCH : Envoi des résultats de la requête get consigne  par SMS', error);
            }

        });
    }

    //? --------------------------------------------------

    //! -------------------------------------------------  

    //! Exécution des promesses. 

    let handleMyPromise = async () => {

        try {
            await miseAJourBaseDonnees();
            await verificationNouvelleConsigne();
            await envoiNouvelleConsigne();
        }
        catch (err) {
            console.log('err :', err);
        }
    };

    handleMyPromise();

    //! -------------------------------------------------  




};