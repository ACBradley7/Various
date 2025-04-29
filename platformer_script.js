// Re-do jump function

var canvas;
var currentScreen = [0, 0];
var availScreens = [];
var hero;
var gun;
var BluePortalBullet;
var YellowPortalBullet;
var bulletsArr = [];
var theta = 0;
var jumpTime = 0;
var initializeJump = false;
var gravityVal = 6;
var onPlatform = false;
var jumping = false;
var creatures = [];
var creaturesMap = new Map();

function setup() {
    canvas = createCanvas(1400,600);
    hero = new Hero();
    gun = new Gun(Hero);
    GameWorld = new World();
    setPlatformData();
    // setCreatureData();
    // createCreatures();
}

function draw() {
    background(150,150,150);
    checkAvailScreens();
    displayPlatforms();
    bulletsLogic(hero);
    movementLogic(hero);
    gun.display(hero, theta);
    hero.display();
}

const BulletType = {
    BLUE: "BLUE",
    YELLOW: "YELLOW"
}

const EntityType = {
    HERO: "HERO"
}

const BoundsDir = {
    NORTH: "NORTH",
    SOUTH: "SOUTH",
    EAST: "EAST",
    WEST: "WEST",
    ANY: "ANY"
}

class Hero {
    constructor() {
        this.x=400;
        this.y=500;
        this.diameter=30;
        this.radius = this.diameter / 2;
        this.speed=8;
        this.entType = EntityType.HERO;
    }
    
    display() {
        fill(200,150,100);
        circle(this.x,this.y,this.diameter);
    }

    scrWrap() {
        var dir = offScreenCheck(this);
        var offset = this.radius;

        if (dir == BoundsDir.NORTH) {
            this.y = canvas.height - offset;
        } else if (dir == BoundsDir.SOUTH) {
            this.y = 0 + offset;
        } else if (dir == BoundsDir.EAST) {
            this.x = 0 + offset;
        } else if (dir == BoundsDir.WEST) {
            this.x = canvas.width - offset;
        }
    }
    
    jump() {
        let spacebar=32;
        
        if ((keyCode == spacebar) && (initializeJump == false) && (typedFlag == 0)) {
            keyCode = null;
            initializeJump = true;
            jumpTime = 0;
            typedFlag = 1;
            jumping = true;
        }
        
        if (initializeJump) {
            jumpTime += 1;
            var jumpFactor = gravityVal/(sqrt((jumpTime+5)*0.01));
            this.y -= jumpFactor;
            
            if (jumpTime == 20) {
                initializeJump = false;
                jumping = false;
            }
        }
        return jumping;
    }
    
    move() {
        let s = 83, a = 65, d = 68;

        if (keyIsDown(s) || keyIsDown(DOWN_ARROW)) {
             this.y += this.speed/2;
         }

        if (keyIsDown(a) || keyIsDown(LEFT_ARROW)) {
             this.x -= this.speed * 0.75;
         }

        if (keyIsDown(d) || keyIsDown(RIGHT_ARROW)) {
             this.x += this.speed * 0.75;
         }
    }
}

class Gun {
    constructor(obj) {
        this.width=10;
        this.length=26;
        this.radius=12;
        this.x=obj.x-(this.width/2);
        this.y=obj.y;
    }
    
    display(obj) {
        let theta=this.calculateTheta(obj);
        this.rotation(obj,theta);
        fill(0,0,0);
        rect(0-(this.width/2),0,this.width,this.length,this.radius);
        pop();
        //line(mouseX,obj.y,obj.x,obj.y);
        //line(mouseX,mouseY,obj.x,obj.y);
        //line(mouseX,mouseY,mouseX,obj.y);
    }
    
    rotation(obj,theta) {
        push();
        translate(obj.x,obj.y);
        rotate(3*PI/2);
        rotate(theta);
        this.modifyRotation(obj);
        this.cornerCases(obj,theta);
    }
    
