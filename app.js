"use strict";
const overlay = document.querySelector(".overlay");
const settings = document.querySelector(".settings");
const settingsInput = document.querySelector(".settings__input");
const settingsStart = document.querySelector(".settings__start");

const board = document.querySelector(".board");
const playerArea = document.querySelector(".player");

const cards = [];
const rank = ["J", "Q", "K", "A"];
const suit = ["C", "D", "H", "S"];

for (let i = 2; i < 15; i++) {
  if (i <= 10) {
    for (let j = 0; j < 4; j++) {
      cards.push(`${i}_${suit[j]}`);
    }
  } else {
    for (let j = 0; j < 4; j++) {
      cards.push(`${rank[i - 11]}_${suit[j]}`);
    }
  }
}

let playerCount = 1;
let players = [];
let deck = [];
let currentPla;

class Player {
  constructor(name, point = 0) {
    (this.name = name), (this.point = point);
  }
}

const randomizeCard = function () {
  let oldDeck = cards.slice(0);
  let newDeck = [];

  for (let i = 0; i < cards.length; i++) {
    const randomIndex = Math.floor(Math.random() * oldDeck.length);
    newDeck.push(...oldDeck.splice(randomIndex, 1));
  }
  return newDeck;
};

const playerBox = `
<div class="box player__box">
<div class="cards player__cards">
  <img src="cards/10_C.svg" alt="" class="card" />
</div>
<div class="controls player__controls">
  <div class="btn hit player__hit">
    <svg class="icon">
      <use xlink:href="sprite.svg#icon-plus"></use>
    </svg>
  </div>
  <div class="score player__score">0</div>
  <div class="btn stay player__stay">
    <svg class="icon">
      <use xlink:href="sprite.svg#icon-hour-glass"></use>
    </svg>
  </div>
</div>
</div>`;

const addPlayerBox = function () {
  for (let i = 0; i < players.length; i++) {
    playerArea.insertAdjacentHTML("afterbegin", playerBox);
  }
};

// Update number of players
settingsInput.addEventListener("change", function () {
  playerCount = Number(settingsInput.value);
});

// start the game by clicking 'start' button
settingsStart.addEventListener("click", function () {
  players = [...Array(playerCount)].map(
    (el, i) => new Player(`Player${i + 1}`)
  );
  // players.push(new Player("dealer"));
  overlay.classList.toggle("hidden");
  board.classList.toggle("hidden");
  addPlayerBox();
});

deck = randomizeCard();

console.log(playerArea);
