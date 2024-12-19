const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);

var debReady=false;
var debImage=new Image();

debImage.onload=function(){
	debReady=true;
};
debImage.src="imgs/deb.png";

var ponReady=false;
var ponImage= new Image();

ponImage.onload=function(){
    ponReady=true;
}
ponImage.src="imgs/Pon.png";

const player = {
    x: canvas.width / 2,
    y: canvas.height - 205,
    width: 76,
    height: 205,
    speed: 10,
    dx: 0
};

const coins = [];
const coinWidth =64;
const coinHeight = 36;
// const coinSize = 20;
const coinSpeed = 5;
let score = 0;
let gameInterval;
let countdownInterval;
let timeLeft = 30;

function drawPlayer() {
    ctx.drawImage(debImage,player.x, player.y, player.width, player.height);
}

function drawCoins() {
    coins.forEach(coin => {
        ctx.drawImage(ponImage, coin.x, coin.y, coinWidth, coinHeight);
    });
    // ctx.fillStyle = 'gold';
    // coins.forEach(coin => {
    //     ctx.beginPath();
    //     ctx.arc(coin.x, coin.y, coinSize, 0, Math.PI * 2);
    //     ctx.fill();
    // });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newCoin() {
    const x = Math.random() * (canvas.width - coinWidth);
    coins.push({ x, y: 0 });
}

function updateCoins() {
    coins.forEach(coin => {
        coin.y += coinSpeed;
    });

    coins.forEach((coin, index) => {
        if (coin.y > canvas.height) {
            coins.splice(index, 1);
        }
    });
}

function checkCollision() {
    coins.forEach((coin, index) => {
        if (
            coin.x < player.x + player.width &&
            coin.x + coinWidth > player.x &&
            coin.y < player.y + player.height &&
            coin.y + coinHeight > player.y
        ) {
            coins.splice(index, 1);
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        }
    });
}

function update() {
    clear();
    drawPlayer();
    drawCoins();
    updateCoins();
    checkCollision();

    player.x += player.dx;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    requestAnimationFrame(update);
}

function moveLeft() { player.dx = -player.speed; }
function moveRight() { player.dx = player.speed; }
function stopMove() { player.dx = 0; }

function startGame() {
    score = 0;
    timeLeft = 30;
    coins.length = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    startButton.style.display = 'none';
    gameInterval = setInterval(newCoin, 1000);
    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            clearInterval(countdownInterval);
            startButton.style.display = 'block';
            alert(`Game Over! Your score is ${score}`);
        }
    }, 1000);
    update();
}

startButton.addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft();
    if (e.key === 'ArrowRight') moveRight();
});

window.addEventListener('keyup', stopMove);