    calculateTheta(obj) {
        let Q1=(mouseY<obj.y && mouseX>obj.x);
        let Q2=(mouseY<obj.y && mouseX<obj.x);
        let Q3=(mouseY>obj.y && mouseX<obj.x);
        let Q4=(mouseY>obj.y && mouseX>obj.x);
        
        let PointX=mouseX;
        let PointY=obj.y;
        
        let opp=dist(mouseX,mouseY,PointX,PointY);
        let adj=dist(obj.x,obj.y,PointX,PointY);
        let hypo=dist(obj.x,obj.y,mouseX,mouseY);
        
        if (Q1) {
            theta=acos(opp/hypo);
        } else if (Q2) {
            theta=asin(opp/hypo);
        } else if (Q3) {
            theta=acos(opp/hypo);
        } else if (Q4) {
            theta=asin(opp/hypo);
        }
        return theta;
    }
    
    modifyRotation(obj) {
        let Q1=(mouseY<obj.y && mouseX>obj.x);
        let Q2=(mouseY<obj.y && mouseX<obj.x);
        let Q3=(mouseY>obj.y && mouseX<obj.x);
        let Q4=(mouseY>obj.y && mouseX>obj.x);
    
        if (Q1) {
            rotate(3*PI/2);
        } else if (Q2) {
            rotate(PI);
        } else if (Q3) {
            rotate(PI/2);
        } else if (Q4) {
            // Do nothing
        }
    }
    
    cornerCases(obj,theta) {
        if (mouseX==obj.x && mouseY>obj.y && theta<1) {
            rotate(PI/2);
        } else if (mouseX==obj.x && mouseY<obj.y && theta>1) {
            rotate(PI);
        } else if (mouseX==obj.x && mouseY<obj.y && theta<1) {
            rotate(3*PI/2); 
        } else if (mouseY==obj.y && mouseX>obj.x && theta>1) {
            rotate(3*PI/2);
        } else if (mouseY==obj.y && mouseX<obj.x && theta>1) {
            rotate(PI/2);
        } else if (mouseY==obj.y && mouseX<obj.x && theta<1) {
            rotate(PI);
        }
    }
}

class Bullet {
    constructor(obj, type) {
        this.x=obj.x;
        this.y=obj.y;
        this.diameter=12;
        this.radius = this.diameter / 2;
        this.speed=18;
        this.casterType=obj.entType
        this.type=type;

        bulletsArr.push(this)
    }
    
    display() {
        push();
        if (this.type==BulletType.BLUE) {
            fill(70,250,205);
        } else if (this.type==BulletType.YELLOW) {
            fill(255,225,100);
        }
        circle(this.x,this.y,this.diameter);
        pop();
    }
    
    shot() {
        let p2X=mouseX;
        let p2Y=mouseY;
        
        let dir = Math.atan2(p2Y - this.y, p2X - this.x);
        let dx = Math.cos(dir) * this.speed;
        let dy = Math.sin(dir) * this.speed;
        
        this.dx=dx;
        this.dy=dy;
    }
    
    move() {
        this.x+=this.dx;
        this.y+=this.dy;
    }
}

function bulletsLogic(obj) {
    key=key.toUpperCase();

    // Bullet Creation
    if ((key=="C" && keyIsPressed) || (mouseButton == LEFT && mouseIsPressed)) {
        BluePortalBullet = new Bullet(obj, BulletType.BLUE);
        BluePortalBullet.shot();
    } else if ((key=="V" && keyIsPressed) || (mouseButton == RIGHT && mouseIsPressed)) {
        YellowPortalBullet = new Bullet(obj, BulletType.YELLOW);
        YellowPortalBullet.shot();
    }

    // Remove key = "" for a cool effect
    key = "";
    mouseButton = "";


    // Remove bullet if offscreen
    if (bulletsArr.length > 0) {
        for (i = 0; i < bulletsArr.length; i++) {
            bulletsArr[i].move();
            bulletsArr[i].display();
            
            if (bulletsArr[i].x - bulletsArr[i].radius < 0 || bulletsArr[i].x + bulletsArr[i].radius > canvas.width) {
                bulletsArr.splice(i, 1);
            } else if (bulletsArr[i].y - bulletsArr[i].radius < 0 || bulletsArr[i].y + bulletsArr[i].radius > canvas.height) {
                bulletsArr.splice(i, 1);
            }
        }
    }

    // Remove bullet if stopped by a platform
    if (bulletsArr.length > 0) {
        scr = currentScreen;

        for (i = 0; i < bulletsArr.length; i++) {
            for (j = 0; j < GameWorld.screens[scr].size; j++) {
                if (objPlatOverlap(bulletsArr[i], GameWorld.screens[scr].get(j))) {
                    bulletsArr.splice(i, 1);
                    break;
                }
            }
        }
    }
}

