//! Les constantes.

const axios = require('axios');
const Chart = require('chart.js');
const zoomPlugin = require('chartjs-plugin-zoom');

//! --------------------------------------------------

//! Les variables.

let dataCourbeAir;

//! --------------------------------------------------------------

//? Récupération des datas vanne air.

let loopNumberVanne;
let axiosResponse;

const getDataVanneAir = () => {
    return new Promise((resolve, reject) => {

        axios({
            url: 'http://localhost:3003/api/gestionCourbeRoutes/getTemperatureAirCourbe/',
            method: 'get',
        })
            .then((response) => {

                axiosResponse = response.status

                dataCourbeAirVanne = response.data.temperatureAirCourbe;

                loopNumberVanne = Object.keys(dataCourbeAirVanne).map(function (cle) {
                    return [Number(cle), dataCourbeAirVanne[cle]];
                });

                // console.log('loopNumberVanne :', loopNumberVanne.length);

                console.log('🟢 SUCCESS VANNE 1/3 ==> Get datas :', response.data.temperatureAirCourbe.length);

            })

            .then(() => {

                if (axiosResponse === 200) {

                    resolve();

                } else {
                    reject();
                }
            })



            .catch((error) => {

                console.log('🔴 ERREUR VANNE 1/3 ==> Get datas :', error);

                reject();
            });

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

            console.log('🟢 SUCCESS VANNE 2/3 ==> Stockage valeures :', dataCourbeAirVanne.length);

        } catch (error) {

            console.log("🔴 ERREUR VANNE 2/3 ==> Stockage valeures :", error);

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

            console.log('🟢 SUCCESS VANNE 3/3 ==> Construction graphique');

            resolve();

        } catch (error) {

            console.log("🔴 ERREUR VANNE 3/3 ==> Construction graphique :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//! Resolve promise. 

const handleMyPromise = async () => {

    try {

        //* Graphique vanne air.
        await getDataVanneAir();
        await stockageDesValeuresVanne();
        await constructionDuGraphiqueVanneAir();

    }
    catch (err) {
        console.log('🔺 ERREUR ==> Resolve promise', err);
    }
};

handleMyPromise();