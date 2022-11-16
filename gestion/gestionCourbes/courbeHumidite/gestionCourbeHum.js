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
let axiosResponse;

const getDataCourbe = () => {
    return new Promise((resolve, reject) => {

        axios({
            url: 'http://localhost:3003/api/gestionCourbeRoutes/getTauxHumiditeCourbe/',
            method: 'get',
        })
            .then((response) => {

                axiosResponse = response.status

                //* Humidité air.

                dataCourbeHumidite = response.data.tauxHumiditeCourbe;

                loopNumberHum = Object.keys(dataCourbeHumidite).map(function (cle) {
                    return [Number(cle), dataCourbeHumidite[cle]];
                });

                // console.log('loopNumberHum :', loopNumberHum.length);

                //* ---------------------------------------------------

                //* Consigne air.

                consigneCourbeHumidite = response.data.tauxHumiditeCourbe;

                loopNumberConsigneHum = Object.keys(consigneCourbeHumidite).map(function (cle) {
                    return [Number(cle), consigneCourbeHumidite[cle]];
                });

                // console.log('loopNumberConsigneHum :', loopNumberConsigneHum.length);

                //* ---------------------------------------------------

                console.log('🟢 SUCCESS HUM 1/4 ==> Get datas :', response.data.tauxHumiditeCourbe.length);

            })

            .then(() => {

                if (axiosResponse === 200) {
                    resolve();
                } else {
                    reject();
                }
            })

            .catch((error) => {

                console.log('🔴 ERREUR HUM 1/4 ==> Get datas :', error);

                reject();
            });

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

            console.log('🟢 SUCCESS HUM 2/4 ==> Stockage valeures :', valeurTauxHumidite.length);

        } catch (error) {

            console.log("🔴 ERREUR HUM 2/4 ==> Stockage valeures :", error);

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

            console.log('🟢 SUCCESS HUM 3/4 ==> Stockage consigne :', valeurConsigneHumidite.length);

        } catch (error) {

            console.log("🔴 ERREUR  HUM 3/4 ==> Stockage consigne :", error);

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

            console.log('🟢 SUCCESS HUM 4/4 ==> Construction graphique');

            resolve();

        } catch (error) {

            console.log("🔴 ERREUR HUM 4/4 ==> Construction graphique :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//! Resolve promise. 

const handleMyPromiseHum = async () => {

    try {

        //* Graphique température air.
        await getDataCourbe();
        await stockageValeuresTauxHumidite();
        await stockageConsignehumidite();
        await constructionDuGraphiquehumiditeAir();

    }
    catch (err) {
        console.log('🔺 ERREUR ==> Resolve promise', err);
    }
};

handleMyPromiseHum();