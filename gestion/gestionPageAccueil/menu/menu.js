//console.log("Salut les gens");

//? switch Valve A/B.

let vanneActive = "A";

document.addEventListener("DOMContentLoaded", function () {
  const buttonA = document.getElementById("switchValveA");
  const buttonB = document.getElementById("switchValveB");

  function toggleButtonA() {
    buttonA.innerHTML = "ON";
    buttonA.style.backgroundColor = "var(--orangeClic974)";

    buttonB.innerHTML = "OFF";
    buttonB.style.backgroundColor = "var(--greenColor)";
  }

  function toggleButtonB() {
    buttonB.innerHTML = "ON";
    buttonB.style.backgroundColor = "var(--orangeClic974)";

    buttonA.innerHTML = "OFF";
    buttonA.style.backgroundColor = "var(--greenColor)";
  }

  buttonA.addEventListener("click", function () {
    toggleButtonA();
    vanneActive = "A";
    console.log("Vanne active", vanneActive);
  });
  buttonB.addEventListener("click", function () {
    toggleButtonB();
    vanneActive = "B";
    console.log("Vanne active", vanneActive);
  });
});

module.exports = {vanneActive};

//? -------------------------------------------------