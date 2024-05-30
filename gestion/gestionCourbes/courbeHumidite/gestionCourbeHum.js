//! Les constantes.

const axios = require('axios');
const Chart = require('chart.js');
const zoomPlugin = require('chartjs-plugin-zoom');

//! --------------------------------------------------

//! Les variables.

let dataCourbeHumidite;
let consigneCourbeHumidite;

//! --------------------------------------------------------------

//? Récupération des datas courbes air.

let loopNumberHum;
let loopNumberConsigneHum;
let tailleTAbleau;

const chargementDatas = () => {
    return new Promise((resolve, reject) => {

        axios({
            url: 'http://localhost:3003/api/gestionCourbeRoutes/getTauxHumiditeCourbe/',
            method: 'get',
        })
            .then((response) => {

                // console.log("response ===>", response);

                dataCourbeHumidite = response.data.tauxHumiditeCourbe;

                consigneCourbeHumidite = response.data.tauxHumiditeCourbe;

                tailleTAbleau = response.data.tauxHumiditeCourbe.length;

                let counter = 0;

                for (let i = 0; i < tailleTAbleau; i++) {

                    counter++;
                    if (counter === tailleTAbleau) {
                        // console.log("Total data récupérée =====>", counter);

                        console.log('🟢 SUCCESS HUM 1/5 ==> Chargement des datas.');

                        resolve();
                    }
                };

            })

            .catch((error) => {

                console.log('🔴 ERREUR HUM 1/5 ==> Récupération des datas courbes hum :', error);

                reject();
            });

    });
}

//? -------------------------------------------------

//? Récupération des datas courbes Hum.

let getDataCourbeHum = () => {
    return new Promise((resolve, reject) => {

        try {

            //* Taux Hum.

            loopNumberHum = Object.keys(dataCourbeHumidite).map(function (cle) {
                return [Number(cle), dataCourbeHumidite[cle]];
            });

            //* ---------------------------------------------------

            //* Consigne Hum.

            loopNumberConsigneHum = Object.keys(consigneCourbeHumidite).map(function (cle) {
                return [Number(cle), consigneCourbeHumidite[cle]];
            });

            //* ---------------------------------------------------
            console.log("🟢 SUCCESS HUM 2/5 ==> Récupération des datas courbes air.");

            resolve();

        }
        catch (error) {
            console.log("🔴 ERREUR HUM 2/5 ==> Récupération des datas courbes air :", error);
            reject();
        }

    });
}

//? -------------------------------------------------

//? Stockage des valeures taux humidité.

let valeurTauxHumidite = [];

const stockageValeuresTauxHumidite = () => {
    return new Promise((resolve, reject) => {

        try {

            dataCourbeHumidite.forEach((item, index) =>
                valeurTauxHumidite.push({
                    // x: item['createdAt'].split('.')[0].split('T')[0],
                    x: item['valeurAxeX'],
                    y: item['tauxHumidite'],
                })
            );

            resolve();

            console.log('🟢 SUCCESS HUM 3/5 ==> Stockage valeures :', valeurTauxHumidite.length);

        } catch (error) {

            console.log("🔴 ERREUR HUM 3/5 ==> Stockage valeures :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//? Stockage de la consigne humidité.

let valeurConsigneHumidite = [];

const stockageConsignehumidite = () => {
    return new Promise((resolve, reject) => {

        try {

            consigneCourbeHumidite.forEach((item, index) =>
                valeurConsigneHumidite.push({
                    // x: item['createdAt'].split('.')[0].split('T')[0],
                    x: item['valeurAxeX'],
                    y: item['consigne'],
                })
            );

            resolve();

            console.log('🟢 SUCCESS HUM 4/5 ==> Stockage consigne :', valeurConsigneHumidite.length);

        } catch (error) {

            console.log("🔴 ERREUR  HUM 4/5 ==> Stockage consigne :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//? Construction du graphique humidité air.

let constructionDuGraphiquehumiditeAir = () => {
    return new Promise((resolve, reject) => {

        try {

            const ctxHum = document.getElementById('myChartHum').getContext('2d');


            const myLabelsHum = [];

            const data = {
                labels: myLabelsHum,

                datasets: [
                    // Courbe taux humidité
                    {
                        label: 'Courbe Taux Humidité',
                        data: valeurTauxHumidite,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        lineTension: 0.2,
                        pointRadius: 0,
                        // xAxisID: 'xAxis1',
                    },

                    // Courbe consigne humidité
                    {
                        label: 'Courbe Consigne humidité',
                        data: valeurConsigneHumidite,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        lineTension: 0.2,
                        pointRadius: 0,
                        // xAxisID: 'xAxis2',
                    },
                    // ------------------------------
                ],
            };

            const optionsHum = {
                animation: {
                    duration: 0,
                },
                scales: {
                    x: {
                        display: false,
                        // id: 'xAxis1',
                        time: {
                            displayFormats: {
                                quarter: 'HH:mm',
                            },
                        },
                        ticks: {
                            // callback: function (label) {
                            // },
                        },
                    },

                    x: {
                        display: false,
                        // id: 'xAxis2',
                        time: {
                            displayFormats: {
                                quarter: 'HH:mm',
                            },
                        },
                        ticks: {
                            // callback: function (label) {
                            // },
                        },
                    },
                    y: {},
                },
            };

            const configHum = {
                type: 'line',
                data,
                optionsHum,
            };

            const myChartHum = new Chart(ctxHum, configHum);

            console.log('🟢 SUCCESS HUM 5/5 ==> Construction graphique');

            resolve();

        } catch (error) {

            console.log("🔴 ERREUR HUM 5/5 ==> Construction graphique :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//! Resolve promise. 

const handleMyPromiseHum = async () => {

    try {

        //* Graphique température air.
        await chargementDatas();
        await getDataCourbeHum();
        await stockageValeuresTauxHumidite();
        await stockageConsignehumidite();
        await constructionDuGraphiquehumiditeAir();

    }
    catch (err) {
        console.log('🔺 ERREUR ==> Resolve promise', err);
    }
};

handleMyPromiseHum();