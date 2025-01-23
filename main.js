const canvas=document.getElementById("canvas");
const context=canvas.getContext("2d");
const lifeCanvas=document.getElementById("lifes");
const lifeContext=lifeCanvas.getContext("2d");

const HEIGHT=450; 
const WIDTH=450;
let running=false;

canvas.width=WIDTH; canvas.height=HEIGHT; lifeCanvas.width=WIDTH; lifeCanvas.height=90;

const Life1=new lifeBar(0,5,35,300,10,10,"Red","red");
const Life2=new lifeBar(0,50,35,300,10,10,"Blue","blue");
const Rectangle1=new fighter(0,0,140,140,0,0,"red",Life1);
const Rectangle2=new fighter(WIDTH-140,HEIGHT-140,140,140,0,0,"blue",Life2);
const Rectangles=[Rectangle1,Rectangle2];

let balance=JSON.parse(sessionStorage.getItem("balance")) || 100;
let placedBet=0;
let gameCounter=0;
const showBalance=document.getElementById("showBalance");
updateBalance();

function updateBalance(){
    showBalance.innerText=`Balance: ${balance}`;
    sessionStorage.setItem("balance",JSON.stringify(balance));
}

function start(){

    const betWindow=document.getElementById("placeBet");
    placedBet=parseInt(document.getElementById("bet").value);

    if(isNaN(placedBet)){alert("Not a number");return reset();}
    if(placedBet<1){alert("Not a valid bet");return reset();}
    if(placedBet>balance){alert("Not enough funds");return reset();}
    balance-=placedBet;
    updateBalance();

    betWindow.style.display='none';

    let startHit=randInt(0,20);
    for(let Rectangle of Rectangles){
        Rectangle.dx=randInt(1,5);
        Rectangle.dy=randInt(1,5);
        if(startHit<10){Rectangle.ypos=randInt(0,HEIGHT-140);}
        else if(startHit>=10){Rectangle.xpos=randInt(0,HEIGHT-140);}
    }

    running=true;
    mainLoop();
}

function reset(){
    if(!running){location.reload();}
}

function checkWin(entity){
    if(entity.color==="blue"){
        balance+=placedBet*Life1.currLife;
    }
    return updateBalance();
}

function gotHit(entity){
    hitsound.play();
    entity.width-=10;
    entity.height-=10;
    entity.lifeBarPointer.currLife--;
    if(entity.width<=40 || entity.height<=40){
        entity.height=0;
        entity.width=0;
        running=false;
        deathSound.play();
        checkWin(entity);
    }
}

function isColission(x1,x2,y1,y2,w1,h1,w2,h2){    
    if((x1+w1>=x2)&&(x1<=x2+w2)&&(y1+h1>=y2)&&(y1<=y2+h2)){return true;}
    return false;
}

function colissionPhysics(){
    
    const lambdaX=Math.abs(Rectangle1.xpos-Rectangle2.xpos);
    const lambdaY=Math.abs(Rectangle1.ypos-Rectangle2.ypos);
    
    let overlapY; let overlapX;

    if(lambdaX>lambdaY){

        if((Rectangle1.dx>0&&Rectangle2.dx>0)||(Rectangle1.dx<0&&Rectangle2.dx<0)){
            if(Math.abs(Rectangle1.dx)>Math.abs(Rectangle2.dx)){Rectangle1.dx*=-1;}
            else{Rectangle2.dx*=-1;}
        }else{
            Rectangle1.dx*=-1;Rectangle2.dx*=-1;
        }
        if(Rectangle1.xpos<Rectangle2.xpos){
            overlapX=(Rectangle1.xpos+Rectangle1.width)-Rectangle2.xpos;
            Rectangle1.xpos-=overlapX/2;
            Rectangle2.xpos+=overlapX/2;
        }else{
            overlapX=(Rectangle2.xpos+Rectangle2.width)-Rectangle1.xpos;
            Rectangle1.xpos+=overlapX/2;
            Rectangle2.xpos-=overlapX/2;
        }

        gotHit(Rectangle2);

    }
    else if(lambdaY>lambdaX){

        if((Rectangle1.dy>0&&Rectangle2.dy>0)||(Rectangle1.dy<0&&Rectangle2.dy<0)){
            if(Math.abs(Rectangle1.dy)>Math.abs(Rectangle2.dy)){Rectangle1.dy*=-1;}
            else{Rectangle2.dy*=-1;}
        }else{
            Rectangle1.dy*=-1;Rectangle2.dy*=-1;
        }

        if(Rectangle1.ypos<Rectangle2.ypos){
            overlapY=(Rectangle1.ypos+Rectangle1.height)-Rectangle2.ypos;
            Rectangle1.ypos-=overlapY/2;
            Rectangle2.ypos+=overlapY/2;
        }else{
            overlapY=(Rectangle2.ypos+Rectangle2.height)-Rectangle1.ypos;
            Rectangle1.ypos+=overlapY/2;
            Rectangle2.ypos-=overlapY/2;
        }

        gotHit(Rectangle1);

    }else{
        Rectangle1.dy*=-1;Rectangle2.dy*=-1;
        gotHit(Rectangle1);gotHit(Rectangle2);
    }

}

function reshuffle(){
    for(let Rectangle of Rectangles){
        Rectangle.dx=randInt(1,5);
        Rectangle.dy=randInt(1,5);
    }
}

function mainLoop(){
    if(running){requestAnimationFrame(mainLoop);}
    context.clearRect(0,0,WIDTH,HEIGHT);

    Rectangle1.move();
    Rectangle2.move();
    Life1.draw();
    Life2.draw();

    gameCounter++;

    if(isColission(
        Rectangle1.xpos,Rectangle2.xpos,
        Rectangle1.ypos,Rectangle2.ypos,
        Rectangle1.width,Rectangle1.height,
        Rectangle2.width,Rectangle2.height
    )){colissionPhysics();gameCounter=0;}
    
    if(gameCounter>=20*60){reshuffle();gameCounter=0;}
}

function randInt(max,min){return Math.floor(Math.random()*(max-min+1)+min);}
