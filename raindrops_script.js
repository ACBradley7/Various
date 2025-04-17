let rainDrops = [];
let counter = 1;
let check = 20;

function setup() {
    createCanvas(1200,600);
}

function addDrop(counter) {
    let amount = random(1,4);
    if (counter % check == 0) {
        for (let i=0;i<amount;i++) {
            rainDrops.push(new rainDrop());
        }
        let check = random(70,150);
    }
}

function draw() {
    background(150,150,150);
    
    for (let i=0;i<rainDrops.length;i++) {
        rainDrops[i].remove(i);
        rainDrops[i].display();
        rainDrops[i].move();
    }
    
    addDrop(counter);
    counter++;
    console.log(36%6);
}

class rainDrop {
    constructor() {
        this.width = random(8,26);
        this.length = this.width+12;
        this.x = random(0+this.width,width-this.width);
        this.y = (0-50-this.length);
        this.speed = random(1,3);
    }

    move() {
        this.y=(this.y+this.speed)
        this.x=random(this.x-1,this.x+1);
    }

    display() {
        ellipse(this.x,this.y,this.width,this.length);
        fill(60,90,180);
        noStroke();
    }
    
    remove(position) {
        if (this.y >= height + this.length) {
            rainDrops.splice(position,1);
        }
    }
}