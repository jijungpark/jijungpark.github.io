// state
var state = "start";

// transformer
var transformer;
var angle = 0;
var angleSpeed = 0.5;
var pauseRotation = false;
var hookDown = false;
var lineX = 0;
var lineY = 0;

var trashImg = [];
var fishImg = [];

var trashX = [];
var trashY = [];
var trash = [];
var fish = [];

var trashArray;
var mask = 0;

var home;
var dory;
var bubble;
var rip;
var board;

var hit = 10;
var misses = 3;
var time = 0;
var drag = false;

var rx = 255;
var myfont;

var mStart;
var mPlay;
var mWin;
var mLose;
var mHook;
var mTrash;
var mWrong;

function preload() {
    bg = loadImage("images/background.png");
    hook = loadImage("images/hook.png");
    winbg = loadImage("images/endbackground1.jpg")
    bg2 = loadImage("images/pollution.jpg");
    bubble = loadImage("images/bubble.png");
    rip = loadImage("images/rip.png");
    board = loadImage("images/board.png");
    myfont = loadFont("BubblegumSans-Regular.otf")

    // fish
    for (var i = 1; i <= 6; i++) {
        fishImg.push(loadImage("images/fish" + i + ".png"));
    }
    dory = loadImage("images/dory.png");

    // buttons
    yes = loadImage("images/yes.png");
    home = loadImage("images/goback.png");

    // trash
    for (var i = 1; i < 11; i++) {
        trashImg.push(loadImage("images/t" + i + ".png"));
    }

    mStart = loadSound("sound/start.mp3");
    mPlay = loadSound("sound/play.mp3");
    mWin = loadSound("sound/win.mp3");
    mLose = loadSound("sound/lose.mp3");
    mHook = loadSound("sound/hook.mp3");
    mTrash = loadSound("sound/trash.mp3");
    mWrong = loadSound("sound/wrong.mp3");

}

function initGame() {
    fish = [];
    for (var i = 0; i < fishImg.length; i++) {
        var f;
        if (i < 3) {
            f = new Fish(random(-250, -50),random(180, 450),fishImg[i],random(2, 4),"left");
        } else {
            f = new Fish(random(900, 1200),random(180, 450),fishImg[i],random(2, 4),"right");
        }
        fish.push(f);
    }

    //constract trashes in random position
    trash = [];
    for (var i = 0; i < trashImg.length; i++) {
        var redoRandom = true;
        var t = null;
        // Check collision with all existing trashes, and re-find a place for it if there is collision
        while (redoRandom) {
            redoRandom = false;
            t = new Trash(random(100, 700),random(180, 480),trashImg[i]);
            for (var j = 0; j < i; j++) {
                var trashj = trash[j];
                var d = dist(trashj.x, trashj.y, t.x, t.y);
                if (d < 50) {
                    redoRandom = true;
                }
            }
        }
        trash.push(t);
    }

    noiseDetail(24);

    trashArray = [];

    for (var i = 0; i < 300; i++) {
        var x = Math.floor(random(0, 10));
        var tempTrash = new NoiseTrash(400,300,trashImg[x]);
        trashArray.push(tempTrash);
    }

    time = millis() + 61 * 1000;
    hit = 10;
    misses = 3;
    lineX = 0;
    lineY = 0;
    hookDown = false;
    pauseRotation = false;
    angle = 0;
    mask = 0;
}

function setup() {
    canvas = createCanvas(800, 600);
    canvas.parent("sketchHolder");

    // create new transformer manager to keep track of points during rotation
    tf = new Transformer();

    rx = width / 2;

    textFont(myfont);

    if(state == "start"){
        mStart.loop();
    }
    else if(state == "play"){
        mStart.pause();
        mPlay.loop();
    }
    else if(state == "win"){
        mWin.loop();
    }
    else if(state == "lose"){
        mLose.loop();
    }
  
 



}

function draw() {
    if (state == "start") {
        gameStart();
 

    } else if (state == "play") {
        gamePlay();

    } else if (state == "win") {
        gameWin();

    } else if (state == "lose") {
        gameLose();

    }
}

function gameStart() {
    background(bg2);

    fill(0,0,0,120);
    var r = rect(rx, 0, 800, 600);
    fill(255);
    textSize(25);
    text("Ready to", 550, 250);
    textSize(30);
    text("SAVE THE OCEAN?", 480, 300);
    image(yes, 580, 350, 60, 60);


    if (dist(mouseX, mouseY, 620, 390) < 30) {
        rx = rx + 10;
        if(rx >= width){
            rx = width;
        }
    } else if (rx >= width / 2){
        rx = rx - 10;
    }
}

