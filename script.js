/* MIDNIGHT BLACKJACK: now with Double Down, Split and saved progress */

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
const doubleButton = document.getElementById("double-button"); // NEW
const splitButton = document.getElementById("split-button");   // NEW
const newGameButton = document.getElementById("new-game-button");

const gamesPlayedDisplay = document.getElementById("games-played");
const gamesWonDisplay = document.getElementById("games-won");
const gamesLostDisplay = document.getElementById("games-lost");
const winRateDisplay = document.getElementById("win-rate");

// 2. SETTINGS AND GAME VALUES

const STORAGE_KEY = "midnightBlackjackSave";
const STARTING_BALANCE = 1000;
const MAX_HANDS = 4; // how many hands a player can split into

let balance = STARTING_BALANCE;
let currentBet = 0;
let deck = [];
let dealerCards = [];
let gameActive = false;

// The player can now have several hands (after splitting).
// Each hand: { cards: [], bet: number, done: boolean, natural: boolean }
let playerHands = [];
let activeHand = 0;

// 3. STATS COUNTERS

let gamesPlayed = 0;
let gamesWon = 0;
let gamesLost = 0;
let gamesTied = 0;

// 4. SAVE AND LOAD PROGRESS

function saveProgress() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            balance, gamesPlayed, gamesWon, gamesLost, gamesTied
        }));
    } catch (error) {
        console.log("Could not save progress:", error);
    }
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return;
        }

        const data = JSON.parse(raw);
        const num = (value, fallback) =>
            Number.isFinite(value) && value >= 0 ? value : fallback;

        balance = num(data.balance, STARTING_BALANCE);
        gamesPlayed = num(data.gamesPlayed, 0);
        gamesWon = num(data.gamesWon, 0);
        gamesLost = num(data.gamesLost, 0);
        gamesTied = num(data.gamesTied, 0);
    } catch (error) {
        console.log("Could not load saved progress:", error);
    }
}

// 5. CREATE AND SHUFFLE A DECK

function createDeck() {
    const suits = ["♥", "♦", "♣", "♠"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
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

            newDeck.push({ suit: suit, rank: rank, value: value });
        }
    }

    return newDeck;
}

function shuffleDeck(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
    }

    return cards;
}

function drawCard() {
    if (deck.length === 0) {
        console.log("The deck is empty!");
        return null;
    }

    return deck.pop();
}

// 6. SCORING

