/* MIDNIGHT BLACKJACK JS foundations */

// 1. CONNECT JS TO HTML ELEMENTS

const balanceDisplay = document.getElementById("balance");

const currentBetDisplay = document.getElementById("current-bet");

const dealerHand = document.getElementById("dealer-hand");

const playerHand = document.getElementById("player-hand");

const dealerScoreDisplay = document.getElementById("dealer-score");

const playerScoreDisplay = document.getElementById("player-score");

const gameMessage = document.getElementById("game-message");

const betButtons = document.querySelectorAll(".bet-button");

const dealButton = document.getElementById("deal-button");

const hitButton = document.getElementById("hit-button");

const standButton = document.getElementById("stand-button");

const newGameButton = document.getElementById("new-game-button");

// Game statistics

const gamesPlayedDisplay = document.getElementById("games-played");

const gamesWonDisplay = document.getElementById("games-won");

const gamesLostDisplay = document.getElementById("games-lost");

const winRateDisplay = document.getElementById("win-rate");


// 2. CREATE INITIAL GAME VALUES

let balance = 1000;

let currentBet = 0;

let deck = [];

let playerCards = [];

let dealerCards = [];

let gameActive = false;

// 3. CREATE STATS COUNTERS

let gamesPlayed = 0;

let gamesWon = 0;

let gamesLost = 0;

let gamesTied = 0;

// 4. TESTING IF FUNCTIONAL

console.log("Welcome to Midnight Blackjack! ♠");

console.log("Starting balance:", balance);

console.log("Game elements connected successfully.");



