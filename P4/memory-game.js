let gameStarted = false;
let moves = 0;
let startTime;
let timerInterval;
let boardSize;
let cards = [];
let flippedCards = [];
let victoryMessage = document.getElementById('victory-message');

// Define your set of slot machine emojis
let emojis = ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓', '🍑', '🍈', '🍌', '🍐', '🍍', '🥥', '🥝', '🍅', '🍆', '🌽', '🥕', '🌶️', '🥒', '🥬'];

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('reset').addEventListener('click', resetGame);

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    moves = 0;
    document.getElementById('moves').textContent = '0 movimientos';
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    boardSize = document.getElementById('dimensions').value;
    generateBoard(boardSize);
}

function resetGame() {
    gameStarted = false;
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = 'tiempo: 0 sec';
    document.getElementById('board').innerHTML = '';
    victoryMessage.textContent = '';
    victoryMessage.classList.remove('visible');
}


function generateBoard(size) {
    const board = document.getElementById('board');
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    // Calcula el tamaño de las cartas
    const cardSize = Math.floor(board.clientWidth / size) - 10 + 'px';
    // Calcula el tamaño de la fuente de los emojis
    const emojiFontSize = Math.floor(board.clientWidth / size / 2) + 'px';
    let gameEmojis = emojis.slice(0, size * size / 2).concat(emojis.slice(0, size * size / 2)); // Duplica los primeros emojis de tamaño * tamaño / 2
    // Mezcla los emojis
    for (let i = gameEmojis.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameEmojis[i], gameEmojis[j]] = [gameEmojis[j], gameEmojis[i]];
    }
    for (let i = 0; i < size * size; i++) {
        const card = document.createElement('div');
        card.classList.add('card');
        // Aplica el tamaño a la carta
        card.style.width = cardSize;
        card.style.height = cardSize;
        const cardInner = document.createElement('div');
        card.style.setProperty('--card-index', i); 
        cardInner.classList.add('card-inner');
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        // Aplica el tamaño de la fuente al emoji
        cardBack.style.fontSize = emojiFontSize;
        cardBack.textContent = gameEmojis[i];
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        card.addEventListener('click', flipCard);
        board.appendChild(card);
        cards.push(card);
    }
}




function flipCard() {
    if (!gameStarted || this.classList.contains('flipped')) return;
    this.classList.add('flipped');
    flippedCards.push(this);
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = `${moves} movimientos`;
        if (flippedCards[0].textContent === flippedCards[1].textContent) {
            document.getElementById('acertar-sound').play();
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            flippedCards = [];
            checkGameEnd();
        } else {
            setTimeout(() => {
                document.getElementById('fallo-sound').play();
                flippedCards[0].classList.remove('flipped');
                flippedCards[1].classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
}


function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = `tiempo: ${elapsed} sec`;
}

function checkGameEnd() {
    if (document.querySelectorAll('.card:not(.matched)').length === 0) {
        gameStarted = false;
        clearInterval(timerInterval);
        victoryMessage.textContent = `¡Has ganado! Movimientos: ${moves}, ${document.getElementById('timer').textContent}`;
        document.getElementById('ganar-sound').play();
        victoryMessage.classList.add('visible');
    }
}
