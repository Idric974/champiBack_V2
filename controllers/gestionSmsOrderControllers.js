const axios = require('axios');

exports.postSmsOrder = (req, res) => {

    let numSalleBrut = req.body.message.split(':')[1]
    let numSalle = numSalleBrut;
    console.log('NUMERO DE LA SALLE :', numSalle);

    //!  les promesses.

    //? Interrogation de la base de données.

    const mysql = require('mysql');

    let temperatureAir;
    let consigne;
    let deltaAir;

    let interrogationBaseDonnées = () => {
        return new Promise((resolve, reject) => {
            try {

                const con = mysql.createConnection({
                    host: 'localhost',
                    user: 'idric',
                    password: 'Kup33uC4W6',
                    database: 'champyresi',
                });

                let table = 'gestion_airs';

                con.connect(function (err) {
                    if (err) throw err;
                    console.log('Connecté à la base de données MySQL!');
                    //
                    con.query(
                        'SELECT * FROM ' + table + ' WHERE id=(SELECT max(id) FROM ' + table + ')',
                        function (err, result) {

                            if (err) {

                                reject();
                                throw err;

                            } else {

                                // console.log(result);

                                temperatureAir = result[0].temperatureAir;
                                console.log('temperatureAir : ', temperatureAir);

                                consigne = result[0].consigne;
                                console.log('consigne : ', consigne);

                                deltaAir = result[0].deltaAir;
                                console.log('deltaAir : ', deltaAir);

                                resolve();

                            }

                        }
                    );
                });

            } catch (error) {
                console.log("ERROR : Interrogation de la base de données :", error);
            }
        });
    }

    //? ------------------------------------------------- 

    //? Envoi des résultats de la requête.

    const envoiRsultatsRequete = (temperatureDuMessage) => {

        //! Url de la master.
        const url = 'http://192.168.1.6:4000/api/postSms/postSms';

        let date1 = new Date();

        let dateLocale = date1.toLocaleString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        let message = `Salle = ${numSalle} | Temperature Air = ${temperatureAir} | Consigne Air = ${consigne} | Delta Air = ${deltaAir}`

        axios
            .post(url, {
                message,
            })
            .then(function (response) {
                console.log('Reponse de SMS808 : ', response.data);

            })
            .catch(function (error) {
                console.log(error);

            });

    }

    //? --------------------------------------------------

    //! -------------------------------------------------   

    //! Exécution des promesses. 

    let handleMyPromise = async () => {

        try {

            await interrogationBaseDonnées();
            await envoiRsultatsRequete();
        }
        catch (err) {
            console.log('err :', err);
        }
    };

    handleMyPromise();

    //! -------------------------------------------------  














};