class World {
    constructor() {
        this.screens = {};
    }
}

class Screen {
    constructor(coords) {
        this.platforms = new Map();
        this.coords = coords;

        GameWorld.screens[this.coords] = this.platforms;
    }
}

class Platform {
    constructor(screen,x,y,width,height) {
        this.screen = screen.coords;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.platID = screen.platforms.size;

        screen.platforms.set(this.platID, this);
    }
    
    display() {
        rect(this.x,this.y,this.width,this.height);
    }
}

function setPlatformData() {
    // Screen [0, 0]
    screen = new Screen([0, 0]);

    // Platform 0
    new Platform(screen,0,500,width,25);

    // Platform 1
    new Platform(screen,250,250,30,30);

    // Platform 2
    new Platform(screen,500,400,80,50);
    
    // Screen [1, 0]
    screen = new Screen([1, 0]);

    // Platform 0
    new Platform(screen,0,500,width,25);

    // Platform 1
    new Platform(screen,250,250,120,15);

    // Platform 2
    new Platform(screen,500,400,80,15);

    // Platform 3
    new Platform(screen,730,200,150,15);

    // Platform 4
    new Platform(screen,1100,300,20,200);

    // Platform 5
    new Platform(screen,1250,400,80,10);

    // Screen [0, 1]
    screen = new Screen([0, 1]);

    // Platform 0
    new Platform(screen,250,250,80,20);
         
}

function displayPlatforms() {
    scr = currentScreen;

    for (let i = 0 ; i < GameWorld.screens[scr].size; i++) {
        push();
        noStroke();
        fill(50,50,50);
        GameWorld.screens[scr].get(i).display()
        pop();
    }
}

function objPlatOverlap(entity, platform) {
    // Directional Conditions
    let betweenYsConst=((entity.y > platform.y) && (entity.y < (platform.y+platform.height)));
    let betweenXsConst=((entity.x > platform.x) && (entity.x < (platform.x+platform.width)));
    let radius=entity.radius;
    
    let fromLeft=(((entity.x + radius) >= platform.x) && (entity.x <= (platform.x + radius))) && betweenYsConst;
    let fromRight=(((entity.x - radius) <= (platform.x + platform.width)) && (entity.x >= (platform.x + platform.width - radius))) && betweenYsConst;
    let fromAbove=((((entity.y + radius) > platform.y)) && (entity.y < (platform.y + radius))) && betweenXsConst;
    let fromBelow=((((entity.y - radius) < platform.y + platform.height)) && (entity.y > (platform.y + platform.height - radius))) && betweenXsConst;
    
    if (fromLeft) {
        return true;
    } else if (fromRight) {
        return true;
    } else if (fromAbove) {
        return true;
    } else if (fromBelow) {
        return true;
    }
    return false;
}

function objOverlap(objOne, objTwo) {
    if (objOne.x + objOne.radius > objTwo.x - objTwo.radius) {
        if (objOne.y - objOne.radius < objTwo.y + objTwo.radius) {
            return true;
        } else if (objOne.y + objOne.radius > objTwo.y - objTwo.radius) {
            return true;
        }
    } else if (objOne.x - objOne.radius < objTwo.x + objTwo.radius) {
        if (objOne.y - objOne.radius < objTwo.y + objTwo.radius) {
            return true;
        } else if (objOne.y + objOne.radius > objTwo.y - objTwo.radius) {
            return true;
        }
    }
    return false;
}

