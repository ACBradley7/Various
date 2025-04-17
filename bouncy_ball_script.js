var ball;
var floor;
var score = 0;

// Collosions
// Left/Right Ball Movement
// Make mousePressed() more strict (check the curvature of the ball)
// Leaderboard
// Controllable guy
// Ball Image
// Ball Animation
// Scable based on screen size

function setup() {
    canvas = createCanvas(1000, 600);
    
    ball = new Ball();
    floor = new Floor();
}

function scoreUpdate(ball, floor) {
    const canvas = document.getElementById("defaultCanvas0");
    ctx = canvas.getContext("2d");
    
    ctx.font = "40px Arial";
    ctx.fillText("Score: " + score, 0 + width / 16, 0 + height / 8);
    
    if (ball.y + ball.size / 2 >= floor.y) {
        score = 0;
    }
}

function mousePressed() {
    if (mouseX > ball.x - ball.size / 2 && mouseX < ball.x + ball.size / 2 && mouseY > ball.y - ball.size / 2 && mouseY < ball.y + ball.size / 2) {
        ball.upVelocity = 6;
        
        score += 1;
        console.log(ball);
    }
}

function draw() {
    background(100);
    floor.display();
    ball.gravity(floor);
    ball.jump();
    ball.display();
    scoreUpdate(ball, floor);
}

class Ball {
    constructor() {
        this.x = width / 2;
        this.y = 100;
        this.size = 60;
        this.upVelocity = 0;
        this.gravitySpeed = 1 / 2;
    }
    
    display() {
        circle(this.x, this.y, this.size);
        fill(200, 200, 200);
    }
    
    jump() {
        if (this.upVelocity > 0) {
            this.y -= this.upVelocity;
            this.upVelocity -= 1 / 5;
            this.gravitySpeed = 1 / 2;
        }
    }
    
    gravity(floor) {
        if (this.y < floor.y - this.size / 2) {
            this.y += this.gravitySpeed;
            this.gravitySpeed += 1 / 5;
        } else if (this.y + this.size / 2 > floor.y) {
            this.y = floor.y - this.size / 2;
        } else {
            this.gravitySpeed = 1 / 2;
        }
    }
}

class Floor {
    constructor() {
        this.x = 0;
        this.y = height - (height / 8);
        this.width = width;
        this.height = 30;
    }
    
    display() {
        rect(this.x, this.y, this.width, this.height);
        fill(255);
    }
}

// MongoDB Password: mongodb+srv://acbradley7:#Baridi7!@drewbradleycluster.kn0en.mongodb.net/?retryWrites=true&w=majority&appName=DrewBradleyCluster