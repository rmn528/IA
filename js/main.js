var canvas         = document.getElementById('mundo');
var barra          = document.getElementById('barra');
var ctx            = canvas.getContext('2d');
var teclado        = {};
var mouse          = {};
var dibujoElemento = {};

function loadMedia(){
    pasto     = new Image();
    pasto.src = 'img/pastoC.jpg';
    pasto.setAttribute("class", "imagen");
    pasto.onload = function(){
        var intervalo = window.setInterval(frameLoop,1000/55);
    }
}

function drawBackground(){
    for (var i = 0; i < canvas.width; i += pasto.width) {
        for (var j = 0; j < canvas.height; j += pasto.height) {
            ctx.drawImage(pasto,i,j);
        };
    };
}

function addingEvent(elemento,nombreEvento,funcion){
    if(elemento.addEventListener){
        //navegadores de verdad
        elemento.addEventListener(nombreEvento,funcion,false);
    }else if(elemento.attachEvent){
        //internet explorer
        elemento.attachEvent(nombreEvento,funcion);
    }
}

function addingMouseEvents(){
    addingEvent(document,"mousemove",function(e){
        if(e.offsetX) {
            mouse.x = e.offsetX - 15;
            mouse.y = e.offsetY - 15;
        }else if(e.layerX) {
            mouse.x = e.layerX - 15;
            mouse.y = e.layerY - 15;
        }
    });

    addingEvent(barra,'click',function(e) {
        e.preventDefault();
        elemento        = document.getElementById(e.target.id);
        ruta            = elemento.src.split('/');
        imagen          = new Image();
        imagen.src      = ruta[4] + "/" + ruta[5];
        dibujoElemento.imagen = imagen;
    });

    addingEvent(document,'click',function(e) {
        //console.log(canvas.getBoundingClientRect());
        console.log(e.offsetX + " " +e.offsetY);
        console
        dibujoElemento.x      = e.offsetX -15;
        dibujoElemento.y      = e.offsetY -15;
        //console.log(dibujoElemento);
    });
}

function addingKeyBoardEvents(){
    addingEvent(document,"keydown",function(e){
        //ponemos en true la tecla presionada
        teclado[e.keyCode] = true;
    });

    addingEvent(document,"keyup",function(e){
        //ponemos en false la tecla presionada
        teclado[e.keyCode] = false;
    });
}

function drawNewElement(){
    //console.log(dibujoElemento);
    ctx.drawImage(dibujoElemento.imagen,dibujoElemento.x,dibujoElemento.y,32,32);
}

function frameLoop(){
    drawBackground();
    drawNewElement();
}

addingKeyBoardEvents();
addingMouseEvents();
loadMedia();