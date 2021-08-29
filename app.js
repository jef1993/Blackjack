"use strict";
const overlay = document.querySelector(".overlay");
const settings = document.querySelector(".settings");
const settingsInput = document.querySelector(".settings__input");
const settingsStart = document.querySelector(".settings__start");

const board = document.querySelector(".board");
const playerArea = document.querySelector(".player");
const dealerArea = document.querySelector(".dealer");
const playerBox = document.querySelectorAll(".player__box");
const nextRound = document.querySelector(".next-round");

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
let currentPlayerIndex;

class Player {
  constructor(name) {
    (this.name = name), (this.point = [0]), (this.cards = []);
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
  <button class="btn hit player__hit">
    <svg class="icon">
      <use xlink:href="sprite.svg#icon-plus"></use>
    </svg>
  </button>
  <div class="score player__score">0</div>
  <button class="btn stay player__stay">
    <svg class="icon">
      <use xlink:href="sprite.svg#icon-hour-glass"></use>
    </svg>
  </button>
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
  players.unshift(new Player("dealer"));
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

  const displayInitialCards = function () {
    for (let i = 0; i < 2; i++) {
      dealerArea.children[0].children[0].insertAdjacentHTML(
        "beforeend",
        cardHTML(players[0].cards[i], i === 0 ? true : false)
      );

      for (let j = 0; j < players.length - 1; j++) {
        playerArea.children[j].children[0].insertAdjacentHTML(
          "beforeend",
          cardHTML(players[j + 1].cards[i])
        );
      }
    }
  };

  displayInitialCards();

  // Update point
  const score = document.querySelectorAll(".score");

  const updatePoints = function (targetIndex) {
    let scores = players[targetIndex].cards
      .map((item) => {
        const value = item.split("_")[0].replace(/[JQK]/, 10).replace(/[A]/, 1);
        return Number(value);
      })
      .map((el) => (el === 1 ? [1, 11] : el));

    players[targetIndex].cardValues = scores;
    const noAces = scores.filter((el) => typeof el === "number");
    const numOfAce = scores.filter((el) => typeof el !== "number").length;

    const calcAce = function (num) {
      const output = [];
      for (let i = 0; i <= num; i++) {
        output.push(i * 10 + num);
      }
      return output;
    };

    const aceCombo = calcAce(numOfAce);
    let total = [];
    for (let i = 0; i < aceCombo.length; i++) {
      let sum = 0;
      for (let j = 0; j < noAces.length; j++) {
        sum += noAces[j];
      }
      total.push(sum + aceCombo[i]);
    }
    players[targetIndex].point = total;

    const maxPt = total.reduce((a, c) => {
      return c > a && c <= 21 ? c : a;
    });
    players[targetIndex].maxPoint = maxPt;

    score[targetIndex].innerHTML =
      maxPt <= 21
        ? players[targetIndex].point.filter((el) => el <= 21).join("/")
        : "X";
  };

  for (let i = 0; i < players.length; i++) {
    updatePoints(i);
  }
  // veil dealer's score
  score[0].innerHTML = players[0].cardValues[players[0].cardValues.length - 1]
    .toString()
    .replace(/,/, "/");

  const btn = document.querySelectorAll(".btn");
  const hit = document.querySelectorAll(".hit");
  const stay = document.querySelectorAll(".stay");
  const cardsArea = document.querySelectorAll(".cards");
  const cardFront = document.querySelectorAll(".card__front");
  const cardBack = document.querySelectorAll(".card__back");
  const box = document.querySelectorAll(".box");

  // Set current player

  const setFirstPlayer = function () {
    btn.forEach((el) => (el.disabled = "true"));
    currentPlayerIndex = 1;
    hit[currentPlayerIndex].disabled = "";
    stay[currentPlayerIndex].disabled = "";
    box[currentPlayerIndex].classList.toggle("current");
  };

  setFirstPlayer();

  const calcPoint = function () {
    hit.forEach((el) => (el.disabled = "true"));
    stay.forEach((el) => (el.disabled = "true"));
    box.forEach((el) => el.classList.remove("current"));
    nextRound.classList.toggle("hidden");

    console.log(players);

    for (let i = 1; i < players.length; i++) {
      if (players[i].maxPoint <= 21) {
        if (players[i].maxPoint > players[0].maxPoint || players[0] > 21) {
          box[i].classList.toggle("win");
        } else {
          if (players[i].maxPoint < players[0].maxPoint) {
            box[i].classList.toggle("lose");
          } else {
            box[i].classList.toggle("tie");
          }
        }
      } else {
        box[i].classList.toggle("lose");
      }
    }
  };

  const toNextPlayer = function () {
    hit[currentPlayerIndex].disabled = "true";
    stay[currentPlayerIndex].disabled = "true";
    box[currentPlayerIndex].classList.toggle("current");

    currentPlayerIndex =
      currentPlayerIndex === players.length - 1
        ? 0
        : currentPlayerIndex === 0
        ? ""
        : currentPlayerIndex + 1;

    if (currentPlayerIndex === 0) {
      cardFront[0].classList.remove("face-down");
      cardBack[0].classList.remove("face-up");
      updatePoints(currentPlayerIndex);
    }

    console.log(hit[currentPlayerIndex]);

    if (currentPlayerIndex !== "") {
      hit[currentPlayerIndex].disabled = "";
      stay[currentPlayerIndex].disabled = "";
      box[currentPlayerIndex].classList.toggle("current");
    } else {
      calcPoint();
    }
  };

  // Add one card on clicking hit button

  hit.forEach((el, i) =>
    el.addEventListener("click", function () {
      // repunish card if deck is empty
      if (deck.length <= 0) {
        deck = randomizeCard().concat(deck);
      }

      addCards(players[i].cards, 1);
      cardsArea[i].insertAdjacentHTML(
        "beforeend",
        cardHTML(players[i].cards[players[i].cards.length - 1])
      );

      updatePoints(i);

      if (players[i].maxPoint >= 21) {
        toNextPlayer();
      }
    })
  );

  stay.forEach((el, i) => {
    el.addEventListener("click", function () {
      toNextPlayer();
    });
  });

  nextRound.addEventListener("click", function () {
    box.forEach((el) => {
      el.classList.remove("win");
      el.classList.remove("lose");
      el.classList.remove("tie");
    });

    players.forEach((el, i) => {
      el.cards = [];
      addCards(el.cards, 2);
      updatePoints(i);
    });

    console.log(players);

    score[0].innerHTML = players[0].cardValues[players[0].cardValues.length - 1]
      .toString()
      .replace(/,/, "/");

    cardFront[0].classList.toggle("face-down");
    cardBack[0].classList.toggle("face-up");

    setFirstPlayer();
    cardsArea.forEach((el) => (el.innerHTML = ""));
    displayInitialCards();
    nextRound.classList.toggle("hidden");
  });
});
