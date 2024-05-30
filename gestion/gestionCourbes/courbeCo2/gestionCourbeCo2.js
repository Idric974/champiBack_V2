//! Les constantes.

const axios = require('axios');
const Chart = require('chart.js');
const zoomPlugin = require('chartjs-plugin-zoom');

//! --------------------------------------------------

//! Les variables.

let dataCourbeCo2;
let consigneCourbeCo2;

//! --------------------------------------------------------------

//? Chargement des datas.

let loopNumberCo2;
let loopNumberConsigne;
let tailleTAbleau;

const chargementDatas = () => {
    return new Promise((resolve, reject) => {

        axios({
            url: 'http://localhost:3003/api/gestionCourbeRoutes/getTauxCo2Courbe/',
            method: 'get',
        })
            .then((response) => {

                //  console.log("Datas ==> ", response.data);

                dataCourbeCo2 = response.data.tauxCo2Courbe;

                consigneCourbeCo2 = response.data.tauxCo2Courbe;

                tailleTAbleau = response.data.tauxCo2Courbe.length;

                let counter = 0;

                for (let i = 0; i < tailleTAbleau; i++) {

                    counter++;
                    if (counter === tailleTAbleau) {
                        // console.log("Total data récupérée =====>", counter);

                        console.log('🟢 SUCCESS CO2 1/5 ==> Chargement des datas.');

                        resolve();
                    }
                };

            })

            .catch((error) => {

                console.log('🔴 ERREUR CO2 1/5 ==> Chargement des datas. :', error);

                reject();
            });
    });
}

//? -------------------------------------------------

//? Récupération des datas courbes air.

let getDataCourbeCo2 = () => {
    return new Promise((resolve, reject) => {

        try {

            //* Tempèrature Co2.

            loopNumberAir = Object.keys(dataCourbeCo2).map(function (cle) {
                return [Number(cle), dataCourbeCo2[cle]];
            });

            //* ---------------------------------------------------

            //* Consigne Co2.

            loopNumberConsigne = Object.keys(consigneCourbeCo2).map(function (cle) {
                return [Number(cle), consigneCourbeCo2[cle]];
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

//? Stockage des valeures Co2.

let valeurTauxCo2 = [];

const stockageValeuresCo2 = () => {
    return new Promise((resolve, reject) => {

        try {

            dataCourbeCo2.forEach((item, index) =>
                valeurTauxCo2.push({
                    x: item['valeurAxeX'],
                    y: item['tauxCo2'],
                })
            );

            resolve();

            console.log('🟢 SUCCESS CO2 3/5 ==> Stockage valeures :', valeurTauxCo2);

        } catch (error) {

            console.log("🔴 ERREUR CO2 3/5 ==> Stockage valeures :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//? Stockage de la consigne Co2.

let valeurConsigneCo2 = [];

const stockageConsigneCo2 = () => {
    return new Promise((resolve, reject) => {

        try {

            consigneCourbeCo2.forEach((item, index) =>
                valeurConsigneCo2.push({
                    // x: item['createdAt'].split('.')[0].split('T')[0],
                    x: item['valeurAxeX'],
                    y: item['consigne'],
                })
            );

            resolve();

            console.log('🟢 SUCCESS CO2 4/5 ==> Stockage consigne :', valeurConsigneCo2);

        } catch (error) {

            console.log("🔴 ERREUR CO2 4/5 ==> Stockage consigne :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//? Construction du graphique temperature air.

let constructionDuGraphiqueCo2 = () => {

    return new Promise((resolve, reject) => {

        try {

            const ctxCo2 = document.getElementById('myChartCo2').getContext('2d');

            const myLabelsCo2 = [];

            const data = {
                labels: myLabelsCo2,

                datasets: [
                    // Courbe taux Co2
                    {
                        label: 'Courbe Taux Co2',
                        data: valeurTauxCo2,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        lineTension: 0.2,
                        pointRadius: 0,
                        // xAxisID: 'xAxis1',
                    },

                    // Courbe consigne Co2
                    {
                        label: 'Courbe Consigne Co2',
                        data: valeurConsigneCo2,
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

            const optionsCo2 = {
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

            const configCo2 = {
                type: 'line',
                data,
                optionsCo2,
            };

            new Chart(ctxCo2, configCo2);


            console.log('🟢 SUCCESS CO2 5/5 ==> Construction graphique');

            resolve();

        } catch (error) {

            console.log("🔴 ERREUR CO2 5/5 ==> Construction graphique :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//! Resolve promise. 

const handleMyPromiseCo2 = async () => {

    try {

        await chargementDatas();
        await getDataCourbeCo2();
        await stockageValeuresCo2();
        await stockageConsigneCo2();
        await constructionDuGraphiqueCo2();

    }
    catch (err) {
        console.log('🔺 ERREUR ==> Resolve promise', err);
    }
};

handleMyPromiseCo2();