function gamePlay() {

    var timer = Math.floor((time - millis()) / 1000);
    background(bg);

    image(board, 650, 20);
    textSize(12);
    fill(255);
    text("Trash Left: " + hit, 680, 50);
    text("Life: " + misses, 680, 70);
    text("Time Left: " + timer, 680, 90);
    if (timer <= 0) {
        state = "lose";
        mPlay.pause();
        mLose.loop();

    }
    textSize(30);
    fill(50);
    text("Press the 'SPACE' key to clean the trash!", 180, 580);

    // translate and rotate
    tf.push();
    tf.translate(400, 0);
    tf.rotate(radians(angle));
    strokeWeight(3);
    line(0, 0, lineX, lineY + 30);

    image(hook, lineX - 26, lineY + 30, 30, 50);

    tf.translate(lineX - 15, lineY + 80);
    //ellipse(0,0,10,10);
    //text ("Line is at: " + round(tf.x, 2) + ", " + round(tf.y, 2) + " in screen coords", 50, 50);

    var hookX = tf.x;
    var hookY = tf.y;
    tf.pop();

    if (pauseRotation == false && hookDown == false) {
        angle = angle + angleSpeed;

        if (angle > 50 || angle < -50) {
            angleSpeed *= -1;
        }
    }
    if (pauseRotation == true && hookDown == true) {
        lineY += 4;


        if (hookY > height || hookX > width || hookX < 0) {
            hookDown = false;
        }

    }
    if (pauseRotation == true && hookDown == false) {

        lineY -= 9;
        if (lineY <= 30) {
            lineY = 30;
            pauseRotation = false;
        }
    }

    for (var i = 0; i < fish.length; i++) {
        fish[i].move();
    }

    //text(hookX + ", " + hookY, 50, 50);

    var hitFish = false;
    for (var i = 0; i < fish.length; i++) {
        if (fish[i].checkCollision(hookX, hookY)) {
            hitFish = true;
        }
    }
    if (hitFish && hookDown) {
        misses -= 1;
        mWrong.play();
        hookDown = false;
        if (misses <= 0) {
            state = "lose";
            time = 0;
            mPlay.pause();
            mLose.loop();
        }
    }

    var hitTrash = false;
    var collided = -1;
    for (var i = 0; i < trash.length; i++) {
        if (trash[i].checkCollision(hookX, hookY)) {
            hitTrash = true;
            collided = i;
        }
    }
    if (hitTrash) {
        hit -= 1;
        mTrash.play();
        hookDown = false;
        if (hookY <= 35) {
            trash[collided].on = false;
        }
        if (hit <= 0) {
            state = "win";
            time = 0;
            mPlay.pause();
            mWin.loop();
        }
    }

    // move the hooked trash
    for (var i = 0; i < trash.length; i++) {
        if (trash[i].hooked) {
            trash[i].x = hookX - 30;
            trash[i].y = hookY;
            if (pauseRotation == false) {
                trash[i].on = false;
                trash[i].fade = true;
            }
        }
    }

    // display trash
    for (var i = 0; i < trash.length; i++) {
        trash[i].display();
        //trash[i].jitter();
    }
    // display fishes
    for (var i = 0; i < fish.length; i++) {
        fish[i].display();
    }

    image(home, 20, 20);

    //cheat mode for presentation
    // fill(255,0,0);
    // ellipse(750,570,25,25);
    // fill(0,255,0);
    // ellipse(720,570,25,25);


}

function gameWin() {
    background(winbg);


    image(dory, 20, 50);

    image(bubble, 400, 50);

    fill(0);
    textSize(28);
    text("You just saved the ocean!", 430, 200);

    image(home, 20, 20);

}

function gameLose() {
    background(bg);



    for (var i = 0; i < trashArray.length; i++) {
        trashArray[i].move();
        trashArray[i].display();

    }

    if (mask < 255) {
        fill(0, 0, 0, mask);
        mask += 1;
        rect(0, 0, 800, 600);
    }
    if (mask >= 255) {
        fill(0);
        rect(0, 0, 800, 600);
        image(rip, 40, 90);
        fill(255);
        textSize(40)
        text("YOU LOSE!", 480, height / 2);

        textSize(15)
        text("Try to save our ocean again", 480, 350);
        text("by clicking the GO BACK button above!", 480, 380);

        image(home, 20, 20);

    }
}

