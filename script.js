const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 50;
const paddleHeight = 5;

let leftArrowPressed = false;
let rightArrowPressed = false;

window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("click", init);

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomSign(num) {
    if (randomIntFromInterval(0, 1) == 0) {
        return num;
    } else {
        return -num;
    }
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: randomSign(2),
    speedY: -2,
};

const user = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: canvas.height - 20 - paddleHeight,
    width: paddleWidth,
    height: paddleHeight,
    speed: 5,
    score: 0,
};

const comp = {
    x: canvas.width / 2 - paddleWidth / 2,
    y: 20,
    width: paddleWidth,
    height: paddleHeight,
    speed: 5,
    score: 0,
};

let interval;

function keyDownHandler(a) {
    if (a.key == "Right" || a.key == "ArrowRight") {
        rightArrowPressed = true;
    } else if (a.key == "Left" || a.key == "ArrowLeft") {
        leftArrowPressed = true;
    }
}

function keyUpHandler(a) {
    if (a.key == "Right" || a.key == "ArrowRight") {
        rightArrowPressed = false;
    } else if (a.key == "Left" || a.key == "ArrowLeft") {
        leftArrowPressed = false;
    }
}

function drawScore() {
    ctx.beginPath();
    ctx.fillStyle = '#bbb';
    ctx.font = '35px sans-serif';
    ctx.fillText(user.score, canvas.width / 6, 3 * canvas.height / 4);
    ctx.fillText(comp.score, canvas.width / 6, canvas.height / 4);
    ctx.closePath();
}

function drawNet() {
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.strokeStyle = "#bbb";
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.closePath();
}

function stepBall() {
    if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
        ball.speedX = -ball.speedX;
    }
    if (ball.y - ball.radius < comp.y + comp.height) {
        if (ball.x - ball.radius < comp.x + comp.width && ball.x + ball.radius > comp.x) {
            ball.speedY = -ball.speedY;
        } else {
            clearInterval(interval);
            user.score += 1;
        }
    }
    if (ball.y + ball.radius > user.y) {
        if (ball.x - ball.radius < user.x + user.width && ball.x + ball.radius > user.x) {
            ball.speedY = -ball.speedY;
        } else {
            clearInterval(interval);
            comp.score += 1;
        }
    }
    ball.x += ball.speedX;
    ball.y += ball.speedY;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}

function stepComp() {
    let distance = ball.x - (comp.x + comp.width / 2);
    if (ball.x >= comp.width / 2 && canvas.width - ball.x >= comp.width / 2) {
        if (Math.abs(distance) > comp.speed) {
            comp.x += Math.sign(distance) * comp.speed;
        } else {
            comp.x += distance;
        }
    }
}

function drawComp() {
    ctx.beginPath();
    ctx.rect(comp.x, comp.y, comp.width, comp.height);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}

function stepUser() {
    if (leftArrowPressed && user.x - user.speed >= 0) {
        user.x += -user.speed;
    }
    if (rightArrowPressed && user.x + user.width + user.speed <= canvas.width) {
        user.x += user.speed;
    }
}

function drawUser() {
    ctx.beginPath();
    ctx.rect(user.x, user.y, user.width, user.height);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();
}

function render() {
    stepBall();
    stepComp();
    stepUser();
    draw();
}

function reset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.radius = 10;
    ball.speedX = randomSign(2);
    ball.speedY = -2;
    user.x = canvas.width / 2 - paddleWidth / 2;
    user.y = canvas.height - 20 - paddleHeight;
    user.width = paddleWidth;
    user.height = paddleHeight;
    user.speed = 5;
    comp.x = canvas.width / 2 - paddleWidth / 2;
    comp.y = 20;
    comp.width = paddleWidth;
    comp.height = paddleHeight;
    comp.speed = 5;
}

function init() {
    clearInterval(interval);
    reset();
    interval = setInterval(render, 15);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawNet();
    drawBall();
    drawComp();
    drawUser();
}

draw();