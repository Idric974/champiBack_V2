(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}]},{},[1]);
