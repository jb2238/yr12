var canvas;
var canvasContext;
var bx = 40;
var by = 40;
var vbx = 15;
var vby = 6;
var py = 300;
var py2 = 300;
var pScore = 0;
var cScore = 0;
var winningScreen = true;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WIN_SCORE = 10;
function calcMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    };
}
function handleMouseClick(evt){
    if(winningScreen){
        pScore = 0
        cScore = 0;
        winningScreen = false;
    }
}
window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    var fps = 30;
    setInterval(function(){
        drawAll();
        moveStuff();
    }, 1000/fps);
    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove', function(evt){
        var mousePos = calcMousePos(evt);
        py = mousePos.y-(PADDLE_HEIGHT/2);
    })
}
function ballReset(){
    if(pScore == WIN_SCORE || cScore == WIN_SCORE){
        if(pScore > cScore){
            canvasContext.fillText("You Won !", 180,200);
        }else{
            canvasContext.fillText("Computer Won !", 570,200);
        }
        winningScreen = true;
    }
    vbx = -vbx
    vby = 6
    bx = canvas.width/2;
    by = canvas.height/2;
}
function drawAll() {

    if(winningScreen){
        canvasContext.fillText("Click to continue...", canvas.width-440, canvas.height-325); //check if game is won, skip updating the screen
        return;
    }

    colourRect(0,0,canvas.width, canvas.height,'black'); //draw black canvas
    drawNet();
    colourRect(0,py,PADDLE_THICKNESS,PADDLE_HEIGHT,'white'); //draw L paddle
    colourRect(canvas.width-PADDLE_THICKNESS,py2,PADDLE_THICKNESS,PADDLE_HEIGHT,'white'); //draw R paddle
    colourCirc(bx, by, 10, 'white'); //draw ball
    canvasContext.fillText(pScore, 200,300);
    canvasContext.fillText(cScore, 600,300);
}
function drawNet(){ //draw the 'net' line
    for(var i = 0; i < canvas.height; i+= 40){
        colourRect(canvas.width/2-1,i,2,20,'white')
    }
}
function colourCirc(centX, centY, r, drawCol){ //draw circle
    canvasContext.fillStyle = drawCol;
    canvasContext.beginPath();
    canvasContext.arc(centX, centY, r, 0, Math.PI*2, true);
    canvasContext.fill();
}
function colourRect(leftX, topY, width, height, drawCol){ //draw rectangle
    canvasContext.fillStyle = drawCol;
    canvasContext.fillRect(leftX, topY, width, height);
}
function compMove() { //adjust comps position based on ball location 
    var py2Centre = py2 + (PADDLE_HEIGHT/2)
    if(py2Centre < by-35){
        py2 += 6;
    }else{
        py2 -= 6;
    }
}
function moveStuff(){ //update the position of ball & players
    if(winningScreen){
        return;
    }
    compMove();
    bx += vbx;
    by += vby
    if(bx > canvas.width-20) {
        if(by > py2 && by < py2+PADDLE_HEIGHT){
            vbx = -vbx;
            var deltaY = by - (py+PADDLE_HEIGHT/2);
            vby = deltaY * 0.15;
        }else{
            pScore += 1;
            drawAll();
            ballReset();
        }
    }
    if(bx < 20){
        if(by > py && by < py+PADDLE_HEIGHT){
            vbx = -vbx;
            var deltaY = by - (py2+PADDLE_HEIGHT/2);
            vby = deltaY * 0.15;
        }else{
            cScore += 1;
            drawAll();
            ballReset();
        }
    }
    
    if(by > canvas.height-10 || by < 10) {
        vby = -vby
    }
}