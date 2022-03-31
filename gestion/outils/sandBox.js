const axios = require('axios');

let date = new Date();
let dateDuJour;
let dateDemarrageCycle;
let difference;
let jourDuCycle;
let heureDuCycle;
let minuteDuCycle;
let heureMinute;
let valeurAxeX;

let getDateDemarrageCycle = () => {
  axios
    .get('http://localhost:3003/api/gestionCourbeRoutes/getDateDemarrageCycle')
    .then((response) => {
      //   console.log(
      //     'Date démarrage du cycle :---:',
      //     response.data.dateDemarrageCycle.dateDemarrageCycle
      //   );

      //* Date du jour.
      dateDuJour = new Date();
      console.log('Date du Jour :---------------------:', dateDuJour);
      //* --------------------------------------------------

      //* Date de demarrage du cycle
      dateDemarrageCycle = new Date(
        response.data.dateDemarrageCycle.dateDemarrageCycle
      );
      console.log('La date de démarrage du cycle :----:', dateDemarrageCycle);
      //* --------------------------------------------------

      //* Affichage du nombre de jour du cycle.
      difference = Math.abs(dateDuJour - dateDemarrageCycle);
      jourDuCycle = Math.round(difference / (1000 * 3600 * 24)) + 1;
      console.log('Nombre de jour du cycle :----------:', jourDuCycle);
      //* --------------------------------------------------

      //* Affichage de l'heure.
      heureDuCycle = new Date().getHours();
      minuteDuCycle = new Date().getMinutes();
      heureMinute = heureDuCycle + 'h' + minuteDuCycle;
      console.log("l'heure du cycle :-----------------:", heureMinute);
      //* --------------------------------------------------

      //* Valeure de l'axe x.
      valeurAxeX = 'Jour ' + jourDuCycle + ' - ' + heureMinute;
      console.log("Valeure de l'axe x :---------------:", valeurAxeX);
      //* --------------------------------------------------
    })
    .catch((error) => {
      console.log(error);
    });
};
getDateDemarrageCycle();