function whichScreen(obj) {
    dir = offScreenCheck(obj);

    if (dir == BoundsDir.WEST) {
        currentScreen[0] -= 1;
    } else if (dir == BoundsDir.EAST) {
        currentScreen[0] += 1;
    } else if (dir == BoundsDir.SOUTH) {
        currentScreen[1] -= 1;
    } else if (dir == BoundsDir.NORTH) {
        currentScreen[1] += 1;
    }
}

function offScreenCheck(obj) {
    if (obj.x - obj.radius < 0) {
        return BoundsDir.WEST;
    } else if (obj.x + obj.radius > canvas.width) {
        return BoundsDir.EAST;
    } else if (obj.y - obj.radius < 0) {
        return BoundsDir.NORTH;
    } else if (obj.y + obj.radius > canvas.height) {
        return BoundsDir.SOUTH;
    }
    return false;
}

function checkAvailScreens() {
    availScreens = [];

    if (GameWorld.screens[[currentScreen[0], currentScreen[1] + 1]] != null) {
        availScreens.push([currentScreen[0], currentScreen[1] + 1]);
    }
    if (GameWorld.screens[[currentScreen[0], currentScreen[1] - 1]] != null) {
        availScreens.push([currentScreen[0], currentScreen[1] - 1]);
    }
    if (GameWorld.screens[[currentScreen[0] + 1, currentScreen[1]]] != null) {
        availScreens.push([currentScreen[0] + 1, currentScreen[1]]);
    }
    if (GameWorld.screens[[currentScreen[0] - 1, currentScreen[1]]] != null) {
        availScreens.push([currentScreen[0] - 1, currentScreen[1]]);
    }
}

function movementLogic(entity) {
    var entdir;
    
    entity.move();
    whichScreen(entity);
    entity.scrWrap();

    if (onPlatform || jumping) {
        entity.jump();
        onPlatform = false;
        typedFlag = 0;
    }
    gravity(entity);
    entDir = stoppedByPlatform(entity);
    
    if (entDir) {
        if (entDir == "down") {
            onPlatform = true;
        } else if (entDir == "up") {
            jumping = false;
        }
    }
}

function gravity(entity) {
    entity.y += gravityVal;
}

function stoppedByPlatform(entity) {
    scr = currentScreen;

    for (i = 0; i < GameWorld.screens[scr].size; i++) {
        let platform = GameWorld.screens[scr].get(i);
        
        // Directional Conditions
        let betweenYsConst=((entity.y > platform.y) && (entity.y < (platform.y+platform.height)));
        let betweenXsConst=((entity.x > platform.x) && (entity.x < (platform.x+platform.width)));
        let radius=entity.diameter/2
        
        let fromLeft=(((entity.x + radius) >= platform.x) && (entity.x <= (platform.x + radius))) && betweenYsConst;
        let fromRight=(((entity.x - radius) <= (platform.x + platform.width)) && (entity.x >= (platform.x + platform.width - radius))) && betweenYsConst;
        let fromAbove=((((entity.y + radius) > platform.y)) && (entity.y < (platform.y + radius))) && betweenXsConst;
        let fromBelow=((((entity.y - radius) < platform.y + platform.height)) && (entity.y > (platform.y + platform.height - radius))) && betweenXsConst;
        
        
        // Set entity movement if overlapping with a platform
        if (fromLeft) {
            entity.x=platform.x-radius;
        } else if (fromRight) {
            entity.x=platform.x+platform.width+radius;
        } else if (fromAbove) {
            entity.y=platform.y-radius;
            entDir = "down";
            if (keyCode = 32) {keyCode=""};
        } else if (fromBelow) {
            entity.y=platform.y+platform.height+radius;
            entDir = "up";
        }
    }
    return entDir;
}

function setCreatureData() {

}

function createCreatures() {

}

function displayCreatures() {
    
}