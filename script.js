const cardGrid = document.getElementById("card-grid");
const attemptsDisplay = document.getElementById("attempts");
const timerDisplay = document.getElementById("timer");
const resetButton = document.getElementById("reset-button");
const popupOverlay = document.querySelector(".popup-overlay");
const closePopup = document.getElementById("close-popup");
const difficultySelect = document.getElementById("difficulty");
const themeSelect = document.getElementById("theme");
const flipSound = new Audio("flip.mp3");
const winSound = new Audio("win.mp3");
const wrongSound = new Audio("wrong.mp3");
const themes = {
    "fruits": ["🍎", "🍌", "🍒", "🍇", "🍉", "🍓", "🥝", "🍍"],
    "animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
    "sports": ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🥎"]
};
let symbols = themes["fruits"];
let cards = [...symbols, ...symbols];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let timer = 0;
let interval;
let gridSize = 4;

// Shuffle function
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Start game
function startGame() {
    cardGrid.innerHTML = "";
    cards = shuffle(cards);
    matchedPairs = 0;
    attempts = 0;
    attemptsDisplay.textContent = attempts;
    timer = 0;
    timerDisplay.textContent = timer;
    clearInterval(interval);
    interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = timer;
    }, 1000);
    
    cardGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    cardGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
    
    cards.forEach(symbol => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.symbol = symbol;
        card.addEventListener("click", flipCard);
        cardGrid.appendChild(card);
    });
}

// Flip card function
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains("flipped")) {
        this.textContent = this.dataset.symbol;
        this.classList.add("flipped");
        flippedCards.push(this);
        flipSound.play();
    }

    if (flippedCards.length === 2) {
        attempts++;
        attemptsDisplay.textContent = attempts;
        setTimeout(checkMatch, 500);
    }
}

// Check match function
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === symbols.length) {
            clearInterval(interval);
            winSound.play();
            popupOverlay.style.display = "flex";
        }
    } else {
        wrongSound.play();
        setTimeout(() => {
            card1.textContent = "";
            card2.textContent = "";
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
        }, 500);
    }
}

// Change difficulty
difficultySelect.addEventListener("change", () => {
    const difficulty = difficultySelect.value;
    if (difficulty === "easy") gridSize = 4;
    else if (difficulty === "medium") gridSize = 6;
    else gridSize = 8;
    symbols = themes[themeSelect.value].slice(0, (gridSize * gridSize) / 2);
    cards = [...symbols, ...symbols];
    startGame();
});

// Change theme
themeSelect.addEventListener("change", () => {
    symbols = themes[themeSelect.value].slice(0, (gridSize * gridSize) / 2);
    cards = [...symbols, ...symbols];
    startGame();
});

// Reset game
resetButton.addEventListener("click", startGame);
closePopup.addEventListener("click", () => {
    popupOverlay.style.display = "none";
    startGame();
});

// Initialize game
startGame();