function calculateScore(cards) {
    let score = 0;
    let aces = 0;

    for (const card of cards) {
        score += card.value;

        if (card.rank === "A") {
            aces++;
        }
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// 7. DISPLAY HELPERS

function renderCard(card, hidden = false) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("playing-card");

    if (hidden) {
        cardElement.classList.add("card-back");
        cardElement.textContent = "♠";
        return cardElement;
    }

    // Make sure this class name matches your CSS
    if (card.suit === "♥" || card.suit === "♦") {
        cardElement.classList.add("red-card");
    }

    cardElement.innerHTML = `
        <span class="card-rank">${card.rank}</span>
        <span class="card-suit">${card.suit}</span>
    `;

    return cardElement;
}

function renderHands(hideDealerCard = false) {
    playerHand.innerHTML = "";
    dealerHand.innerHTML = "";

    // Each player hand gets its own group so split hands sit side by side
    playerHands.forEach(function(hand, index) {
        const group = document.createElement("div");
        group.classList.add("hand-group");

        if (gameActive && playerHands.length > 1 && index === activeHand) {
            group.classList.add("active-hand");
        }

        for (const card of hand.cards) {
            group.appendChild(renderCard(card));
        }

        playerHand.appendChild(group);
    });

    for (let i = 0; i < dealerCards.length; i++) {
        const shouldHide = hideDealerCard && i === 1;
        dealerHand.appendChild(renderCard(dealerCards[i], shouldHide));
    }

    // Player score(s): "18" or "18 | 21" when split
    playerScoreDisplay.textContent = playerHands.length > 0
        ? playerHands.map(function(hand) {
            return calculateScore(hand.cards);
        }).join(" | ")
        : "0";

    // Dealer score
    if (dealerCards.length === 0) {
        dealerScoreDisplay.textContent = "0";
    } else if (hideDealerCard && dealerCards.length > 1) {
        dealerScoreDisplay.textContent = calculateScore([dealerCards[0]]) + " + ?";
    } else {
        dealerScoreDisplay.textContent = calculateScore(dealerCards);
    }
}

function updateStats() {
    balanceDisplay.textContent = balance;
    gamesPlayedDisplay.textContent = gamesPlayed;
    gamesWonDisplay.textContent = gamesWon;
    gamesLostDisplay.textContent = gamesLost;

    const winRate = gamesPlayed > 0
        ? Math.round((gamesWon / gamesPlayed) * 100)
        : 0;

    winRateDisplay.textContent = winRate + "%";
}

function getMinBet() {
    return Math.min(...Array.from(betButtons).map(function(button) {
        return Number(button.dataset.bet);
    }));
}

function updateBetButtons() {
    betButtons.forEach(function(button) {
        const amount = Number(button.dataset.bet);
        button.disabled = gameActive || amount > balance;
    });
}

// 8. RULES: WHAT CAN THE PLAYER DO RIGHT NOW?

function currentHand() {
    return playerHands[activeHand];
}

function canSplit(hand) {
    return hand.cards.length === 2
        && hand.cards[0].value === hand.cards[1].value
        && playerHands.length < MAX_HANDS
        && balance >= hand.bet;
}

function updateControls() {
    const hand = currentHand();
    const canAct = gameActive && hand && !hand.done;

    dealButton.disabled = gameActive;
    hitButton.disabled = !canAct;
    standButton.disabled = !canAct;
    doubleButton.disabled = !(canAct && hand.cards.length === 2 && balance >= hand.bet);
    splitButton.disabled = !(canAct && canSplit(hand));

    // Show the total on the table during a round, the chosen bet otherwise
    if (gameActive) {
        currentBetDisplay.textContent = playerHands.reduce(function(total, h) {
            return total + h.bet;
        }, 0);
    } else {
        currentBetDisplay.textContent = currentBet;
    }
}

// 9. START A ROUND

function startGame() {
    if (gameActive) {
        return;
    }

    if (currentBet <= 0) {
        gameMessage.textContent = "Place your bet first! 💎";
        return;
    }

    if (currentBet > balance) {
        gameMessage.textContent = "Not enough chips for that bet!";
        return;
    }

    balance -= currentBet;

    deck = shuffleDeck(createDeck());
    dealerCards = [];
    playerHands = [{ cards: [], bet: currentBet, done: false, natural: false }];
    activeHand = 0;

    playerHands[0].cards.push(drawCard());
    dealerCards.push(drawCard());
    playerHands[0].cards.push(drawCard());
    dealerCards.push(drawCard());

    gameActive = true;
    updateStats();
    updateBetButtons();
    renderHands(true);

    // Natural blackjack: round ends straight away
    if (calculateScore(playerHands[0].cards) === 21) {
        playerHands[0].natural = true;
        playerHands[0].done = true;
        gameMessage.textContent = "Blackjack! Let's see the dealer's hand. ♠";
        dealerTurn();
        return;
    }

    gameMessage.textContent = "Your move! Hit, stand, double or split. ♠";
    updateControls();
}

// 10. PLAYER ACTIONS

function hit() {
    const hand = currentHand();

    if (!gameActive || !hand || hand.done) {
        return;
    }

    const card = drawCard();

    if (card === null) {
        gameMessage.textContent = "No cards left in the deck!";
        return;
    }

    hand.cards.push(card);
    const score = calculateScore(hand.cards);

    if (score >= 21) {
        hand.done = true; // bust or 21: this hand is finished
    }

    renderHands(true);

    if (hand.done) {
        nextHand();
    } else {
        gameMessage.textContent = "Your score is " + score + ". Hit or stand? ♠";
        updateControls();
    }
}

function stand() {
    const hand = currentHand();

    if (!gameActive || !hand || hand.done) {
        return;
    }

    hand.done = true;
    renderHands(true);
    nextHand();
}

function doubleDown() {
    const hand = currentHand();

    if (!gameActive || !hand || hand.done
        || hand.cards.length !== 2 || balance < hand.bet) {
        return;
    }

    // Double the bet, take exactly one card, then the hand is finished
    balance -= hand.bet;
    hand.bet *= 2;

    const card = drawCard();

    if (card !== null) {
        hand.cards.push(card);
    }

    hand.done = true;
    updateStats();
    renderHands(true);
    nextHand();
}

function split() {
    const hand = currentHand();

    if (!gameActive || !hand || hand.done || !canSplit(hand)) {
        return;
    }

    // Place a matching bet on the new hand
    balance -= hand.bet;

    const movedCard = hand.cards.pop();
    const newHand = { cards: [movedCard], bet: hand.bet, done: false, natural: false };

    // Each hand gets a second card
    hand.cards.push(drawCard());
    newHand.cards.push(drawCard());

    // The new hand sits right after the one that was split
    playerHands.splice(activeHand + 1, 0, newHand);

    // Split aces get one card only. Any hand that reaches 21 is finished.
    const splittingAces = hand.cards[0].rank === "A";

    [hand, newHand].forEach(function(h) {
        if (splittingAces || calculateScore(h.cards) === 21) {
            h.done = true;
        }
    });

    updateStats();
    renderHands(true);
    nextHand();
}

// Move on to the next unfinished hand, or the dealer if all are done
function nextHand() {
    const next = playerHands.findIndex(function(h) {
        return !h.done;
    });

    if (next === -1) {
        dealerTurn();
        return;
    }

    activeHand = next;
    renderHands(true);

    if (playerHands.length > 1) {
        gameMessage.textContent = "Playing hand " + (next + 1) + " of " + playerHands.length + ". ♠";
    } else {
        gameMessage.textContent = "Your score is " + calculateScore(currentHand().cards) + ". Hit or stand? ♠";
    }

    updateControls();
}

// 11. DEALER'S TURN AND RESULTS

function dealerTurn() {
    // The dealer only needs to draw if a hand is still in the running
    const needsDealer = playerHands.some(function(hand) {
        return calculateScore(hand.cards) <= 21 && !hand.natural;
    });

    if (needsDealer) {
        while (calculateScore(dealerCards) < 17) {
            const card = drawCard();

            if (card === null) {
                break;
            }

            dealerCards.push(card);
        }
    }

    settleRound();
}

function settleRound() {
    const dealerScore = calculateScore(dealerCards);
    const dealerNatural = dealerCards.length === 2 && dealerScore === 21;
    const results = [];

    playerHands.forEach(function(hand) {
        const playerScore = calculateScore(hand.cards);
        gamesPlayed++;

        if (playerScore > 21) {
            results.push({ short: "Bust", full: "Bust! The dealer wins. 💔" });
            gamesLost++;
        } else if (hand.natural) {
            if (dealerNatural) {
                results.push({ short: "Push", full: "Both have blackjack. Your bet is returned." });
                gamesTied++;
                balance += hand.bet;
            } else {
                results.push({ short: "Blackjack", full: "Blackjack! Pays 3:2. ♛" });
                gamesWon++;
                balance += Math.round(hand.bet * 2.5);
            }
        } else if (dealerNatural) {
            results.push({ short: "Lose", full: "The dealer has blackjack. ♠" });
            gamesLost++;
        } else if (dealerScore > 21) {
            results.push({ short: "Win", full: "Dealer busts! You win! 💜" });
            gamesWon++;
            balance += hand.bet * 2;
        } else if (playerScore > dealerScore) {
            results.push({ short: "Win", full: "You win! Beautifully played. ♛" });
            gamesWon++;
            balance += hand.bet * 2;
        } else if (playerScore < dealerScore) {
            results.push({ short: "Lose", full: "The dealer wins this round. ♠" });
            gamesLost++;
        } else {
            results.push({ short: "Push", full: "It's a tie! Your bet is returned." });
            gamesTied++;
            balance += hand.bet;
        }
    });

    // One hand: full message. Several hands: a short summary.
    let message;

    if (results.length === 1) {
        message = results[0].full;
    } else {
        message = results.map(function(result, index) {
            return "Hand " + (index + 1) + ": " + result.short;
        }).join(" · ");
    }

    if (balance < getMinBet()) {
        message += " You're out of chips. Press New Game for a fresh bankroll!";
    }

    gameActive = false;
    renderHands(false);
    updateStats();
    saveProgress();
    updateBetButtons();
    updateControls();
    gameMessage.textContent = message;
}

// 12. PLACE AND CHANGE BETS

function placeBet(event) {
    if (gameActive) {
        gameMessage.textContent = "Finish your round before changing your bet!";
        return;
    }

    const betAmount = Number(event.currentTarget.dataset.bet);

    if (!Number.isFinite(betAmount) || betAmount <= 0) {
        return;
    }

    if (betAmount > balance) {
        gameMessage.textContent = "Not enough chips for that bet! 💎";
        return;
    }

    currentBet = betAmount;
    currentBetDisplay.textContent = currentBet;
    gameMessage.textContent = "Your bet is " + currentBet + " ⛃. Ready to deal? ♠";

    betButtons.forEach(function(button) {
        button.classList.remove("selected-bet");
    });

    event.currentTarget.classList.add("selected-bet");
}

// 13. START A FRESH TABLE

function newGame() {
    gameActive = false;
    playerHands = [];
    dealerCards = [];
    activeHand = 0;

    // Broke? Start over with a fresh bankroll and fresh stats.
    if (balance < getMinBet()) {
        balance = STARTING_BALANCE;
        gamesPlayed = 0;
        gamesWon = 0;
        gamesLost = 0;
        gamesTied = 0;
        saveProgress();
    }

    renderHands(false);

    currentBet = 0;

    betButtons.forEach(function(button) {
        button.classList.remove("selected-bet");
    });

    gameMessage.textContent = "Place your bet to begin! ♠";

    updateStats();
    updateBetButtons();
    updateControls();
}

// 14. CONNECT THE BUTTONS

dealButton.addEventListener("click", startGame);
hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
doubleButton.addEventListener("click", doubleDown);
splitButton.addEventListener("click", split);
newGameButton.addEventListener("click", newGame);

betButtons.forEach(function(button) {
    button.addEventListener("click", placeBet);
});

// 15. INITIALIZE THE TABLE

loadProgress();
newGame();