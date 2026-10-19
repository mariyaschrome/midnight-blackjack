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

// 7. CREATE AND SHUFFLE FIRST DECK

deck = shuffleDeck(createDeck());

console.log("Deck created successfully!");

console.log("Number of cards:", deck.length);

console.log("Example card:", deck[0]);


/* 8. DRAW A CARD FROM THE DECK */

function drawCard() {
    // Check whether any cards remain
    if (deck.length === 0) {
        console.log("The deck is empty!");
        return null;
    }

    // Remove and return the top card
    const card = deck.pop();

    console.log("Card drawn:", card.rank, card.suit);

    return card;
}

/* 9. CALCULATE A HAND'S SCORE */

function calculateScore(cards) {
    let score = 0;
    let aces = 0;

    // Add up the value of every card
    for (const card of cards) {
        score += card.value;

        // Count Aces so we can adjust them later
        if (card.rank === "A") {
            aces++;
        }
    }

    // An Ace starts at 11, but can count as 1
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

/* 10. DISPLAY A PLAYING CARD */

function renderCard(card, hidden = false) {
    // Create HTML element for the card
    const cardElement = document.createElement("div");

    // Give the card its CSS classes
    cardElement.classList.add("playing-card");

    // Display the back of the dealer's hidden card
    if (hidden) {
        cardElement.classList.add("card-back");
        cardElement.textContent = "♠";
        return cardElement;
    }

    // Make hearts and diamonds red
    if (card.suit === "♥" || card.suit === "♦") {
        cardElement.classList.add("redd-card");
    }

    // Add the card's rank and suit
    cardElement.innerHTML = `
        <span class="card-rank">${card.rank}</span>
        <span class="card-suit">${card.suit}</span>
    `;

    return cardElement;
}


