let etatVanneMax = 40000;

let etatVanne = 15000;
let preconisation = 15000;

let tempOuvertureVanne;

let test = () => {
  if (etatVanne >= etatVanneMax) {
    // CAS 1.
    console.log('CAS 1 : etatVanne >= etatVanneMax ===> return');

    return;
    //
  } else if (preconisation + etatVanne >= etatVanneMax) {
    // CAS 2.
    tempOuvertureVanne = etatVanneMax - preconisation;
    console.log(
      'CAS 2 : preconisation + etatVanne >= etatVanneMax : ' +
        tempOuvertureVanne
      //
    );
  } else {
    // CAS 3.
    tempOuvertureVanne = preconisation;
    console.log(
      'CAS 3 : etatVanneMax + preconisation < etatVanneMax : ' +
        tempOuvertureVanne
    );

    //
  }
};

test();
