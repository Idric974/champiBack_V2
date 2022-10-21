let delta = -0.5;

if (delta >= 3) {

    //! Condition à 40 secondes.

    console.log(
        "🔺 %c SUCCÈS ==> gestions Air ==> ALERTE, le delta est supérieur à 3°C");

    //! -----------------------------------------------

} else if (delta > 1.5 && delta < 3) {

    //! Condition à 40 secondes.

    console.log(
        "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta > 1.5 && delta < 3");


} else if (delta > 1 && delta <= 1.5) {
    //
    //! Condition à 15 secondes.

    console.log(
        "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta > 1 && delta <= 1.5");

    //! -----------------------------------------------
    //
} else if (delta > 0.5 && delta <= 1) {
    //
    //! Condition à 5 secondes.

    console.log(
        "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta > 0.5 && delta <= 1");

    //! -----------------------------------------------
    //
} else if (delta > 0.3 && delta <= 0.5) {
    //
    //! Condition à 2 secondes.

    console.log(
        "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta > 0.3 && delta <= 0.5");

    //! -----------------------------------------------
    //
} else if (delta >= -0.3 && delta <= 0.3) {

    //***************************************************************

    //! Pas d'action car interval entre -0.3 et 0.3"

    console.log(
        "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta >= -0.3 && delta <= 0.3");

    //***************************************************************

} else if (delta < -0.3 && delta >= -0.5) {
    //
    //! Condition à 2 secondes.

    console.log(
        "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta < -0.3 && delta >= -0.5");

    //! -----------------------------------------------
    //
} else if (delta < -0.5 && delta >= -1) {
    //
    //! Condition à 5 secondes.

    console.log(
        "⭐ %c SUCCÈS ==> gestions Air ==> Action ouverture ==> delta < -0.5 && delta >= -1");

    //! -----------------------------------------------
    //
} else if (delta < -1 && delta >= -1.5) {
    //
    //! Condition à 15 secondes.

    console.log(
        "⭐ %c SUCCÈS ==> gestions Air ==> Action fermeture ==> delta < -1 && delta >= -1.5");

    //! -----------------------------------------------
    //
} else if (delta < -1.5 && delta < -3) {
    //
    //! Condition à 5 secondes.

    console.log(
        "⭐ %c SUCCÈS ==> gestions Air ==> Action fermeture ==> delta < -1.5 && delta < -3");

    //! -----------------------------------------------
    //
} else if (delta <= -3) {

    //! Condition à 5 secondes.

    console.log(
        "🔺 %c SUCCÈS ==> gestions Air ==> ALERTE, le delta est supérieur à -3°C");

    //! -----------------------------------------------

}