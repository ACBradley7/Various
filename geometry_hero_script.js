let Hero;
let boolean=0;
let theta = 0;

function abilities() {
    
}

function slash() {
    
}

function setup() {
    let backdrop = createCanvas(1200,700);
    backdrop.position(180,10);
    Hero = new hero();
    slash = new ability();
    slashShadow = new abilityShadow();
    barrier = new barrier;
}

function draw() {
    background(140,140,140);
    barrier.display();
    slashShadow.animate(theta);
    slash.animate(theta);
    Hero.display();
    Hero.move();
    barrier.impassable(Hero);
    Hero.obtainAbility(slash,slashShadow);
    
    theta += 0.1;
}

class hero {
    constructor() {
        strokeWeight(2);
        this.x = 200;
        this.y = 350;
        this.diameter = 32;
        this.speed = 3;
        this.abilityList = [];
        this.keyRing = [];
    }
    
    display() {
        fill(255,255,255);
        circle(this.x,this.y,this.diameter);
    }
    
    move() {
        let w = 87;
        let s = 83;
        let a = 65;
        let d = 68;

        if (keyIsDown(w)) {
             this.y -= this.speed;
         }

        if (keyIsDown(s)) {
             this.y += this.speed;
         }

        if (keyIsDown(a)) {
             this.x -= this.speed;
         }

        if (keyIsDown(d)) {
             this.x += this.speed;
         }
        
    }
    
    obtainAbility(obj,objShadow) {
        if (dist(this.x,this.y,obj.x,obj.y) <= (obj.diameter/2) + (this.diameter/2) - 1) {
            this.abilityList.push(obj.name);
            obj.y = -200;     //Replace with pop
            objShadow.y = -200;  //Replace with pop
            slash.obtained=true;
        }
    }
}

class ability {
    constructor() {
        this.name = "Slash";
        this.x = 900;
        this.y = 200;
        this.diameter = 16;
        this.obtained = false;
    }
    
    animate(theta) {
        fill(80,160,220);
        circle(this.x,this.y,this.diameter);
        
        this.y = this.y - sin(theta);
    }
}

class abilityShadow {
    constructor() {
        let abilityRadius = 8;
        this.x=900;
        this.y=200 + sin(1.5708) + abilityRadius;
        this.height=0;
        this.length=0;
    }
    
    animate(theta) {
        fill(50,50,50);
        stroke(50,50,50);
        ellipse(this.x,this.y,this.length,this.height);
        
        this.length = this.length + sin(theta);
        this.height = (this.height + sin(theta)) / 2;
    }
}

class barrier {
    constructor() {
        this.height=1200;
        this.width=15;
        this.x=0;
        this.y=0;
    }
    
    display() {
        fill(50,50,50);
        rect(this.x,this.y,this.width,this.height);
    }
    
    impassable(obj) {
        if (dist(this.x,this.y,obj.x,obj.y) <= (obj.diameter/2 + this.width)) {
            obj.x = this.x+this.x+obj.diameter;
            }
    }
}