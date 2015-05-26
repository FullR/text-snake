var _ = require("lodash");
var keypress = require("keypress");
var exec = require("child_process").execSync;
var Snake = require("./snake");
var Food = require("./food");
var TextCanvas = require("./text-canvas");

var rows = process.stdout.rows - 1;
var columns = Math.floor(process.stdout.columns/2);
var foods;
var snake;
var score;
var then;
var gameLoop;

var theme = require("./themes/basic");

keypress(process.stdin);

function clear() {
    exec("clear");
}

function min(a, b) {
    return a < b ? a : b;
}

function spawnFood() {
    foods.push(new Food({
        position: [Math.floor(Math.random() * (columns - 2)) + 2, Math.floor(Math.random() * (rows - 2)) + 2]
    }));
}

function reset() {
    foods = [];
    score = 0;
    then = Date.now();
    spawnFood();
    snake = new Snake({
        segments: [
            [Math.floor(columns/2), Math.floor(rows/2)]
        ]
    }).grow();
    clearInterval(gameLoop);
    gameLoop = setInterval(draw, 1000/15);
}

function draw() {
    var eaten;
    var canvas;

    clear();
    canvas = new TextCanvas(columns, rows, 2, 1);
    snake.step(columns, rows);

    if(!snake.isInside(1, 1, columns - 2, rows - 2) || snake.isSelfColliding()) {
        reset();
        return;
    }
    
    eaten = foods.filter(snake.isEating.bind(snake));
    eaten.forEach(function(eatenFood) {
        score++;
        snake.grow();
    });
    
    if(eaten.length) {
        foods = foods.filter(function(food) {
            return eaten.indexOf(food) === -1;
        });
    }
    eaten.forEach(spawnFood);

    foods.forEach(function(food) {
        food.draw(canvas);
    });
    snake.draw(canvas);
    for(var i = 0; i < canvas.width; i++) {
        canvas.drawTile(i, 0, [
            theme.wall
        ]);
        canvas.drawTile(i, canvas.height-1, [
            theme.wall
        ]);
    }

    for(var j = 0; j < canvas.height; j++) {
        canvas.drawTile(0, j, [
            theme.wall
        ]);
        canvas.drawTile(canvas.width-1, j, [
            theme.wall
        ]);
    }
    canvas.drawRaw(5, 0, " Score: " + score + " ");
    console.log(canvas.toString());
}

process.stdin.on("keypress", function (ch, key) {
    if(key.name === "q" || key.ctrl && key.name === "c") {
        console.log("Bye!");
        process.exit(0);
    }

    if(!snake.readyForInput) return;
    if(key.name === "up") {
        snake.setDirection("up");
    } else if(key.name === "down") {
        snake.setDirection("down");
    } else if(key.name === "right") {
        snake.setDirection("right");
    } else if(key.name === "left") {
        snake.setDirection("left");
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();

reset();