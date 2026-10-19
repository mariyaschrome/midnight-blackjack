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

/* 11. DISPLAY THE PLAYER'S AND DEALER'S HANDS */

function renderHands(hideDealerCard = false) {
    // Clear the current cards from the table
    playerHand.innerHTML = "";
    dealerHand.innerHTML = "";

    // Display the player's cards
    for (const card of playerCards) {
        playerHand.appendChild(renderCard(card));
    }

    // Display the dealer's cards
    for (let i = 0; i < dealerCards.length; i++) {
        const shouldHide = hideDealerCard && i === 1;

        dealerHand.appendChild(
            renderCard(dealerCards[i], shouldHide)
        );
    }

    // Update the player's score
    playerScoreDisplay.textContent = 
         calculateScore(playerCards);

    // Update the dealer's visible score
    if (hideDealerCard && dealerCards.length > 1) {
        dealerScoreDisplay.textContent = 
           calculateScore(dealerCards[0]) + " + ?";
    } else {
        dealerScoreDisplay.textContent =
           calculateScore(dealerCards);
    }
}

/* 12. START NEW ROUND */

function startGame() {
    // Prevent starting another round mid-game
    if (gameActive) {
        return;
    }

    // Check that a bet has been placed
    if (currentBet <= 0) {
        gameMessage.textContent = "Place your bet first! 💎";
        return;
    }

    // Check that the player can afford the bet
    if (currentBet > balance) {
        gameMessage.textContent = "Not enough chips for that bet!";
        return;
    }

    // Deduct the bet from the player's balance
    balance -= currentBet;
    balanceDisplay.textContent = balance;

    // Prepare a fresh deck for the round
    deck = shuffleDeck(createDeck());

    // Clear the previous hands
    playerCards = [];
    dealerCards = [];

    // Deal two cards to each slide
    playerCards.push(drawCard());
    dealerCards.push(drawCard());
    playerCards.push(drawCard());
    dealerCards.push(drawCard());

    // Mark the round as active
    gameActive = true;

    // Display the hands, hiding the dealer's second card
    renderHands(true);

    // Update the message
    gameMessage.textContent = "Your move! Hit or stand. ♠";

    // Update button availability 
    dealButton.disabled = true;
    hitButton.disabled = false;
    standButton.disabled = false;

    // Check for a natural Blackjack
    if (calculateScore(playerCards) === 21) {
        gameMessage.textContent = "Blackjack! Let's see the dealer's hand. ♠";
        stand();
    }
}

/* 13. CONNECT THE DEAL BUTTON */

dealButton.addEventListener("click", startGame);

/* 14. DEALER'S TURN AND ROUND RESULTS */

function stand() {
    // Do nothing if there is no active round
    if (!gameActive) {
        return;
    }

    // Reveal the dealer's hidden card
    renderHands(false);

    // Dealer draws until reaching at least 17
    while (calculateScore(dealerCards) < 17) {
        const card = drawCard();

        if (card === null) {
            break;
        }

        dealerCards.push(card);
    }

    // Show both complete hands and scores
    renderHands(false);

    // Calculate final scores
    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);

    // Count this completed game
    gamesPlayed++;

    // Determine the result
    if (playerScore > 21) {
        gameMessage.textContent = "Bust! the dealer wins. 💔";
        gamesLost++;
    } else if (dealerScore > 21) {
        gameMessage.textContent = "Dealer busts! You win! 💜"
        gamesWon++;
        balance += currentBet * 2;
    } else if (playerScore > dealerScore) {
        gameMessage.textContent = "You win! Beautifully played. ♛";
        gamesWon++;
        balance += currentBet * 2;
    } else if (playerScore < dealerScore) {
        gameMessage.textContent = "The dealer wins this round. ♠";
        gamesLost++;
    } else {
        gameMessage.textContent = "It's a tie! Your bet is returned.";
        gamesTied++;
        balance += currentBet;
    }

    // Update the wallet
    balanceDisplay.textContent = balance;

    // Update game statistics
    gamesPlayedDisplay.textContent = gamesPlayed;
    gamesWonDisplay.textContent = gamesWon;
    gamesLostDisplay.textContent = gamesLost;

    const winRate = gamesPlayed > 0
    ? Math.round((gamesWon / gamesPlayed) * 100)
    : 0;

    winRateDisplay.textContent = winRate + "%";

    // Mark the round as finished
    gameActive = false;

    // Update buttons
    dealButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
}

/* 15. CONNECT THE STAND BUTTON */
standButton.addEventListener("click", stand);

/* 16. HIT - DRAW ANOTHER CARD */

function hit() {
    // Only allow hits during an active round
    if (!gameActive) {
        return;
    }

    // Draw a card and add it to the player's hand
    const card = drawCard();

    if (card === null) {
        gameMessage.textContent = "No cards left in the deck!";
        return;
    }

    playerCards.push(card);

    // Refresh the cards and store on the table
    renderHands(true);

    const playerScore = calculateScore(playerCards);

    // Check whether the player has gone bust
    if (playerScore > 21) {
        gameMessage.textContent = "Bust! You've gone over 21. 💔";
        stand();
        return;
    }

    // Check whether the player has reached 21
    if (playerScore === 21) {
        gameMessage.textContent = "You have 21! Let's see the dealer's hand. ♛";
        stand();
        return;
    }

    // Otherwise, the player can keep playing
    gameMessage.textContent = "Your score is " + playerScore + ". Hit os stand? ♠";
}

/* 17. CONNECT THE HIT BUTTON */
hitButton.addEventListener("click", hit);