function keyPressed() {
    if(keyCode == 32){
        pauseRotation = true;
        hookDown = true;
        mHook.play();
    }
}
window.onkeydown = function(e) { 
    return !(e.keyCode == 32);
};



function mousePressed() {
    if (state == "start") {
        var d = dist(mouseX, mouseY, 580, 350);
        if (d < 60) {
            state = "play";
            mStart.pause();
            mPlay.loop();
            initGame();
        }
    }
    if (state == "play" || state == "win" || state == "lose") {
        var d = dist(mouseX, mouseY, 70, 70);
        if (d < 50) {
            state = "start";
            rx = width / 2;
            mPlay.pause();
            mLose.pause();
            mWin.pause();
            mStart.loop();
        }


        //cheat mode for presentation
        // var a = dist(mouseX, mouseY, 720, 570);
        // if(a<12){
        //     state = "win"
        //     mPlay.pause();
        //     mWin.loop();
        // }
        // var b = dist(mouseX, mouseY, 750, 570);
        // if(b<12){
        //     state = "lose"
        //     mPlay.pause();
        //     mLose.loop();
        // }

    }
}

class Fish {

    constructor(startX, startY, startGraphic, startSpeed, head) {
        this.x = startX;
        this.y = startY;
        this.graphic = startGraphic;
        this.speed = startSpeed;
        this.head = head;
    }

    display() {
        image(this.graphic, this.x, this.y);
    }

    move() {
        if (this.head == "left") {
            this.moveleft();
        } else if (this.head == "right") {
            this.moveright();
        } else {
            alert("Wrong head direction: " + this.head);
        }
    }

    moveright() {
        this.x += this.speed;

        if (this.x > width) {
            this.x = random(-250, -50);
            this.y = random(180, 450);
        }
    }
    moveleft() {
        this.x -= this.speed;

        if (this.x < -80) {
            this.x = random(900, 1200);
            this.y = random(180, 450);
        }
    }

    checkCollision(hookX, hookY) {
        var d = dist(this.x + 25, this.y + 25, hookX, hookY);
        if (d < 30) {
            return true;
        } else {
            return false;
        }
    }

}

class Trash {
    constructor(startX, startY, startGraphic) {
        this.x = startX;
        this.y = startY;

        this.graphic = startGraphic;
        this.on = true;
        this.hooked = false;
        this.fade = false;
        this.tint = 255;

        this.xNoiseOffset = random(0, 1000);
        this.yNoiseOffset = random(1000, 2000);

    }

    checkCollision(hookX, hookY) {
        var x = dist(this.x + 25, this.y + 25, hookX + 10, hookY + 10);
        if (this.on == true && hookDown == true && x < 35) {

            //this.on = false;
            //this.x = lineX;
            //this.y = lineY;
            this.hooked = true;
            return true;

        } else if (this.on == true && hookDown == false) {
            return false;
        } else {
            return false;
        }

    }

    display() {
        if (this.on) {
            image(this.graphic, this.x, this.y)
        } else if (this.fade) {
            tint(255, this.tint);
            this.tint -= 10;
            if (this.tint <= 10) {
                this.fade = false;

            }
            image(this.graphic, this.x, this.y)
            noTint();
        }

    }

}

class NoiseTrash {
    constructor(x, y, startGraphic) {
        // store our position
        this.x = x;
        this.y = y;
        this.graphic = startGraphic;

        // create a "noise offset" to keep track of our position in Perlin Noise space
        this.xNoiseOffset = random(0, 1000);
        this.yNoiseOffset = random(1000, 2000);
    }

    // display mechanics
    display() {
        // console.log(this.graphic);
        image(this.graphic, this.x, this.y)
    }

    // movement mechanics
    move() {
        // compute how much we should move
        var xMovement = map(noise(this.xNoiseOffset), 0, 1, -3, 3);
        var yMovement = map(noise(this.yNoiseOffset), 0, 1, -3, 3);

        // update our position
        this.x += xMovement;
        this.y += yMovement;

        // constrain the walkers tot he screen
        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);

        // update our noise offset values
        this.xNoiseOffset += 0.01;
        this.yNoiseOffset += 0.01;
    }

}
