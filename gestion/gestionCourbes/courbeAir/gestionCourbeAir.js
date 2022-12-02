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

//? Chargement des datas.

let loopNumberAir;
let loopNumberConsigne;
let tailleTAbleau;

const chargementDatas = () => {
    return new Promise((resolve, reject) => {

        axios({
            url: 'http://localhost:3003/api/gestionCourbeRoutes/getTemperatureAirCourbe/',
            method: 'get',
        })
            .then((response) => {
                // console.log("Datas ==> ", response.data.temperatureAirCourbe);

                dataCourbeAir = response.data.temperatureAirCourbe;

                consigneCourbeAir = response.data.temperatureAirCourbe;

                tailleTAbleau = response.data.temperatureAirCourbe.length;
                console.log("Total data à récupérer ===>", tailleTAbleau);

                let counter = 0;

                for (let i = 0; i < tailleTAbleau; i++) {

                    counter++;
                    if (counter === tailleTAbleau) {
                        console.log("Total data récupérée =====>", counter);

                        console.log('🟢 SUCCESS AIR 1/5 ==> Chargement des datas.');

                        resolve();
                    }
                };
            })

            .catch((error) => {
                console.log('🔴 ERREUR AIR 1/5 ==> Chargement des datas :', error);
                reject();
            });
    });
}

//? -------------------------------------------------

//? Récupération des datas courbes air.

let getDataCourbeAir = () => {
    return new Promise((resolve, reject) => {

        try {

            //* Tempèrature air.

            loopNumberAir = Object.keys(dataCourbeAir).map(function (cle) {
                return [Number(cle), dataCourbeAir[cle]];
            });

            //* ---------------------------------------------------

            //* Consigne air.

            loopNumberConsigne = Object.keys(consigneCourbeAir).map(function (cle) {
                return [Number(cle), consigneCourbeAir[cle]];
            });

            //* ---------------------------------------------------
            console.log("🟢 SUCCESS AIR 2/5 ==> Récupération des datas courbes air.");

            resolve();

        }
        catch (error) {
            console.log("🔴 ERREUR AIR 2/5 ==> Récupération des datas courbes air :", error);
            reject();
        }

    });
}

//? -------------------------------------------------

//? Stockage de la température de l'air.

let valeurTemperatureAir = [];

const stockageTempératureAir = () => {
    return new Promise((resolve, reject) => {

        try {

            dataCourbeAir.forEach((item, index) => {
                valeurTemperatureAir.push({

                    x: item['valeurAxeX'],
                    y: item['temperatureAir'],
                });

                if (tailleTAbleau === valeurTemperatureAir.length) {

                    resolve();

                    console.log('🟢 SUCCESS AIR 3/5 ==> Stockage valeures :', valeurTemperatureAir.length);

                }
            }
            );

        } catch (error) {
            console.log("🔴 ERREUR AIR 3/5 ==> Stockage valeures :", error);
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

            console.log('🟢 SUCCESS AIR 4/5 ==> Stockage consigne :', valeurConsigneAir.length);

        } catch (error) {

            console.log("🔴 ERREUR AIR 4/5 ==> Stockage consigne :", error);

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

            console.log('🟢 SUCCESS AIR 5/5 ==> Construction graphique.');

            resolve();

        } catch (error) {

            console.log("🔴 ERREUR AIR 5/5 ==> Construction graphique :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//! -------------------------------------------------

//! Resolve promise. 

const handleMyPromise = async () => {

    try {

        await chargementDatas();
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