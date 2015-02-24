var canvas         = document.getElementById('mundo');
var barra          = document.getElementById('barra');
var ctx            = canvas.getContext('2d');
var teclado        = {};
var mouse          = {};
var dibujoElemento = {};
var kybus          = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0
                     };
var casa           = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0
                     };
var mapa;

function printMap(){
    for (var i = 0,cordX = 0; cordX < canvas.width; cordX += pasto.width, i++) {
        for (var j = 0,cordY = 0; cordY < canvas.height; cordY += pasto.height, j++) {
            console.log(mapa[i][j]);
        }
    }
}

function loadMedia(){
    pasto     = new Image();
    pasto.src = 'img/pastoC.jpg';
    pasto.setAttribute("class", "imagen");
    mapa = [];
    for (var i = 0,cordX = 0; cordX < canvas.width; cordX += pasto.width, i++) {
        mapa[i] = [];
    }
    for (var i = 0,cordX = 0; cordX < canvas.width; cordX += pasto.width, i++) {
        for (var j = 0,cordY = 0; cordY < canvas.height; cordY += pasto.height, j++) {
            mapa[i][j] = {
                            i : i,
                            j : j,
                            x : cordX,
                            y : cordY,
                            obstaculo : 0,
                            kybus : 0,
                            casa : 0,
                            tipo_obstaculo : '',
                            objeto : ''
                         };
        }
    }
    pasto.onload = function(){
        var intervalo = window.setInterval(frameLoop,1000/55);
    }
}

function drawBackground(){
    for (var i = 0,cordX = 0; cordX < canvas.width; cordX += pasto.width, i++) {
        for (var j = 0,cordY = 0; cordY < canvas.height; cordY += pasto.height, j++) {
            mapa[i][j].i = i;
            mapa[i][j].j = j;
            mapa[i][j].x = cordX;
            mapa[i][j].y = cordY;
            ctx.drawImage(pasto,cordX,cordY);
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

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

function addingMouseEvents(){
    addingEvent(barra,'click',function(e) {
        e.preventDefault();
        dibujoElemento.id     = e.target.id;
    });

    addingEvent(canvas,'click',function(e) {
        posicion              = getMousePos(e);
        if(!jQuery.isEmptyObject(dibujoElemento)){
            dibujoElemento.x      = posicion.x -15;
            dibujoElemento.y      = posicion.y -15;
        }
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

function isInside(newElement,map){
    if(newElement.x >= map.x && newElement.x < map.x + 40 && newElement.y >= map.y && newElement.y < map.y + 38){
        return true;
    }
    return false;
}

function NewElement(){
    if(!jQuery.isEmptyObject(dibujoElemento)){
        x = mapa.length;
        y = mapa[0].length;
        for (var i = 0;i < x;i++) {
            for (var j = 0; j < y;j++) {
                if(isInside(dibujoElemento,mapa[i][j]) && mapa[i][j].objeto == '' && dibujoElemento.id != 'pasto'){
                    mapa[i][j].i                = i;
                    mapa[i][j].j                = j;
                    if(dibujoElemento.id != 'kybus' && dibujoElemento.id != 'casa'){
                        mapa[i][j].obstaculo    = 1; 
                    }else if(dibujoElemento.id == 'kybus'){
                        if(kybus.exists == 1){
                            mapa[kybus.i][kybus.j].kybus = 0; 
                            mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                            mapa[kybus.i][kybus.j].objeto = '';
                        }
                        mapa[i][j].kybus = 1;
                        kybus.x          = dibujoElemento.x;
                        kybus.y          = dibujoElemento.y;
                        kybus.i          = i;
                        kybus.j          = j;
                        kybus.exists     = 1;
                    }else{
                        if(casa.exists == 1){
                            mapa[casa.i][casa.j].casa = 0; 
                            mapa[casa.i][casa.j].tipo_obstaculo = '';
                            mapa[casa.i][casa.j].objeto = '';
                        }
                        mapa[i][j].casa  = 1;
                        casa.x           = dibujoElemento.x;
                        casa.y           = dibujoElemento.y;
                        casa.i           = i;
                        casa.j           = j;
                        casa.exists      = 1;
                    }
                    mapa[i][j].tipo_obstaculo   = dibujoElemento.id;
                    elemento                    = document.getElementById(dibujoElemento.id);
                    ruta                        = elemento.src.split('/');
                    imagen                      = new Image();
                    imagen.src                  = ruta[4] + "/" + ruta[5];
                    mapa[i][j].objeto           = imagen;
                }else if(isInside(dibujoElemento,mapa[i][j]) && dibujoElemento.id == 'pasto'){
                    mapa[i][j].obstaculo = 0;
                    if(mapa[i][j].kybus == 1){
                        kybus = {
                            i : 0,
                            j : 0,
                            x : 0,
                            y : 0,
                            exists : 0
                         };
                    }else if(mapa[i][j].casa == 1){
                        casa = {
                            i : 0,
                            j : 0,
                            x : 0,
                            y : 0,
                            exists : 0
                         };
                    }
                    mapa[i][j].kybus = 0;
                    mapa[i][j].casa  = 0;
                    mapa[i][j].tipo_obstaculo = '';
                    mapa[i][j].objeto = '';
                }
            }
        }
        dibujoElemento.x = -50;
        dibujoElemento.y = -50;
    }
}

function drawElements(){
    x = mapa.length;
    y = mapa[0].length;
    for (var i = 0;i < x;i++) {
        for (var j = 0; j < y;j++) {
            if(mapa[i][j].objeto != ''){
                ctx.drawImage(mapa[i][j].objeto,mapa[i][j].x,mapa[i][j].y,32,32);
            }
        }
    }
}

function frameLoop(){
    drawBackground();
    NewElement();
    drawElements();
}

addingKeyBoardEvents();
addingMouseEvents();
loadMedia();