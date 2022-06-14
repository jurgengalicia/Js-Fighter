const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
    constructor({position, velocity, color = 'red', offset}){
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.isAttacking = false;
        this.attackBox ={
            position: {
                x:this.position.x,
                y:this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color
    }

    draw(){
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        //if(this.isAttacking){
            c.fillStyle = 'green';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y,this.attackBox.width, this.attackBox.height);
        //}
    }

    update(){
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y - this.attackBox.offset.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
        }
        else {
            this.velocity.y += gravity;
        }
    }
    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }
}

const player1 = new Sprite({
    position:{x:0,y:0},
    velocity:{x:0,y:0},
    offset:{x:0,y:0}
});
const player2 = new Sprite({
    position:{x:400,y:100},
    velocity:{x:0,y:0},
    color:"blue",
    offset:{x:-50,y:0}
});

const keys = {
    a:{pressed: false},
    d:{pressed: false},
    ArrowRight:{pressed: false},
    ArrowLeft:{pressed: false},
}

function rectangularCollision({rectangle1,rectangle2}){
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
    && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
    && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    && rectangle1.isAttacking)
}

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width, canvas.height);
    player1.update();
    player2.update();

    //p1 movement
    player1.velocity.x = 0
    if(keys.a.pressed && player1.lastKey === 'a'){
        player1.velocity.x = -5;
    }else if(keys.d.pressed && player1.lastKey === 'd'){
        player1.velocity.x = 5;
    }

    //p1 collision
    if(rectangularCollision({rectangle1:player1, rectangle2:player2}) ){
        player1.isAttacking = false;
        console.log("p2 is hit")
    }

    if(rectangularCollision({rectangle1:player2, rectangle2:player1}) ){
        player1.isAttacking = false;
        console.log("p1 is hit")
    }



    //p2 movement
    player2.velocity.x = 0
    if(keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft'){
        player2.velocity.x = -5;
    }else if(keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight'){
        player2.velocity.x = 5;
    }
}

animate();
window.addEventListener('keydown', (event) =>{
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
    }

});

window.addEventListener('keyup', (event) =>{
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

});
