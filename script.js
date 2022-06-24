const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);
const gravity = 0.7;
const background = new Sprite({
    position:{
        x:0,y:0
    },
    imageSrc: "./JS_fighter_assets/background.png"
});
const shop = new Sprite({
    position:{x:600,y:128},
    imageSrc: "./JS_fighter_assets/shop_anim.png",
    scale:2.75,
    framesMax:6,
    isAnimated: true
});

const player1 = new Fighter({
    position:{x:0,y:0},
    velocity:{x:0,y:0},
    offset:{x:215,y:157},
    imageSrc: "./JS_fighter_assets/Mugen/Idle.png",
    framesMax:8,
    scale:2.5,
    sprites:{
        idle:{imageSrc:"./JS_fighter_assets/Mugen/Idle.png",framesMax:8},
        run:{imageSrc:"./JS_fighter_assets/Mugen/Run.png",framesMax:8},
        jump:{imageSrc:"./JS_fighter_assets/Mugen/jump.png",framesMax:2},
        fall:{imageSrc:"./JS_fighter_assets/Mugen/fall.png",framesMax:2},
        attack1:{imageSrc:"./JS_fighter_assets/Mugen/attack1.png",framesMax:6},
        hit:{imageSrc:"./JS_fighter_assets/Mugen/Take hit.png",framesMax:4},
        death:{imageSrc:"./JS_fighter_assets/Mugen/Death.png",framesMax:6}
    },
    attackBox:{
        offset:{x:100,y:50},
        width:157,
        height:50
    }
});
const player2 = new Fighter({
    position:{x:400,y:100},
    velocity:{x:0,y:0},
    color:"blue",
    offset:{x:215,y:168},
    imageSrc: "./JS_fighter_assets/Jin/Idle.png",
    framesMax:4,
    scale:2.5,
    framesHold:8,
    sprites:{
        idle:{imageSrc:"./JS_fighter_assets/Jin/Idle.png",framesMax:4},
        run:{imageSrc:"./JS_fighter_assets/Jin/Run.png",framesMax:8},
        jump:{imageSrc:"./JS_fighter_assets/Jin/Jump.png",framesMax:2},
        fall:{imageSrc:"./JS_fighter_assets/Jin/fall.png",framesMax:2},
        attack1:{imageSrc:"./JS_fighter_assets/Jin/attack1.png",framesMax:4},
        hit:{imageSrc:"./JS_fighter_assets/Jin/Take hit.png",framesMax:3},
        death:{imageSrc:"./JS_fighter_assets/Jin/Death.png",framesMax:7}
    },
    attackBox:{
        offset:{x:100,y:50},
        width:157,
        height:50
    }
});

const keys = {
    a:{pressed: false},
    d:{pressed: false},
    ArrowRight:{pressed: false},
    ArrowLeft:{pressed: false},
}


decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width, canvas.height);
    background.update();
    shop.update();
    player1.update();
    player2.update();

    //p1 movement
    player1.velocity.x = 0
    if(keys.a.pressed && player1.lastKey === 'a'){
        player1.switchSprite('run');
        player1.velocity.x = -5;
    }else if(keys.d.pressed && player1.lastKey === 'd'){
        player1.switchSprite('run');
        player1.velocity.x = 5;
    }else{
        player1.switchSprite('idle');
    }

    if(player1.velocity.y < 0){
        player1.switchSprite('jump');
    } else if(player1.velocity.y > 0){
        player1.switchSprite('fall');
    }


    //p2 movement
    player2.velocity.x = 0
    if(keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft'){
        player2.switchSprite('run');
        player2.velocity.x = -5;
    }else if(keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight'){
        player2.switchSprite('run');
        player2.velocity.x = 5;
    }else{
      player2.switchSprite('idle');
    }

    if(player2.velocity.y < 0){
        player2.switchSprite('jump');
    } else if(player2.velocity.y > 0){
        player2.switchSprite('fall');
    }

    //p1 collision and enemy is hit
    if(rectangularCollision({rectangle1:player1, rectangle2:player2}) && player1.isAttacking && player1.framesCurrent === 4){
        player1.isAttacking = false;
        player2.takeHit();
        document.querySelector("#player2HP").style.width = player2.health + '%';

    }

    //if p1 misses
    if(player1.isAttacking && player1.framesCurrent === 4)
        player1.isAttacking = false;

    if(rectangularCollision({rectangle1:player2, rectangle2:player1}) && player2.isAttacking && player2.framesCurrent === 2){
        player2.isAttacking = false;
        player1.takeHit();
        document.querySelector("#player1HP").style.width = player1.health + '%';
    }

    if(player2.isAttacking && player2.framesCurrent === 2)
        player2.isAttacking = false;

    if(player1.health <= 0 || player2.health <= 0){
        determineWinner({player1,player2,timerId});
    }


}

animate();
window.addEventListener('keydown', (event) =>{
    if(!player1.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed = true;
                player1.lastKey ='d'
            break;
            case 'a':
                keys.a.pressed = true;
                player1.lastKey ='a'
            break;
            case 'w':
                player1.velocity.y = -20;
            break;
            case ' ':
                player1.attack();
            break;
        }
    }

    if(!player2.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                player2.lastKey ='ArrowRight'
            break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                player2.lastKey ='ArrowLeft'
            break;
            case 'ArrowUp':
                player2.velocity.y = -20;
            break;
            case 'ArrowDown':
                player2.attack();
            break;
        }
    }


});

window.addEventListener('keyup', (event) =>{

    if(!player1.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed = false;
            break;
            case 'a':
                keys.a.pressed = false;
            break;
            case 'w':
                player1.velocity.y = -10;
            break;
            case ' ':
                player1.attack();
            break;
        }
    }

    if(!player2.dead){
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = false;
            break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false;
            break;
            case 'ArrowUp':
                player2.velocity.y = -10;
            break;
            case 'ArrowDown':
                player2.attack();
            break;
        }
    }

});
