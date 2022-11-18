//! Les constantes.

const axios = require('axios');
const Chart = require('chart.js');
const zoomPlugin = require('chartjs-plugin-zoom');

//! --------------------------------------------------

//! Les variables.

let dataCourbeAir;
let consigneCourbeAir;

//! --------------------------------------------------------------

//! Construction du graphique température air.

//? Récupération des datas courbes air.

let loopNumberAir;
let loopNumberConsigne;
let axiosResponse;

const getDataCourbeAir = () => {
    return new Promise((resolve, reject) => {

        axios({
            url: 'http://localhost:3003/api/gestionCourbeRoutes/getTemperatureAirCourbe/',
            method: 'get',
        })
            .then((response) => {

                axiosResponse = response.status

                //* Tempèrature air.

                dataCourbeAir = response.data.temperatureAirCourbe;

                loopNumberAir = Object.keys(dataCourbeAir).map(function (cle) {
                    return [Number(cle), dataCourbeAir[cle]];
                });

                // console.log('loopNumberAir :', loopNumberAir.length);

                //* ---------------------------------------------------

                //* Consigne air.

                consigneCourbeAir = response.data.temperatureAirCourbe;

                loopNumberConsigne = Object.keys(consigneCourbeAir).map(function (cle) {
                    return [Number(cle), consigneCourbeAir[cle]];
                });

                // console.log('loopNumberConsigne :', loopNumberConsigne.length);

                //* ---------------------------------------------------

                console.log('🟢 SUCCESS AIR 1/4 ==> Get datas :', response.data.temperatureAirCourbe.length);

            })

            .then(() => {

                if (axiosResponse === 200) {
                    resolve();
                } else {
                    reject();
                }
            })

            .catch((error) => {

                console.log('🔴 ERREUR AIR 1/4 ==> Get datas :', error);

                reject();
            });

    });
}

//? -------------------------------------------------

//? Stockage de la température de l'air.

let valeurTemperatureAir = [];

const stockageTempératureAir = () => {
    return new Promise((resolve, reject) => {

        try {

            dataCourbeAir.forEach((item, index) =>
                valeurTemperatureAir.push({
                    // x: item['createdAt'],
                    x: item['valeurAxeX'],
                    y: item['temperatureAir'],
                })
            );

            resolve();

            console.log('🟢 SUCCESS AIR 2/4 ==> Stockage valeures :', valeurTemperatureAir.length);

        } catch (error) {

            console.log("🔴 ERREUR AIR 2/4 ==> Stockage valeures :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//? Stockage de la consigne air.

let valeurConsigneAir = [];

const stockageConsigneAir = () => {
    return new Promise((resolve, reject) => {

        try {

            consigneCourbeAir.forEach((item, index) =>
                valeurConsigneAir.push({
                    x: item['valeurAxeX'],
                    y: item['consigne'],
                })
            );

            resolve();

            console.log('🟢 SUCCESS AIR 3/4 ==> Stockage consigne :', valeurConsigneAir.length);

        } catch (error) {

            console.log("🔴 ERREUR AIR 3/4 ==> Stockage consigne :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//? Construction du graphique temperature air.

let constructionDuGraphiqueTemperatureAir = () => {

    return new Promise((resolve, reject) => {

        try {

            const ctxAir = document.getElementById('myChartAir').getContext('2d');

            const myLabelsAir = [];

            const data = {

                labels: myLabelsAir,

                datasets: [

                    // Courbe taux humidité
                    {
                        label: 'Température Air',
                        data: valeurTemperatureAir,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        lineTension: 0.2,
                        pointRadius: 0,
                        // xAxisID: 'xAxis1',
                    },

                    // Courbe consigne air.
                    {
                        label: 'Consigne Air.',
                        data: valeurConsigneAir,
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

            const optionsAir = {
                animation: {
                    duration: 0,
                },

            };

            const configCo2 = {
                type: 'line',
                data,
                optionsAir,
            };

            new Chart(ctxAir, configCo2);

            console.log('🟢 SUCCESS CO2 4/4 ==> Construction graphique');

            resolve();

        } catch (error) {

            console.log("🔴 ERREUR CO2 4/7 ==> Construction graphique :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//! -------------------------------------------------

//! Resolve promise. 

const handleMyPromise = async () => {

    try {

        await getDataCourbeAir();
        await stockageTempératureAir();
        await stockageConsigneAir();
        await constructionDuGraphiqueTemperatureAir();

    }
    catch (err) {
        console.log('🔺 ERREUR ==> Resolve promise', err);
    }
};

handleMyPromise();