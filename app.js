"use strict";
const overlay = document.querySelector(".overlay");
const settings = document.querySelector(".settings");
const settingsInput = document.querySelector(".settings__input");
const settingsStart = document.querySelector(".settings__start");

const board = document.querySelector(".board");
const playerArea = document.querySelector(".player");
const dealerArea = document.querySelector(".dealer");
const playerBox = document.querySelectorAll(".player__box");
// const btn = document.querySelectorAll(".btn");
// const stay = document.querySelectorAll(".stay");
// const cardsArea = document.querySelectorAll(".cards");

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
let dealer;
let deck = [];
let currentPlayer;

class Player {
  constructor(name, point = 0) {
    (this.name = name), (this.point = point), (this.cards = []);
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

const playerBoxHTML = `
<div class="box player__box">
<div class="cards player__cards"></div>
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
  for (let i = 0; i < players.length - 1; i++) {
    playerArea.insertAdjacentHTML("beforeend", playerBoxHTML);
  }
};

const drawCard = function () {
  return deck.pop();
};

const addCards = function (target, num) {
  for (let i = 0; i < num; i++) {
    target.push(drawCard());
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
  players.push(new Player("dealer"));
  // dealer = new Player();

  overlay.classList.toggle("hidden");
  board.classList.toggle("hidden");
  addPlayerBox();

  // randomize deck and add 2 cards to dealer and players each
  deck = randomizeCard();
  players.forEach((el) => addCards(el.cards, 2));

  // Update HTML to show players and dealer's cards

  const cardHTML = function (front, flipped = false) {
    return `
    <div class="card">
      <img src="cards/${front}.svg" alt="" class="card__front ${
      flipped ? "face-down" : ""
    }" />
      <img src="cards/back.svg" alt="" class="card__back ${
        flipped ? "face-up" : ""
      }" />
    </div>`;
  };

  for (let i = 0; i < 2; i++) {
    dealerArea.children[0].children[0].insertAdjacentHTML(
      "beforeend",
      cardHTML(players[players.length - 1].cards[i], i === 0 ? true : false)
    );

    for (let j = 0; j < players.length - 1; j++) {
      playerArea.children[j].children[0].insertAdjacentHTML(
        "beforeend",
        cardHTML(players[j].cards[i])
      );
    }
  }

  console.log(players);
  console.log(deck);

  currentPlayer = players[1];

  const hit = document.querySelectorAll(".hit");

  hit.forEach((el) =>
    el.addEventListener("click", function () {
      console.log("hit");
    })
  );
});
