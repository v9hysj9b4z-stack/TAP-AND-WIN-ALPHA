// =======================================
// TAP & WIN
// SCRIPT.JS - PART 1
// =======================================

// HERO

const hero = document.getElementById("hero");
const game = document.getElementById("game");

const startBtn = document.getElementById("startBtn");
const spinBtn = document.getElementById("spinBtn");

const resultBox = document.getElementById("resultBox");

const againBtn = document.getElementById("againBtn");

const resultTitle = document.getElementById("resultTitle");
const resultPrize = document.getElementById("resultPrize");

const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");

// CANVAS

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const radius = 210;

let rotation = 0;

let spinning = false;

// PRIZES

const prizes = [

{
text:"FREE HAIRCUT",
color:"#FFD700"
},

{
text:"20% OFF",
color:"#FF9800"
},

{
text:"FREE COFFEE",
color:"#795548"
},

{
text:"FREE DRINK",
color:"#03A9F4"
},

{
text:"10% OFF",
color:"#4CAF50"
},

{
text:"FREE WAX",
color:"#9C27B0"
},

{
text:"FREE BEARD",
color:"#F44336"
},

{
text:"TRY AGAIN",
color:"#607D8B"
}

];

// START

startBtn.onclick = function(){

hero.classList.add("hidden");

game.classList.remove("hidden");

drawWheel();

}

// DRAW WHEEL

function drawWheel(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const angle = (Math.PI*2)/prizes.length;

for(let i=0;i<prizes.length;i++){

const start = rotation + (i*angle);
const end = start + angle;

ctx.beginPath();

ctx.moveTo(centerX,centerY);

ctx.arc(centerX,centerY,radius,start,end);

ctx.closePath();

ctx.fillStyle = prizes[i].color;

ctx.fill();

ctx.lineWidth=3;

ctx.strokeStyle="#111";

ctx.stroke();

// TEXT

ctx.save();

ctx.translate(centerX,centerY);

ctx.rotate(start + angle/2);

ctx.fillStyle="#fff";

ctx.font="bold 18px Poppins";

ctx.textAlign="right";

ctx.fillText(prizes[i].text,radius-20,6);

ctx.restore();

}

// CENTER

ctx.beginPath();

ctx.arc(centerX,centerY,42,0,Math.PI*2);

ctx.fillStyle="#FFD700";

ctx.fill();

ctx.strokeStyle="#fff";

ctx.lineWidth=5;

ctx.stroke();

}
// =======================================
// TAP & WIN
// SCRIPT.JS - PART 2
// =======================================

// SPIN

let speed = 0;
let targetRotation = 0;

spinBtn.addEventListener("click", spinWheel);

againBtn.addEventListener("click", () => {

    resultBox.classList.add("hidden");

});

function spinWheel(){

    if(spinning) return;

    spinning = true;

    spinBtn.disabled = true;

    resultBox.classList.add("hidden");

    if(spinSound){

        spinSound.currentTime = 0;

        spinSound.play().catch(()=>{});

    }

    // între 5 și 9 rotații complete
    const extraSpins = 5 + Math.random()*4;

    // unghi aleator
    const randomAngle = Math.random()*360;

    targetRotation += (extraSpins*360)+randomAngle;

    animateSpin();

}

function animateSpin(){

    const current = rotation * 180 / Math.PI;

    const difference = targetRotation-current;

    if(difference<=0.5){

        spinning=false;

        spinBtn.disabled=false;

        checkPrize();

        return;

    }

    const step = Math.max(difference*0.05,1);

    rotation += (step*Math.PI/180);

    drawWheel();

    requestAnimationFrame(animateSpin);

}
// =======================================
// TAP & WIN
// SCRIPT.JS - PART 3
// =======================================

function checkPrize(){

    const slice = 360 / prizes.length;

    let degrees = targetRotation % 360;

    let pointer = (360 - degrees + 270) % 360;

    let index = Math.floor(pointer / slice);

    if(index >= prizes.length){
        index = prizes.length - 1;
    }

    const prize = prizes[index];

    resultPrize.innerHTML = prize.text;

    if(prize.text === "TRY AGAIN"){

        resultTitle.innerHTML = "Better Luck Next Time";

    }else{

        resultTitle.innerHTML = "Congratulations!";

        if(winSound){

            winSound.currentTime = 0;

            winSound.play().catch(()=>{});

        }

        confetti({

            particleCount:250,

            spread:120,

            startVelocity:45,

            origin:{ y:0.6 }

        });

    }

    resultBox.classList.remove("hidden");

}

// PLAY AGAIN

againBtn.addEventListener("click",()=>{

    resultBox.classList.add("hidden");

});

// ENTER KEY

document.addEventListener("keydown",(e)=>{

    if(e.key==="Enter" && !spinning){

        spinWheel();

    }

});

// FIRST DRAW

drawWheel();

// PRELOAD AUDIO

window.addEventListener("load",()=>{

    if(spinSound){

        spinSound.load();

    }

    if(winSound){

        winSound.load();

    }

});
