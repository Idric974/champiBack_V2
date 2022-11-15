//! Afficher la date.

let dateheure;

function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function afficherDate() {
    while (true) {
        await pause(1000);
        var cejour = new Date();
        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        };
        var date = cejour.toLocaleDateString('fr-RU', options);
        var heure =
            ('0' + cejour.getHours()).slice(-2) +
            ':' +
            ('0' + cejour.getMinutes()).slice(-2) +
            ':' +
            ('0' + cejour.getSeconds()).slice(-2);
        var dateheure = date + ' ' + heure;

        dateheure = dateheure.replace(/(^\w{1})|(\s+\w{1})/g, (lettre) =>
            lettre.toUpperCase()
        );

        // console.log('heure :', dateheure);

        // document.getElementById('afficheDate').innerHTML = dateheure;
    }
}



module.exports = afficherDate();

//! -------------------------------------------------