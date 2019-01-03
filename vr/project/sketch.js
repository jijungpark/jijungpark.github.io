// variable to hold a reference to our A-Frame world
var world;
var touchIsPressed = false;
var container;

var mbs = [];
var ding;
var cx = 0;
var cy = 0;
var cz = 0;

var food = [];
var foodName = [];
var shoplist = [];


var leapController;
var hand1, hand2;

var checkedOut = false;


function preload() {
  ding = loadSound("images/ding.mp3");
}

function setup() {
    // no canvas needed
    noCanvas();

    // construct the A-Frame world
    // this function requires a reference to the ID of the 'a-scene' tag in our HTML document
    world = new World('VRScene');

    world.setUserPosition(0,25,50);

    leapController = new Leap.Controller({
        enableGestures: true
    });

    leapController.loop(handleHandData);

    container = new Container3D({x:0, y:1, z:-5});

    var cart = new OBJ({
        asset: 'cart_obj',
        mtl: 'cart_mtl',
        x:9,
        y:-5.5,
        z: 6.7,
        scaleX: 0,
        scaleY: 0,
        scaleZ: 0,
    });

    container.addChild( cart );

    var cartWater = new OBJ({
        asset: 'water_obj',
        mtl: 'water_mtl',
        x: 0,
        y: -2.5,
        z: 3.5,
        rotationX: 0,
        rotationY: 0,
        scaleX: 1,
        scaleY: 0.95,
        scaleZ: 1,
        visible: false,
    });

    container.addChild(cartWater );

    var cartBurger = new OBJ({
        asset: 'burger_obj',
        mtl: 'burger_mtl',
        x: -0.5,
        y: -2.5,
        z: 3,
        rotationX: 0,
        rotationY: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        scaleZ: 1.5,
        visible: false,
    });

    container.addChild( cartBurger);


    var cartPizza = new OBJ({
        asset: 'pizza_obj',
        mtl: 'pizza_mtl',
        x: 0.3,
        y: -1.85,
        z: 4.6,
        rotationX: 270,
        rotationY: 120,
        scaleX: 0.1,
        scaleY: 0.1,
        scaleZ: 0.1,
        visible: false,
    });
    
    container.addChild( cartPizza );

    var cartCoke = new OBJ({
        asset: 'coke_obj',
        mtl: 'coke_mtl',
        x: 0.3,
        y: -3,
        z: 1,
        rotationX: 0,
        rotationY: 0,
        scaleX: 0.9,
        scaleY: 0.9,
        scaleZ: 0.9,
        visible: false,
    });

    container.addChild( cartCoke );

    var cartCarrot = new OBJ({
        asset: 'carrot_obj',
        mtl: 'carrot_mtl',
        x: -0.4,
        y: -2.1,
        z: 4.1,
        rotationX: 45,
        rotationY: 270,
        scaleX: 0.2,
        scaleY: 0.2,
        scaleZ: 0.2,
        visible: false,
    });

    container.addChild( cartCarrot );



    // add the container to the user's HUD cursor
    world.camera.cursor.addChild(container);

    sign1 = new Plane({
        x:-32, y:36.5, z:10,
        width: 30,
        height: 4,
        red: 128,
        green: 0,
        blue: 0,

    });
    world.add(sign1);

    sign2 = new Plane({
        x:32, y:36.5, z:10,
        width: 30,
        height: 4,
        red: 128,
        green: 0,
        blue: 0,

    });
    world.add(sign2);

    // now hack into the textHolder variable and give it some text properties
    sign1.tag.setAttribute('text',
        'value: Fast Food; color: rgb(255,255,255); align: center; size: 20;');

    sign2.tag.setAttribute('text',
        'value: Fruits & Vegetables ; color: rgb(255,255,255); align: center; size: 20;');


    shelfL = new OBJ ({
        asset: 'shelf_obj',
        mtl: 'shelf_mtl',
        x: -95,
        y: 17,
        z: -20,
        rotationX: 0,
        rotationY: 90,
        scaleX: 18,
        scaleY: 18,
        scaleZ: 10,     
    });
    world.add(shelfL); 

    shelfR = new OBJ({
        asset: 'shelf_obj',
        mtl: 'shelf_mtl',
        x: 95,
        y: 17,
        z: -20,
        rotationX: 0,
        rotationY: 90,
        scaleX: 18,
        scaleY: 18,
        scaleZ: 10,
    });
    world.add(shelfR);          

    shelfB = new OBJ({
        asset: 'shelf_obj',
        mtl: 'shelf_mtl',
        x: 0,
        y: 17,
        z: -46,
        rotationX: 0,
        rotationY: 0,
        scaleX: 165,
        scaleY: 18,
        scaleZ: 10,
    });
    world.add(shelfB);    

    shelfLM = new OBJ({
        asset: 'shelf_obj',
        mtl: 'shelf_mtl',
        x: -35,
        y: 17,
        z: -20,
        rotationX: 0,
        rotationY: 90,
        scaleX: 38,
        scaleY: 18,
        scaleZ: 20,
    });
    world.add(shelfLM);   

    shelfRM = new OBJ({
        asset: 'shelf_obj',
        mtl: 'shelf_mtl',
        x: 35,
        y: 17,
        z: -20,
        rotationX: 0,
        rotationY: 90,
        scaleX: 38,
        scaleY: 18,
        scaleZ: 20,
    });
    world.add(shelfRM);  

    fries = new OBJ({
        asset: 'fries_obj',
        mtl: 'fries_mtl',
        x: -35,
        y: 22,
        z: 0,
        rotationX: 0,
        rotationY: 90,
        scaleX: 5,
        scaleY: 5,
        scaleZ: 5,
    });
    world.add(fries);
    food.push(fries);
    foodName.push('fries');

    // zzz shelf pizza
    pizza = new OBJ({
        asset: 'pizza_obj',
        mtl: 'pizza_mtl',
        x: -35,
        y: 26,
        z: -10,
        rotationX: 90,
        rotationY: 90,
        scaleX: 1.5,
        scaleY: 1.5,
        scaleZ: 1.5,
    });
    pizza.cartValue = cartPizza;
    world.add(pizza);
    food.push(pizza);
    foodName.push('pizza');

    burger = new OBJ({
        asset: 'burger_obj',
        mtl: 'burger_mtl',
        x: -35,
        y: 25,
        z: -20,
        rotationX: 0,
        rotationY: 0,
        scaleX: 11,
        scaleY: 11,
        scaleZ: 11,
    });
    burger.cartValue = cartBurger;
    world.add(burger);
    food.push(burger);
    foodName.push('burger');

    hotdog = new OBJ({
        asset: 'hotdog_obj',
        mtl: 'hotdog_mtl',
        x: -35,
        y: 24,
        z: -35,
        rotationX: 45,
        rotationY: 45,
        scaleX: 30,
        scaleY: 30,
        scaleZ: 30,
    });
    world.add(hotdog);
    food.push(hotdog);
    foodName.push('hotdog');

    donut = new OBJ({
        asset: 'donut_obj',
        mtl: 'donut_mtl',
        x: -35,
        y: 15.5,
        z: 0,
        rotationX: 90,
        rotationY: 90,
        scaleX: 2.3,
        scaleY: 2.3,
        scaleZ: 2.3,
    });
    world.add(donut);
    food.push(donut);
    foodName.push('donut');

    taco = new OBJ({
        asset: 'taco_obj',
        mtl: 'taco_mtl',
        x: -35,
        y: 15.5,
        z: -10,
        rotationX: 45,
        rotationY: 0,
        scaleX: 11,
        scaleY: 11,
        scaleZ: 11,
    });
    world.add(taco); 
    food.push(taco);
    foodName.push('taco');

    waffle = new OBJ({
        asset: 'waffle_obj',
        mtl: 'waffle_mtl',
        x: -35,
        y: 15.5,
        z: -20,
        rotationX: 90,
        rotationY: 90,
        scaleX: 3.5,
        scaleY: 3.5,
        scaleZ: 3.5,
    });
    world.add(waffle); 
    food.push(waffle);
    foodName.push('waffle');

    sushi = new OBJ({
        asset: 'sushi_obj',
        mtl: 'sushi_mtl',
        x: -34,
        y: 15,
        z: -32,
        rotationX: 0,
        rotationY: 0,
        scaleX: 7,
        scaleY: 7,
        scaleZ: 7,
    });
    world.add(sushi); 
    food.push(sushi);
    foodName.push('sushi');

    banana = new OBJ({
        asset: 'banana_obj',
        mtl: 'banana_mtl',
        x: 35,
        y: 24,
        z: 0,
        rotationX: 45,
        rotationY: 0,
        scaleX: 6,
        scaleY: 6,
        scaleZ: 6,
    });
    world.add(banana);
    food.push(banana);
    foodName.push('banana');

    apple = new OBJ({
        asset: 'apple_obj',
        mtl: 'apple_mtl',
        x: 35,
        y: 22.5,
        z: -5,
        rotationX: 0,
        rotationY: 0,
        scaleX: 0.02,
        scaleY: 0.02,
        scaleZ: 0.02,
    });
    world.add(apple);   
    food.push(apple);
    foodName.push('apple');

    strawberry = new OBJ({
        asset: 'strawberry_obj',
        mtl: 'strawberry_mtl',
        x: 35,
        y: 24.5,
        z: -15,
        rotationX: 180,
        rotationY: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        scaleZ: 0.1,
    });
    world.add(strawberry);  
    food.push(strawberry);
    foodName.push('strawberry');

    grape = new OBJ({
        asset: 'grape_obj',
        mtl: 'grape_mtl',
        x: 35,
        y: 25,
        z: -23,
        rotationX: -55,
        rotationY: 0,
        scaleX: 0.07,
        scaleY: 0.07,
        scaleZ: 0.07,
    });
    world.add(grape); 
    food.push(grape);
    foodName.push('grape');

    kiwi = new OBJ({
        asset: 'kiwi_obj',
        mtl: 'kiwi_mtl',
        x: 35,
        y: 24,
        z: -35,
        rotationX: 35,
        rotationY: -90,
        scaleX: 0.2,
        scaleY: 0.2,
        scaleZ: 0.2,
    });
    world.add(kiwi); 
    food.push(kiwi);
    foodName.push('kiwi');

    carrot = new OBJ({
        asset: 'carrot_obj',
        mtl: 'carrot_mtl',
        x: 35,
        y: 16,
        z: 0,
        rotationX: 45,
        rotationY: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        scaleZ: 1.5,
    });
    carrot.cartValue = cartCarrot;
    world.add(carrot); 
    food.push(carrot);
    foodName.push('carrot');

    eggplant = new OBJ({
        asset: 'eggplant_obj',
        mtl: 'eggplant_mtl',
        x: 35,
        y: 15,
        z: -10,
        rotationX: -125,
        rotationY: 0,
        scaleX: 0.05,
        scaleY: 0.05,
        scaleZ: 0.05,
    });
    world.add(eggplant);
    food.push(eggplant);
    foodName.push('eggplant');

    corn = new OBJ({
        asset: 'corn_obj',
        mtl: 'corn_mtl',
        x: 35,
        y: 12,
        z: -20,
        rotationX: 0,
        rotationY: 0,
        scaleX: 0.16,
        scaleY: 0.16,
        scaleZ: 0.16,
    });
    world.add(corn); 
    food.push(corn);
    foodName.push('corn');

    pepper = new OBJ({
        asset: 'pepper_obj',
        mtl: 'pepper_mtl',
        x: 35,
        y: 14,
        z: -30,
        rotationX: 0,
        rotationY: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        scaleZ: 1.5,
    });
    world.add(pepper); 
    food.push(pepper);
    foodName.push('pepper');

    tomato = new OBJ({
        asset: 'tomato_obj',
        mtl: 'tomato_mtl',
        x: 35,
        y: 14,
        z: -40,
        rotationX: -90,
        rotationY: 0,
        scaleX: 0.1,
        scaleY: 0.1,
        scaleZ: 0.1,
    });
    world.add(tomato); 
    food.push(tomato);
    foodName.push('tomato');

    coke = new OBJ({
        asset: 'coke_obj',
        mtl: 'coke_mtl',
        x: -10,
        y: 26.5,
        z: -45,
        rotationX: 0,
        rotationY: 0,
        scaleX: 3,
        scaleY: 3,
        scaleZ: 3,
    });
    coke.cartValue = cartCoke;
    world.add(coke); 
    food.push(coke);
    foodName.push('coke');

    water = new OBJ({
        asset: 'water_obj',
        mtl: 'water_mtl',
        x: 0,
        y: 23.5,
        z: -45,
        rotationX: 0,
        rotationY: 0,
        scaleX: 10,
        scaleY: 9,
        scaleZ: 10,

    });
    water.cartValue = cartWater;
    world.add(water); 
    food.push(water);
    foodName.push('water');

    coffee = new OBJ({
        asset: 'coffee_obj',
        mtl: 'coffee_mtl',
        x: -20,
        y: 23,
        z: -45,
        rotationX: 0,
        rotationY: 0,
        scaleX: 2,
        scaleY: 2,
        scaleZ: 2,
    });
    world.add(coffee); 
    food.push(coffee);
    foodName.push('coffee');

    wine = new OBJ({
        asset: 'wine_obj',
        mtl: 'wine_mtl',
        x: 10,
        y: 22,
        z: -45,
        rotationX: 0,
        rotationY: 0,
        scaleX: 0.08,
        scaleY: 0.07,
        scaleZ: 0.08,
    });
    world.add(wine); 
    food.push(wine);
    foodName.push('wine');

    cocktail = new OBJ({
        asset: 'cocktail_obj',
        mtl: 'cocktail_mtl',
        x: 20,
        y: 27,
        z: -45,
        rotationX: 0,
        rotationY: 0,
        scaleX: 2,
        scaleY: 2,
        scaleZ: 2,
    });
    world.add(cocktail); 
    food.push(cocktail);
    foodName.push('cocktail');

     machine = new OBJ({
        asset: 'machine_obj',
        mtl: 'machine_mtl',
        x: 60,
        y: 13,
        z: 5,
        rotationX: 0,
        rotationY: 90,
        scaleX: 60,
        scaleY: 70,
        scaleZ: 60,
    });
    world.add(machine); 

    coin = new OBJ({
        asset: 'coin_obj',
        mtl: 'coin_mtl',
        x: 60,
        y: 36,
        z: 6,
        rotationX: 90,
        rotationY: 0,
        scaleX: 25,
        scaleY: 25,
        scaleZ: 25,
    });
    world.add(coin);

    var fl = new Plane({
        x: 0,
        y: 0,
        z: 0,
        width: 200,
        height: 100,
        asset: 'floor',
        repeatX: 100,
        repeatY: 100,
        rotationX: -90,
        metalness: 0.25,
    });
    world.add(fl);

    var w1 = new Plane({
        x: -100,
        y: 0,
        z: 0,
        width: 100,
        height: 100,
        asset: 'wall',
        repeatX: 100,
        repeatY: 100,
        rotationY: 90,
        metalness: 0.25,
    });
    world.add(w1);
    var w2 = new Plane({
        x: 0,
        y: 0,
        z: -50,
        width: 200,
        height: 100,
        asset: 'wall',
        repeatX: 100,
        repeatY: 100,
        metalness: 0.25,
    });
    world.add(w2);
    var w3 = new Plane({
        x: 100,
        y: 0,
        z: 0,
        width: 100,
        height: 100,
        asset: 'wall',
        repeatX: 100,
        repeatY: 100,
        rotationY: -90,
        metalness: 0.25,
    });
    world.add(w3);
    var w4 = new Plane({
        x: 0,
        y: 0,
        z: 50,
        width: 200,
        height: 100,
        asset: 'wall',
        repeatX: 100,
        repeatY: 100,
        rotationY: 180,
        metalness: 0.25,
    });
    world.add(w4);

    hand1 = new Box({
        x: -0.5,
        y: 0,
        z: -1,
        width: 0.1,
        height: 0.1,
        depth: 0.1,
        red: 255,
        green: 0,
        blue: 0
    });

    hand2 = new Box({
        x: 0.5,
        y: 0,
        z: -1,
        width: 0.1,
        height: 0.1,
        depth: 0.1,
        red: 0,
        green: 255,
        blue: 0
    });

    // add the hands to our camera - this will force it to always show up on the user's display
    world.camera.holder.appendChild(hand1.tag);
    world.camera.holder.appendChild(hand2.tag);


}

