/* eslint-env es6 */
/* eslint-disable */

var currentScreen = 0;
var totalScreens = 1;
var Hero;
var Gun;
var BluePortalBullet;
var YellowPortalBullet;
var typedFlag = 0;
var theta = 0;
var jumpTime = 0;
var initializeJump = false;
var gravityVal = 6;
var onPlatform = false;
var jumping = false;
var platsByScr = [];
var platsByScrDiem = [];
var creatures = [];
var platsMap = new Map();
var creaturesMap = new Map();

function setup() {
    var canvas = createCanvas(1400,600);
    Hero = new hero();
    Gun = new gun(Hero);
    setPlatformData();
    createPlatforms();
    // setCreatureData();
    // createCreatures();
}

function draw() {
    background(150,150,150);
    displayPlatforms();
    bulletsLogic();
    movementLogic(Hero,currentScreen);
    Gun.display(Hero,theta);
    Hero.display();
}

class hero {
    constructor() {
        this.x=400;
        this.y=500;
        this.diameter=30;
        this.speed=8;
    }
    
    display() {
        fill(200,150,100);
        circle(this.x,this.y,this.diameter);
    }
    
    jump() {
        let spacebar=32;
        
        console.log(keyCode);
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
        let s = 83;
        let a = 65;
        let d = 68;

        if (keyIsDown(s)) {
             this.y += this.speed/2;
         }

        if (keyIsDown(a)) {
             this.x -= this.speed * 0.75;
         }

        if (keyIsDown(d)) {
             this.x += this.speed * 0.75;
         }
    }
}

class gun {
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

class bullet {
    constructor(obj) {
        this.x=obj.x;
        this.y=obj.y;
        this.diameter=8;
        this.speed=18;
    }
    
    display(color) {
        push();
        if (color=="blue") {
            fill(70,250,205);
        } else if (color=="yellow") {
            fill(255,225,100);
        }
        circle(this.x,this.y,this.diameter);
        pop();
    }
    
    shot(obj) {
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

function bulletsLogic() {
    key=key.toUpperCase();

    if (key=="C") {
        key="";
        if (typedFlag == 0) {
            BluePortalBullet = new bullet(Hero);
            BluePortalBullet.shot(Gun);
            typedFlag=1;
        } else if (typedFlag == 1) {
            typedFlag = 0;
        }
    } else if (key=="V") {
        key="";
        if (typedFlag == 0) {
            YellowPortalBullet = new bullet(Hero);
            YellowPortalBullet.shot(Gun);
            typedFlag = 1;
        } else if (typedFlag == 1) {
            typedFlag = 0;
        }
    }
    
    if (BluePortalBullet) {
        BluePortalBullet.move();
        BluePortalBullet.display("blue");
    }
    
    if (YellowPortalBullet) {
        YellowPortalBullet.move();
        YellowPortalBullet.display("yellow");
    }
}

class platform {
    constructor(screenNum,platformNum) {
        screenNum.toString;
        platformNum.toString;
        
        this.x=platsMap.get("s"+screenNum+"p"+platformNum+".x");
        this.y=platsMap.get("s"+screenNum+"p"+platformNum+".y");
        this.width=platsMap.get("s"+screenNum+"p"+platformNum+".w");
        this.height=platsMap.get("s"+screenNum+"p"+platformNum+".h");
        
        this.x=parseInt(this.x);
        this.y=parseInt(this.y);
        this.width=parseInt(this.width);
        this.height=parseInt(this.height);
    }
    
    display() {
        rect(this.x,this.y,this.width,this.height);
    }
}

function setPlatformData() {
    function setPlatform(screenNum,platNum,xVar,yVar,wVar,hVar) {
        platsMap.set("s"+screenNum+"p"+platNum+".x",xVar);
        platsMap.set("s"+screenNum+"p"+platNum+".y",yVar);
        platsMap.set("s"+screenNum+"p"+platNum+".w",wVar);
        platsMap.set("s"+screenNum+"p"+platNum+".h",hVar);
    }
    
    // Screen 1

        // Platform 1
        setPlatform(1,1,0,500,width,25);

        // Platform 2
        setPlatform(1,2,250,250,120,15);

        // Platform 3
        setPlatform(1,3,500,400,80,15);

        // Platform 4
        setPlatform(1,4,730,200,150,15);

        // Platform 5
        setPlatform(1,5,1100,300,20,200);
    
        // Platform 6
        setPlatform(1,6,1250,400,80,10);
    
    // Screen 2
}

function createPlatforms() {
    for (let s=0;s < totalScreens;s++) {
        platsByScr[s] = []
        
        for (let i=0;i < platsMap.size/4; i++) {
            platsByScr[s].push(new platform(s+1,i+1));
            platsByScrDiem[s] = i;
        }
    }
}

function displayPlatforms() {
    for (let s=0;s < totalScreens;s++) {
        for (let i=0;i < platsByScr[s].length;i++) {
            push();
            noStroke();
            fill(50,50,50);
            platsByScr[s][i].display();
            pop();
        }
    }
    
}

function movementLogic(entity,scrNum) {
    var entdir;
    
    entity.move();
    if (onPlatform || jumping) {
        entity.jump();
        onPlatform = false;
        typedFlag = 0;
    }
    gravity(entity);
    entDir = stoppedByPlatform(entity,scrNum);
    
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

function stoppedByPlatform(entity,scrNum) {
    for (let i=0;i<=5;i++) {//i<=platsByScrDiem[scrNum];i++) {
        let platform=platsByScr[scrNum][i];
        
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