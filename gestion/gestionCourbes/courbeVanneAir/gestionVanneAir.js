//! Les constantes.

const axios = require('axios');
const Chart = require('chart.js');
const zoomPlugin = require('chartjs-plugin-zoom');

//! --------------------------------------------------

//! Les variables.

let dataCourbeAir;

//! --------------------------------------------------------------

//? Chargement des datas.

let loopNumberVanne;
let axiosResponse;
let tailleTAbleau;

const chargementDatas = () => {
    return new Promise((resolve, reject) => {

        axios({
            url: 'http://localhost:3003/api/gestionCourbeRoutes/getTemperatureAirCourbe/',
            method: 'get',
        })
            .then((response) => {

                axiosResponse = response.status

                dataCourbeAirVanne = response.data.temperatureAirCourbe;

                tailleTAbleau = response.data.temperatureAirCourbe.length;

                let counter = 0;

                for (let i = 0; i < tailleTAbleau; i++) {

                    counter++;
                    if (counter === tailleTAbleau) {
                        // console.log("Total data récupérée =====>", counter);

                        console.log('🟢 SUCCESS VANNE 1/4 ==> Chargement des datas.');

                        resolve();
                    }
                };

            })

            .catch((error) => {

                console.log('🔴 ERREUR VANNE 1/4 ==> Get datas :', error);

                reject();
            });

    });
}

//? -------------------------------------------------

//? Récupération des datas courbes air.

let getDataVanneAir = () => {
    return new Promise((resolve, reject) => {

        try {

            loopNumberVanne = Object.keys(dataCourbeAirVanne).map(function (cle) {
                return [Number(cle), dataCourbeAirVanne[cle]];
            });

            console.log('🟢 SUCCESS VANNE 2/4 ==> Récupération des datas courbes air.');

            resolve();

        }
        catch (error) {
            console.log("🔴 ERREUR AIR 2/4 ==> Récupération des datas courbes air :", error);
            reject();
        }

    });
}

//? -------------------------------------------------

//? Stockage des valeures vanne.

let dataCourbeAirVanne;
let valeurTemperatureAirVanne = [];

const stockageDesValeuresVanne = () => {
    return new Promise((resolve, reject) => {

        try {

            dataCourbeAirVanne.forEach((item, index) =>
                valeurTemperatureAirVanne.push({
                    // x: item['createdAt'],
                    x: item['valeurAxeX'],
                    y: item['etatRelay'],
                })
            );

            resolve();

            console.log('🟢 SUCCESS VANNE 3/4 ==> Stockage valeures :', dataCourbeAirVanne.length);

        } catch (error) {

            console.log("🔴 ERREUR VANNE 3/4 ==> Stockage valeures :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//? Construction du graphique vanne air.

let constructionDuGraphiqueVanneAir = () => {
    return new Promise((resolve, reject) => {

        try {

            const ctxVanne = document
                .getElementById('myChartAirVanne')
                .getContext('2d');

            const myLabelsVanne = [];

            const data = {

                labels: myLabelsVanne,

                datasets: [

                    // Courbe taux humidité
                    {
                        label: 'Courbe Vanne Air',
                        data: valeurTemperatureAirVanne,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        lineTension: 0.2,
                        pointRadius: 0,
                    },
                ],
            };

            const optionsVanne = {

                animation: {
                    duration: 0,
                },

                scales: {
                    x: {},

                    y: {
                        ticks: {
                            // Include a dollar sign in the ticks
                            callback: function (item, index, ticks) {
                                return item + '%';
                            },
                        },
                    },
                },
            };

            const configVanne = {
                type: 'line',
                data,
                optionsVanne,
            };

            new Chart(ctxVanne, configVanne);

            console.log('🟢 SUCCESS VANNE 4/4 ==> Construction graphique');

            resolve();

        } catch (error) {

            console.log("🔴 ERREUR VANNE 4/4 ==> Construction graphique :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//! Resolve promise. 

const handleMyPromise = async () => {

    try {

        await chargementDatas();
        await getDataVanneAir();
        await stockageDesValeuresVanne();
        await constructionDuGraphiqueVanneAir();

    }
    catch (err) {
        console.log('🔺 ERREUR ==> Resolve promise', err);
    }
};

handleMyPromise();