function draw() {

    coin.spinY(0.5);

    var pos = world.getUserPosition();
    if(pos.z > 50) {
        world.setUserPosition(pos.x, pos.y, 50);
    }
    else if(pos.z < -45) {
        world.setUserPosition(pos.x, pos.y, -45);
    }    
    if(pos.x > 95) {
        world.setUserPosition(95, pos.y, pos.z);
    }
    else if(pos.x < -95) {
        world.setUserPosition(-95, pos.y, pos.z);
    }    
    if(pos.y > 45) {
        world.setUserPosition(pos.x, 45, pos.z);
    } 
    else if(pos.y < 0) {
        world.setUserPosition(pos.x, 0, pos.z);
    }         

    if(mouseIsPressed || touchIsPressed){
        world.moveUserForward(0.5);
    }

    var ux = world.getUserPosition().x;
    var uy = world.getUserPosition().y;
    var uz = world.getUserPosition().z;

    for (var i = 0; i < food.length; i++) {
        var xd = food[i].x - ux;
        var yd = food[i].y - uy;
        var zd = food[i].z - uz;
        var dist = Math.sqrt(xd*xd + yd*yd + zd*zd);
        if(dist < 3){
            food[i].tag.setAttribute('visible', false);
            if(food[i].cartValue != undefined){
                food[i].cartValue.tag.setAttribute('visible', true);
                }
            food.splice(i, 1); 
            ding.play();
            var name = document.getElementById(foodName[i]);
            name.style.display = "block";

            setTimeout(function() {
                name.style.display = "none";
            }, 3000);
            
            shoplist.push(foodName[i]);
            foodName.splice(i, 1); 

        }
        var xm = 60 - ux;
        var ym = 13 - uy;
        var zm = 5 - uz;

        var distCheckout = Math.sqrt(xm*xm + ym*ym + zm*zm);
        if (distCheckout <20. && !checkedOut){
            checkedOut = true;
            var checkout_div = document.getElementById('checkout');
            console.log(foodName);
            for(var i = 0; i < shoplist.length; i++) {
                checkout_div.innerHTML += "<li>" + shoplist[i] + "</li>";
            }
            checkout_div.style.display = "block";
            console.log('setting timeout');
            setTimeout(function() {
                document.getElementById('checkout').style.display = "none";
            }, 7000);
        }

    }



}

