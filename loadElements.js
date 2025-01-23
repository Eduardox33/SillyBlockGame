function checkLoads(){
    if(loads===elements){document.body.style.display='block';}
}

const elements=2;
let loads=0;

const hitsound=new Audio('elements/hitsound.mp3');
hitsound.addEventListener('canplaythrough',()=>{loads++;checkLoads();})

const deathSound=new Audio('elements/deathSound.mp3');
deathSound.addEventListener('canplaythrough',()=>{loads++;checkLoads();})

const hitWall=new Audio('elements/hitWall.mp3');
hitWall.addEventListener('canplaythrough',()=>{loads++;checkLoads();})