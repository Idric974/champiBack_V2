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

const getDataCourbeAir = () => {
    return new Promise((resolve, reject) => {

        axios({
            url: 'http://localhost:3003/api/gestionCourbeRoutes/getTemperatureAirCourbe/',
            method: 'get',
        })
            .then((response) => {
                console.log('🟢 SUCCESS AIR 1/7 ==> Récupération des datas courbes air :', response.data);

                //* Tempèrature air.

                dataCourbeAir = response.data.temperatureAirCourbe;

                loopNumberAir = Object.keys(dataCourbeAir).map(function (cle) {
                    return [Number(cle), dataCourbeAir[cle]];
                });
                console.log('loopNumberAir :', loopNumberAir.length);

                //* ---------------------------------------------------

                //* Consigne air.

                consigneCourbeAir = response.data.temperatureAirCourbe;

                loopNumberConsigne = Object.keys(consigneCourbeAir).map(function (cle) {
                    return [Number(cle), consigneCourbeAir[cle]];
                });

                console.log('loopNumberConsigne :', loopNumberConsigne.length);

                //* ---------------------------------------------------

                resolve();

            }).catch((error) => {

                console.log('🔴 ERREUR AIR 1/7 ==> Récupération des datas courbes air :', error);

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

            let loopCont = 0;

            const forLoop = async _ => {

                for (let i = 0; i < loopNumberAir.length; i++) {

                    loopCont++;

                    // console.log(`Num loop ============> ${loopCont}/${loopNumberAir.length}`);

                    dataCourbeAir.forEach((item, index) =>
                        valeurTemperatureAir.push({
                            // x: item['createdAt'],
                            x: item['valeurAxeX'],
                            y: item['temperatureAir'],
                        })
                    );

                    if (loopCont === loopNumberAir.length) {

                        resolve();

                        console.log('🟢 SUCCESS AIR 2/7 ==> Valeur temperature air :', valeurTemperatureAir);
                    }

                };

                console.log("FIN Stockage de la température de l'air")
            }

            forLoop();

        } catch (error) {

            console.log("🔴 ERREUR AIR 2/7 ==> Stockage de la température de l' air :", error);

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

            let loopCont = 0;

            const forLoop = async _ => {

                for (let i = 0; i < loopNumberConsigne.length; i++) {

                    loopCont++;

                    // console.log(`Num loop ============> ${loopCont}/${loopNumberConsigne.length}`);

                    consigneCourbeAir.forEach((item, index) =>
                        valeurConsigneAir.push({
                            x: item['valeurAxeX'],
                            y: item['consigne'],
                        })
                    );

                    if (loopCont === loopNumberConsigne.length) {

                        resolve();

                        console.log('🟢 SUCCESS AIR 3/7 ==> Valeur consigne air :', valeurConsigneAir);
                    }

                };

                console.log('FIN Stockage de la consigne air')
            }

            forLoop();

        } catch (error) {

            console.log("🔴 ERREUR AIR 3/7 ==> Stockage de la consigne air :", error);

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
                        label: 'Courbe Température Air',
                        data: valeurTemperatureAir,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        lineTension: 0.2,
                        pointRadius: 0,
                    },

                    // Courbe consigne air.
                    {
                        label: 'Courbe Consigne Air.',
                        data: valeurConsigneAir,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        lineTension: 0.2,
                        pointRadius: 0,
                        display: false,
                    },
                ],
            };

            const optionsAir = {
                animation: {
                    duration: 0,
                },
                scales: {
                    x: {},

                    y: {},
                },
                plugins: {
                    zoom: {},
                },
            };

            const configAir = {
                type: 'line',
                data,
                optionsAir,
            };

            const myChartAir = new Chart(ctxAir, configAir);

            Chart.register(zoomPlugin);

            console.log('🟢 SUCCESS AIR 4/7 ==> Construction du graphique Gestion courbes air');

            resolve();

        } catch (error) {

            console.log("🔴 ERREUR AIR 4/7 ==> Construction du graphique Gestion courbes air:", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//! --------------------------------------------------------------

//! Construction du graphique vanne air.

//? Récupération des datas vanne air.

const getDataVanneAir = () => {
    return new Promise((resolve, reject) => {

        axios({
            url: 'http://localhost:3003/api/gestionCourbeRoutes/getTemperatureAirCourbe/',
            method: 'get',
        })
            .then((response) => {
                console.log('🟢 SUCCESS AIR 5/7 ==> Récupération des datas vanne air :', response.data);

                dataCourbeAirVanne = response.data.temperatureAirCourbe;

                resolve();

            }).catch((error) => {

                console.log('🔴 ERREUR AIR 5/7 ==> Récupération des datas vanne air :', error);

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

            console.log('🟢 SUCCESS AIR 6/7 ==> Stockage des valeures vanne :', dataCourbeAirVanne);


            let loopCont = 0;

            const forLoop = async _ => {

                for (let i = 0; i < loopNumberAir.length; i++) {

                    loopCont++;

                    // console.log(`Num loop ============> ${loopCont}/${loopNumberAir.length}`);

                    dataCourbeAir.forEach((item, index) =>
                        valeurTemperatureAir.push({
                            // x: item['createdAt'],
                            x: item['valeurAxeX'],
                            y: item['temperatureAir'],
                        })
                    );

                    if (loopCont === loopNumberAir.length) {

                        resolve();

                        console.log('🟢 SUCCESS AIR 2/7 ==> Valeur temperature air :', valeurTemperatureAir);
                    }

                };

                console.log('End')
            }

            forLoop();




















        } catch (error) {

            console.log("🔴 ERREUR AIR 6/7 ==> Stockage des valeures vanne :", error);

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

            const myChartVanne = new Chart(ctxVanne, configVanne);

            console.log('🟢 SUCCESS AIR 7/7 ==> Construction du graphique vanne air');

            resolve();

        } catch (error) {

            console.log("🔴 ERREUR AIR 7/7 ==> Construction du graphique vanne air :", error);

            reject();

        }

    });
}

//? -------------------------------------------------

//! Resolve promise. 

const handleMyPromise = async () => {

    try {

        //* Graphique température air.
        await getDataCourbeAir();
        await stockageTempératureAir();
        await stockageConsigneAir();
        await constructionDuGraphiqueTemperatureAir();

        //* Graphique vanne air.
        //  await getDataVanneAir();
        //  await stockageDesValeuresVanne();
        // await constructionDuGraphiqueVanneAir();

    }
    catch (err) {
        console.log('🔺 ERREUR ==> Resolve promise', err);
    }
};

handleMyPromise();