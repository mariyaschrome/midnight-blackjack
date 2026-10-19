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

// 5. CREATE A STANDARD 52-CARD DECK

function createDeck() {
    const suits = ["♥", "♦", "♣", "♠"];

    const ranks = [
        "A", "2", "3", "4", "5", "6", "7",
        "8", "9", "10", "J", "Q", "K"
    ];

    const newDeck = [];

    for (const suit of suits) {
        for (const rank of ranks) {

            let value;

            if (rank === "A") {
                value = 11;
            } else if (["J", "Q", "K"].includes(rank)) {
                value = 10;
            } else {
                value = Number(rank);
            }

            newDeck.push({
                suit: suit,
                rank: rank,
                value: value
            });
        }
    }

    return newDeck;
}

//6. SHUFFLE THE DECK

function shuffleDeck(cards) {
    for (let i = cards.length - 1; i > 0; i--) {

        const randomIndex = Math.floor(
            Math.random() * (i + 1)
        );

        [cards[i], cards[randomIndex]] = [
            cards[randomIndex],
            cards[i]
        ];
    }

    return cards;
}


