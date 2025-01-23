class fighter{
    constructor(xpos,ypos,height,width,dx,dy,color,lifeBarPointer){
        this.xpos=xpos;
        this.ypos=ypos;
        this.height=height;
        this.width=width;
        this.dx=dx;
        this.dy=dy;
        this.color=color;
        this.weaponSize=15;
        this.lifeBarPointer=lifeBarPointer;
    }
    draw(){
        context.fillStyle=this.color;
        context.fillRect(this.xpos,this.ypos,this.width,this.height);
        context.fillStyle="lime";
        if(this.color==="blue"){
            context.fillRect(this.xpos,this.ypos,this.width,this.height/this.weaponSize);
            context.fillRect(this.xpos,this.ypos+this.height-this.height/this.weaponSize,this.width,this.height/this.weaponSize)
        }else if(this.color==="red"){
            context.fillRect(this.xpos,this.ypos,this.width/this.weaponSize,this.height);
            context.fillRect(this.xpos+this.width-this.width/this.weaponSize,this.ypos,this.width/this.weaponSize,this.height)
        }
    }
    move(){
        
        if(this.xpos<=0){
            this.dx*=-1;
            this.xpos=0;
            if(!hitWall.paused){hitWall.pause();hitWall.currentTime=0;}
            hitWall.play();
        }else if(this.xpos+this.width>=WIDTH){
            this.dx*=-1;
            this.xpos=WIDTH-this.width;
            if(!hitWall.paused){hitWall.pause();hitWall.currentTime=0;}
            hitWall.play();
        }
        
        if(this.ypos<=0){
            this.dy*=-1;
            this.ypos=0;
            if(!hitWall.paused){hitWall.pause();hitWall.currentTime=0;}
            hitWall.play();
        }else if(this.ypos+this.height>=HEIGHT){
            this.dy*=-1;
            this.ypos=HEIGHT-this.height;
            if(!hitWall.paused){hitWall.pause();hitWall.currentTime=0;}
            hitWall.play();
        }

        this.xpos+=this.dx;
        this.ypos+=this.dy;

        this.draw();
    }
}

class lifeBar{
    constructor(xpos,ypos,height,width,maxLife,currLife,text,color){
        this.xpos=xpos;
        this.ypos=ypos;
        this.height=height;
        this.width=width;
        this.maxLife=maxLife;
        this.currLife=currLife;
        this.text=text;
        this.color=color;
    }
    draw(){
        lifeContext.fillStyle=this.color;
        lifeContext.textBaseline="top";
        lifeContext.font="40px Arial";
        lifeContext.fillText(this.text,this.xpos+20,this.ypos);
        lifeContext.fillStyle="white";
        lifeContext.fillRect(this.xpos+120,this.ypos,this.width,this.height);
        lifeContext.fillStyle=this.color;

        const fraction=this.width/this.maxLife;
        for(let i=0;i<this.currLife;i++){
            lifeContext.fillRect(this.xpos+120+fraction*i,this.ypos,fraction,this.height);
        }
    }
}