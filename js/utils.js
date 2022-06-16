let timer = 60;
let timerId;

function rectangularCollision({rectangle1, rectangle2}){
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
    && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
    && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    && rectangle1.isAttacking)
}

function determineWinner({player1, player2, timerId}){
    clearTimeout(timerId);
    if(player1.health === player2.health)
        document.querySelector("#gameStatus").innerHTML = "Draw";
    else if(player1.health > player2.health)
        document.querySelector("#gameStatus").innerHTML = "Player 1 wins";
    else
        document.querySelector("#gameStatus").innerHTML = "Player 2 wins";
    document.querySelector("#gameStatus").style.display = "flex";
}

function decreaseTimer(){
    if(timer){
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
    }
    document.querySelector("#timer").innerHTML = timer;
    if(timer === 0){
        determineWinner({player1,player2,timerId});
    }
}
