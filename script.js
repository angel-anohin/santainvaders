let tileSize = 32;
let columns = 16;
let rows = 16;

let ctx;

let isGameOver = false;
let isWin = false;

//board
let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;

//frame
//let frameWidth = boardWidth + 40;
//let frameHeight = boardHeight + 40;
//let frameX = 0;
//let frameY = 0;
//let frameImg;

//let frame = {
//    width : frameWidth,
//    height : frameHeight,
//    x : frameX,
//    y : frameY,
//    img : frameImg
//}


//ship
let shipWidth = tileSize * 4;
let shipHeight = tileSize * 4;
let shipX = tileSize * columns / 2 - 55;
let shipY = tileSize * rows - tileSize * 4; 
let shipVelocity = 10;
let shipImg;



let ship = {
    width : shipWidth,
    height : shipHeight,
    x : shipX,
    y : shipY,
    img : shipImg
}

//bullet
let bulletArray = [];
let bulletVelocity = -10;
let bulletImg;

//enemyBullet
let enemyBulletArray = [];
let enemyBulletVelocity = 5;
let enemyBulletImg;

//enemies
let enemyArray = [];
let enemyX = tileSize;
let enemyY = tileSize;
let enemyWidth = tileSize * 2;
let enemyHeight = tileSize * 2;
let enemyVelocity = 1;

let enemyCols = 4;

let enemyImg;
let enemyCount;

let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    ctx = board.getContext("2d");

    //frameImg = new Image();
    //frameImg.src = "./frame.png.png"

    shipImg = new Image();
    shipImg.src = "./santa.png"

    bulletImg = new Image();
    bulletImg.src = "./present.png"

    ctx.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    enemyImg = new Image();
    enemyImg.src = "./enemy.png"

    enemyBulletImg = new Image();
    enemyBulletImg.src = "./bullet.png"
    createEnemy();

    requestAnimationFrame(update);
    document.addEventListener("keydown", move);
    document.addEventListener("keyup", shoot);
    
}

function update () {
    gameOverScreen();
    if (!isGameOver) {
    requestAnimationFrame(update);
    ctx.clearRect(0, 0, boardWidth, boardHeight);

    ctx.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    //ctx.drawImage(frameImg, frame.x, frame.y, frame.width, frame.height);

    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocity;
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);

        for (let j = 0; j < enemyArray.length; j++) {
            let enemy = enemyArray[j];
            if (!bullet.used && enemy.alive && colisionDetect(bullet, enemy)) {
            bullet.used = true;
            enemy.alive = false;
            enemyCount--;
            score += 10;
            if (enemyCount <= 0) {
                isWin = true;
                isGameOver = true;
            }
            }
        }
    }

    for (let i = 0; i < enemyBulletArray.length; i++) {
        let enemyBullet = enemyBulletArray[i];
        enemyBullet.y += enemyBulletVelocity;
        ctx.drawImage(enemyBulletImg, enemyBullet.x, enemyBullet.y, enemyBullet.width, enemyBullet.height);
        if (!enemyBullet.used && colisionDetect(enemyBullet, ship)) {
            enemyBullet.used = true;
            isWin = false;
            isGameOver = true;
        }
    }

    for (let i = 0; i <enemyArray.length; i++) {
        let enemy = enemyArray[i]
        if (enemy.alive) {
            enemy.x += enemyVelocity;
            if (enemy.x <= 0 || enemy.x + enemyWidth >= boardWidth) {
                enemyVelocity *= -1;
                for (let j = 0; j < enemyArray.length; j++) {
                    enemyArray[j].y += tileSize;
                }
            }
            ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

            if (Math.random() < 0.005) {
                createEnemyBullet(enemy);
            }
        }
    }
    
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift();
    }

    ctx.fillStyle = "white";
    ctx.font = ("20px fantasy");
    ctx.fillText(score, 5, 20);
}
}

function move(e) {
    if (e.code == "ArrowLeft" && ship.x - shipVelocity >= 0) {
        ship.x -= shipVelocity;
    }
    
    if (e.code == "ArrowRight" && ship.x + shipVelocity <= board.width - ship.width) {
        ship.x += shipVelocity;
    }
}

function shoot(e) {
    if (e.code == "Space") {
        let bullet = {
            x : ship.x + shipWidth*15/32 - 22,
            y : ship.y,
            width : tileSize,
            height : tileSize,
            img : bulletImg,
            used : false
        }
        bulletArray.push(bullet);
    }
}


function createEnemy() {
    for (let c = 0; c < enemyCols; c++) {
        let enemy = {
            x : enemyX + c*enemyWidth,
            y : enemyHeight,
            width : enemyWidth,
            height : enemyHeight,
            img : enemyImg,
            alive : true
        }
        enemyArray.push(enemy);
    }
    enemyCount = enemyArray.length;
}

function createEnemyBullet(enemy) {
    let enemyBullet = {
        x : enemy.x + enemy.width / 2 - tileSize / 2,
        y : enemy.y + enemy.height,
        width : tileSize,
        height : tileSize * 2,
        img : enemyBulletImg,
        used : false
    }
    enemyBulletArray.push(enemyBullet);
}

function colisionDetect(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function checkGameOver() {
    if (isGameOver) {
        return;
    }
}

function gameOverScreen() {
    if (isGameOver) {
        let text = isWin ? "YOU WIN!" : "GAME OVER!"
        ctx.fillStyle = "white";
        ctx.font = "100px Helvetica Neue";
        ctx.fillText(text, board.width / 2 - 100, board.height / 2, 200);
    }
}