function handleHandData(frame) {

    
    if (frame.hands.length == 2) {
        var handPosition1;
        var handPosition2;   
    
        if(frame.hands[0].type == "left") {
            handPosition1 = frame.hands[0].stabilizedPalmPosition;
            handPosition2 = frame.hands[1].stabilizedPalmPosition;
        } else {
            handPosition2 = frame.hands[0].stabilizedPalmPosition;
            handPosition1 = frame.hands[1].stabilizedPalmPosition;
        }



        // grab the x, y & z components of the hand position
        // these numbers are measured in millimeters
        var hx1 = handPosition1[0];
        var hy1 = handPosition1[1];
        var hz1 = handPosition1[2];

        // grab the x, y & z components of the hand position
        // these numbers are measured in millimeters
        var hx2 = handPosition2[0];
        var hy2 = handPosition2[1];
        var hz2 = handPosition2[2];

        // console.log(hx1 + "," + hy1 + "," + hz1 + " - " + hx2 + ", " + hy2 + ", " + hz2);

        var x1 = map(hx1, -200, 200, -1, 0);
        var y1 = map(hy1, 0, 500, -1, 1);
        var z1 = map(hz1, -100, 200, -1, 0);

        var x2 = map(hx2, -200, 200, 0, 1);
        var y2 = map(hy2, 0, 500, -1, 1);
        var z2 = map(hz2, -100, 200, -1, 0);

        //if(hx1>=-75 && hx1<=-65 && hz1>=10&& hz1<=20 && hx2>= 50 && hx2<= 60 && hz2 >= 10 && hz2 <=20){
        hand1.setX( x1 );
        hand1.setY( y1 );
        hand1.setZ( z1 );

        hand2.setX( x2 );
        hand2.setY( y2 );
        hand2.setZ( z2 ); 
        

        // if (y1 < y2) {
        //     var diff = y2 - y1;
        //     world.camera.nudgePosition( map(diff, 0, 1, 0, -0.1), 0, 0);
        // }
        // else {
        //     var diff = y1 - y2;
        //     world.camera.nudgePosition( map(diff, 0, 1, 0, 0.1), 0, 0);
        // }

        if(hx1>=-60){
            moveRight(world);

        }else if(hx1<=-140){
            moveLeft(world);
        }
        if(hz1>=50){
            moveBackward(world);
        } else if(hz1<=-20){
            moveForward(world);
        }
        if(hy2>=200){
            moveUpward(world);
        } else if(hy2<= 100){
            moveDownward(world);
        }


  
    }

}


function moveLeft(world){
    var pos = world.getUserPosition();
    world.setUserPosition(pos.x-0.1, pos.y, pos.z);
}
function moveRight(world){
    var pos = world.getUserPosition();
    world.setUserPosition(pos.x+0.1, pos.y, pos.z);
}
function moveForward(world){
    world.moveUserForward(0.1);
}
function moveBackward(world){
    var pos = world.getUserPosition();
    world.setUserPosition(pos.x, pos.y, pos.z+0.1);
}

function moveUpward(world){
    var pos = world.getUserPosition();
    world.setUserPosition(pos.x, pos.y+0.1, pos.z);
}
function moveDownward(world){
    var pos = world.getUserPosition();
    world.setUserPosition(pos.x, pos.y-0.1, pos.z);
}

// function script(window1) {
//     var script = document.getElementById('window1').style.display = "block";

// }

function touchStarted() {
    touchIsPressed = true;
}

function touchEnded() {
    touchIsPressed = false;
}

