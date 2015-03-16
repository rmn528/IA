//elementos html
var canvas         = document.getElementById('mundo');
var barra          = document.getElementById('barra');
var rangoDibujar   = document.getElementById('textInput');
var dragger1       = document.getElementById('dragger1');
var dragger2       = document.getElementById('dragger2');
var btnRegresar    = document.getElementById('regresar');
var btnInicio      = document.getElementById('inicio');
var pasto          = document.getElementById('pasto');

//contexto
var ctx            = canvas.getContext('2d');

//alamenamiento de enventos
var teclado        = {};
var mouse          = {};

//elemento auxiliar de dibujo
var dibujoElemento = {
                        id: '',
                        x : -50,
                        y : -50
                     };

//objetos del mundo
var kybus          = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0,
                        p : 0,
                        iterador : 0,
                        lastI : 0,
                        lastJ : 0
                     };
var casa           = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0
                     };
var mapa;

//estructuras de datos
var pila;
var pilaIda;
var pilaRegreso;
var visitados;

//bandera para saber si ya llego a su casa
var llegue = false;

//cantidad de obstaculos a dibujar
var cantElementos  = 0;

//setIntervals
var regreso;
var buscando;

//velocidad
var velocidad = 6;

function loadMedia(){
    mapa        = [];
    pila        = [];
    pilaIda     = [];
    pilaRegreso = [];
    visitados   = [];
    for (var i = 0,cordY = 0; cordY < canvas.height; cordY += pasto.height, i++) {
        mapa[i]      = [];
        visitados[i] = [];
    }
    for (var i = 0,cordY = 0; cordY < canvas.height; cordY += pasto.height, i++) {
        for (var j = 0,cordX = 0; cordX < canvas.width; cordX += pasto.width, j++) {
            mapa[i][j] = {
                            i : i,
                            j : j,
                            x : cordX,
                            y : cordY,
                            obstaculo : 0,
                            kybus : 0,
                            casa : 0,
                            tipo_obstaculo : '',
                            objeto : '',
                            objeto_alpha : '',
                            alpha : 0
                         };
            visitados[i][j] = false;
        }
    }
    for (var i = 0,cordY = 0; i < mapa.length; cordY += pasto.height, i++) {
        for (var j = 0,cordX = 0; j < mapa[0].length; cordX += pasto.width, j++) {
            mapa[i][j].i = i;
            mapa[i][j].j = j;
            mapa[i][j].x = cordX;
            mapa[i][j].y = cordY;
        };
    };
    pasto.onload = function(){
        var intervalo = window.setInterval(frameLoop,1000/55);
    }
}

function drawBackground(){
    for (var i = 0; i < mapa.length; i++) {
        for (var j = 0; j < mapa[0].length;  j++) {
            ctx.drawImage(pasto,mapa[i][j].x,mapa[i][j].y);
        };
    };
}

function drawMapElements(){
    var bandera = 1;
    while(cantElementos && buscando == undefined){
        var i       = Math.floor((Math.random() * mapa.length) + 0);
        var j       = Math.floor((Math.random() * mapa[0].length) + 0);
        var elemento = '';
        var ruta     = '';
        var imagen   = '';
        if(mapa[i][j].objeto == ''){
            if(bandera){
                mapa[i][j].tipo_obstaculo   = 'roca';
                elemento                    = document.getElementById('roca');
                bandera                     = 0;
            }else{
                mapa[i][j].tipo_obstaculo   = 'arbol';
                elemento                    = document.getElementById('arbol');
                bandera                     = 1;
            }
            mapa[i][j].obstaculo        = 1;
            mapa[i][j].tipo_obstaculo   = elemento.id;
            ruta                        = elemento.src.split('/');
            imagen                      = new Image();
            imagen.src                  = ruta[4] + "/" + ruta[5];
            mapa[i][j].objeto           = imagen;
            cantElementos--;
        }
    }
}

function isInside(newElement,map){
    if(newElement.x >= map.x && newElement.x < map.x + pasto.height && newElement.y >= map.y && newElement.y < map.y + pasto.width){
        return true;
    }
    return false;
}

function NewElement(){
    if(!jQuery.isEmptyObject(dibujoElemento) && dibujoElemento.x>=0 && dibujoElemento.y>=0 && buscando == undefined){
        for (var i = 0;i < mapa.length;i++) {
            for (var j = 0; j < mapa[0].length;j++) {
                if(isInside(dibujoElemento,mapa[i][j]) && mapa[i][j].objeto == '' && dibujoElemento.id != 'pasto'){
                    var paso =  {
                            i : 0,
                            j : 0
                        };
                    var elemento = '';
                    var ruta     = '';
                    var imagen   = '';
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
                        kybus.lastI      = i;
                        kybus.lastJ      = j;
                        kybus.exists     = 1;
                        paso.i           = kybus.i;
                        paso.j           = kybus.j;
                        pila[0]          = paso;
                        visitados = [];
                        for (var a = 0; a < mapa.length; a++) {
                            visitados[a] = [];
                        }
                        for (var a = 0; a < mapa.length; a++) {
                            for (var b = 0; b < mapa[0].length; b++) {
                                visitados[a][b] = false;
                            }
                        }
                        pilaIda = [];
                        pilaIda[0] = paso; 
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
                    mapa[i][j].obstaculo        = 1;
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
                            exists : 0,
                            p : 0,
                            iterador : 0,
                            lastI : 0,
                            lastJ : 0
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
    for (var i = 0;i < mapa.length;i++) {
        for (var j = 0; j < mapa[0].length;j++) {
            if(mapa[i][j].objeto != ''){
                ctx.drawImage(mapa[i][j].objeto,mapa[i][j].x+3,mapa[i][j].y+2,34,32);
            }else if(mapa[i][j].objeto_alpha != ''){
                ctx.globalAlpha = mapa[i][j].alpha/10;
                ctx.drawImage(mapa[i][j].objeto_alpha,mapa[i][j].x+3,mapa[i][j].y+2,34,32);
                ctx.globalAlpha = 1;
            }
        }
    }
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
    addingEvent(btnRegresar,'click',function(e){
        regreso = setInterval(function(){
            var paso    = pila.pop();
            moveXY(paso.i,paso.j);
        },1000/velocidad);
    });

    addingEvent(btnInicio,'click',function(e){
        if(casa.exists && kybus.exists){
            kybus.dX = Math.abs(casa.i-kybus.i);
            kybus.dY = Math.abs(casa.j-kybus.j);
            if(casa.i > kybus.i){
                kybus.incrementoX = 1;
            }else if(casa.i == kybus.i){
                kybus.incrementoX = 0;
            }else{
                kybus.incrementoX = -1;
            }
            if(kybus.j < casa.j){
                kybus.incrementoY = 1;
            }else if(casa.j == kybus.j){
                kybus.incrementoY = 0;
            }else{
                kybus.incrementoY = -1;
            }
            if(kybus.dX > kybus.dY){
                kybus.p        = 2*kybus.dY-kybus.dX;
                kybus.iterador = kybus.dX;
            }else{
                kybus.p        = 2*kybus.dX-kybus.dY;
                kybus.iterador = kybus.dY;
            }
            for (var i = 0; i < mapa.length; i++) {
                for (var j = 0; j < mapa[0].length;  j++) {
                    mapa[i][j].alpha = 0;
                };
            };
            buscando = setInterval(lineaBres,1000/velocidad);
        }
    });

    addingEvent(barra,'click',function(e){
        e.preventDefault();
        dibujoElemento.id     = e.target.id;
    });

    addingEvent(canvas,'click',function(e){
        e.preventDefault();
        var posicion              = getMousePos(e);
        if(!jQuery.isEmptyObject(dibujoElemento)){
            dibujoElemento.x      = posicion.x -15;
            dibujoElemento.y      = posicion.y -15;
        }
    });

    addingEvent(dragger2,'click',function(e){
        e.preventDefault();
        velocidad = dragger2.value;
    });

    addingEvent(dragger1,'click',function(e){
        var porcentaje    = dragger1.value;
        cantElementos = Math.round(porcentaje*mapa.length*mapa[0].length/100);
        for (var i = 0;i < mapa.length;i++) {
            for (var j = 0; j < mapa[0].length;j++) {
                if(mapa[i][j].tipo_obstaculo == 'kybus'){
                    if(kybus.exists == 1){
                        mapa[kybus.i][kybus.j].kybus = 0; 
                        mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                        mapa[kybus.i][kybus.j].objeto = '';
                        mapa[kybus.i][kybus.j].objeto_alpha = '';
                    }
                    kybus = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0,
                        p : 0,
                        iterador : 0,
                        lastI : 0,
                        lastJ : 0
                    };
                }else if(mapa[i][j].tipo_obstaculo == 'casa'){
                    if(casa.exists == 1){
                        mapa[casa.i][casa.j].casa = 0; 
                        mapa[casa.i][casa.j].tipo_obstaculo = '';
                        mapa[casa.i][casa.j].objeto = '';
                        mapa[casa.i][casa.j].objeto_alpha = '';
                    }
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
                mapa[i][j].objeto_alpha = '';
            }
        }
    });
}

function addingKeyBoardEvents(){
    addingEvent(document,"keydown",function(e){
        //ponemos en true la tecla presionada
        teclado[e.keyCode] = true;
        move();
    });

    addingEvent(document,"keyup",function(e){
        //ponemos en false la tecla presionada
        teclado[e.keyCode] = false;
    });
}

function move(){
    if(kybus.exists == 1){
        if(teclado[38]){
            if(kybus.i - 1 >=0 && mapa[kybus.i - 1][kybus.j].objeto == ''){
                mapa[kybus.i][kybus.j].kybus = 0;
                mapa[kybus.i][kybus.j].casa  = 0;
                mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                mapa[kybus.i][kybus.j].objeto = '';
                kybus.i = kybus.i - 1;
                kybus.x = mapa[kybus.i][kybus.j].x;
                kybus.y = mapa[kybus.i][kybus.j].y;
            }
        }else if(teclado[40]){
            if(kybus.i + 1 <= mapa.length -1 && mapa[kybus.i + 1][kybus.j].objeto == ''){
                mapa[kybus.i][kybus.j].kybus = 0;
                mapa[kybus.i][kybus.j].casa  = 0;
                mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                mapa[kybus.i][kybus.j].objeto = '';
                kybus.i = kybus.i + 1;
                kybus.x = mapa[kybus.i][kybus.j].x;
                kybus.y = mapa[kybus.i][kybus.j].y;
            }
        }else if(teclado[37]){
            if(kybus.j - 1 >=0 && mapa[kybus.i][kybus.j - 1].objeto == ''){
                mapa[kybus.i][kybus.j].kybus = 0;
                mapa[kybus.i][kybus.j].casa  = 0;
                mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                mapa[kybus.i][kybus.j].objeto = '';
                kybus.j = kybus.j - 1;
                kybus.x = mapa[kybus.i][kybus.j].x;
                kybus.y = mapa[kybus.i][kybus.j].y;
            }
        }else if(teclado[39]){
            if(kybus.j + 1 <= mapa[0].length-1 && mapa[kybus.i][kybus.j + 1].objeto == ''){
                mapa[kybus.i][kybus.j].kybus = 0;
                mapa[kybus.i][kybus.j].casa  = 0;
                mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                mapa[kybus.i][kybus.j].objeto = '';
                kybus.j = kybus.j + 1;
                kybus.x = mapa[kybus.i][kybus.j].x;
                kybus.y = mapa[kybus.i][kybus.j].y;
            }
        }
        if((teclado[37] || teclado[39] || teclado[38] || teclado[40]) && mapa[kybus.i][kybus.j].objeto == ''){
            mapa[kybus.i][kybus.j].kybus            = 1;
            mapa[kybus.i][kybus.j].tipo_obstaculo   = 'kybus';
            var elemento                            = document.getElementById('kybus');
            var ruta                                = elemento.src.split('/');
            var imagen                              = new Image();
            imagen.src                              = ruta[4] + "/" + ruta[5];
            mapa[kybus.i][kybus.j].objeto           = imagen;
            var paso =  {
                        i : 0,
                        j : 0
                    };
            paso.i = kybus.i;
            paso.j = kybus.j;
            pila.push(paso);
        }
    }
}

function moveXY(i,j){
    if(mapa[i][j].objeto == ''){
        mapa[kybus.i][kybus.j].kybus          = 0;
        mapa[kybus.i][kybus.j].casa           = 0;
        mapa[kybus.i][kybus.j].tipo_obstaculo = '';
        mapa[kybus.i][kybus.j].objeto         = '';
        kybus.i = i;
        kybus.j = j;
        kybus.x = mapa[i][j].x;
        kybus.y = mapa[i][j].y;
        mapa[kybus.i][kybus.j].kybus            = 1;
        mapa[kybus.i][kybus.j].tipo_obstaculo   = 'kybus';
        var elemento                            = document.getElementById('kybus');
        var ruta                                = elemento.src.split('/');
        var imagen                              = new Image();
        imagen.src                              = ruta[4] + "/" + ruta[5];
        mapa[kybus.i][kybus.j].objeto           = imagen;
    }
    if(pila.length<=0){
        var paso =  {
            i : 0,
            j : 0
        };
        paso.i           = i;
        paso.j           = j;
        pila[0]          = paso;
        clearInterval(regreso);
    }
}

function eightDirections(cordenadaU, cordenadaA, cordenadaS, bandera){
    if(cordenadaA.i-1 >= 0 && cordenadaA.j-1 >= 0 && 
    (mapa[cordenadaA.i-1][cordenadaA.j-1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i-1][cordenadaA.j-1].objeto_alpha != '' 
        && mapa[cordenadaA.i-1][cordenadaA.j-1].alpha < 10)) &&
    !(cordenadaA.i-1 == cordenadaU.i && cordenadaA.j-1 == cordenadaU.j)){
        cordenadaS.i = cordenadaA.i-1;
        cordenadaS.j = cordenadaA.j-1;
        
    }
    if(cordenadaA.i-1 >= 0 &&
    (mapa[cordenadaA.i-1][cordenadaA.j].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i-1][cordenadaA.j].objeto_alpha != '' 
        && mapa[cordenadaA.i-1][cordenadaA.j].alpha < 10)) &&
    !(cordenadaA.i-1 == cordenadaU.i && cordenadaA.j == cordenadaU.j)){
        cordenadaS.i = cordenadaA.i-1;
        cordenadaS.j = cordenadaA.j; 
        
    }
    if(cordenadaA.i-1 >= 0 && cordenadaA.j+1 < mapa[0].length &&
    (mapa[cordenadaA.i-1][cordenadaA.j+1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i-1][cordenadaA.j+1].objeto_alpha != '' 
        && mapa[cordenadaA.i-1][cordenadaA.j+1].alpha < 10)) &&
    !(cordenadaA.i-1 == cordenadaU.i && cordenadaA.j+1 == cordenadaU.j)){
        cordenadaS.i = cordenadaA.i-1;
        cordenadaS.j = cordenadaA.j+1; 
        
    }
    if(cordenadaA.j+1 < mapa[0].length &&
    (mapa[cordenadaA.i][cordenadaA.j+1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i][cordenadaA.j+1].objeto_alpha != '' 
        && mapa[cordenadaA.i][cordenadaA.j+1].alpha < 10)) &&
    !(cordenadaA.i == cordenadaU.i && cordenadaA.j+1 == cordenadaU.j)){
        cordenadaS.i = cordenadaA.i;
        cordenadaS.j = cordenadaA.j+1; 
        
    }
    if(cordenadaA.i+1 < mapa.length && cordenadaA.j+1 < mapa[0].length &&
    (mapa[cordenadaA.i+1][cordenadaA.j+1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i+1][cordenadaA.j+1].objeto_alpha != '' 
        && mapa[cordenadaA.i+1][cordenadaA.j+1].alpha < 10)) &&
    !(cordenadaA.i+1 == cordenadaU.i && cordenadaA.j+1 == cordenadaU.j)){
        cordenadaS.i = cordenadaA.i+1;
        cordenadaS.j = cordenadaA.j+1; 
        
    }
    if(cordenadaA.i+1 < mapa.length && 
    (mapa[cordenadaA.i+1][cordenadaA.j].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i+1][cordenadaA.j].objeto_alpha != '' 
        && mapa[cordenadaA.i+1][cordenadaA.j].alpha < 10)) &&
    !(cordenadaA.i+1 == cordenadaU.i && cordenadaA.j == cordenadaU.j)){
        cordenadaS.i = cordenadaA.i+1;
        cordenadaS.j = cordenadaA.j; 
    }
    if(cordenadaA.i+1 < mapa.length && cordenadaA.j-1 >= 0 && 
    (mapa[cordenadaA.i+1][cordenadaA.j-1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i+1][cordenadaA.j-1].objeto_alpha != '' 
        && mapa[cordenadaA.i+1][cordenadaA.j-1].alpha < 10)) &&
    !(cordenadaA.i+1 == cordenadaU.i && cordenadaA.j-1 == cordenadaU.j)){
        cordenadaS.i = cordenadaA.i+1;
        cordenadaS.j = cordenadaA.j-1; 
    }
    if(cordenadaA.j-1 >= 0 &&
    (mapa[cordenadaA.i][cordenadaA.j-1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i][cordenadaA.j-1].objeto_alpha != '' 
        && mapa[cordenadaA.i][cordenadaA.j-1].alpha < 10)) &&
    !(cordenadaA.i == cordenadaU.i && cordenadaA.j-1 == cordenadaU.j)){
        cordenadaS.i = cordenadaA.i;
        cordenadaS.j = cordenadaA.j-1;
    }
    return cordenadaS;
}

function libre(cordenadaA){
    cordenadaS = cordenadaA;
    if(cordenadaA.i-1 >= 0 && cordenadaA.j-1 >= 0 && 
    (mapa[cordenadaA.i-1][cordenadaA.j-1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i-1][cordenadaA.j-1].objeto_alpha != '' 
        && mapa[cordenadaA.i-1][cordenadaA.j-1].alpha < 10))){
        cordenadaS.i = cordenadaA.i-1;
        cordenadaS.j = cordenadaA.j-1;
        
    }
    if(cordenadaA.i-1 >= 0 &&
    (mapa[cordenadaA.i-1][cordenadaA.j].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i-1][cordenadaA.j].objeto_alpha != '' 
        && mapa[cordenadaA.i-1][cordenadaA.j].alpha < 10))){
        cordenadaS.i = cordenadaA.i-1;
        cordenadaS.j = cordenadaA.j; 
        
    }
    if(cordenadaA.i-1 >= 0 && cordenadaA.j+1 < mapa[0].length &&
    (mapa[cordenadaA.i-1][cordenadaA.j+1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i-1][cordenadaA.j+1].objeto_alpha != '' 
        && mapa[cordenadaA.i-1][cordenadaA.j+1].alpha < 10))){
        cordenadaS.i = cordenadaA.i-1;
        cordenadaS.j = cordenadaA.j+1; 
        
    }
    if(cordenadaA.j+1 < mapa[0].length &&
    (mapa[cordenadaA.i][cordenadaA.j+1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i][cordenadaA.j+1].objeto_alpha != '' 
        && mapa[cordenadaA.i][cordenadaA.j+1].alpha < 10))){
        cordenadaS.i = cordenadaA.i;
        cordenadaS.j = cordenadaA.j+1; 
        
    }
    if(cordenadaA.i+1 < mapa.length && cordenadaA.j+1 < mapa[0].length &&
    (mapa[cordenadaA.i+1][cordenadaA.j+1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i+1][cordenadaA.j+1].objeto_alpha != '' 
        && mapa[cordenadaA.i+1][cordenadaA.j+1].alpha < 10))){
        cordenadaS.i = cordenadaA.i+1;
        cordenadaS.j = cordenadaA.j+1; 
        
    }
    if(cordenadaA.i+1 < mapa.length && 
    (mapa[cordenadaA.i+1][cordenadaA.j].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i+1][cordenadaA.j].objeto_alpha != '' 
        && mapa[cordenadaA.i+1][cordenadaA.j].alpha < 10))){
        cordenadaS.i = cordenadaA.i+1;
        cordenadaS.j = cordenadaA.j; 
    }
    if(cordenadaA.i+1 < mapa.length && cordenadaA.j-1 >= 0 && 
    (mapa[cordenadaA.i+1][cordenadaA.j-1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i+1][cordenadaA.j-1].objeto_alpha != '' 
        && mapa[cordenadaA.i+1][cordenadaA.j-1].alpha < 10))){
        cordenadaS.i = cordenadaA.i+1;
        cordenadaS.j = cordenadaA.j-1; 
    }
    if(cordenadaA.j-1 >= 0 &&
    (mapa[cordenadaA.i][cordenadaA.j-1].tipo_obstaculo == '' || 
    (mapa[cordenadaA.i][cordenadaA.j-1].objeto_alpha != '' 
        && mapa[cordenadaA.i][cordenadaA.j-1].alpha < 10))){
        cordenadaS.i = cordenadaA.i;
        cordenadaS.j = cordenadaA.j-1;
    }
    return cordenadaS;
}

function lineaBres(){
    var aux = {i : 0,j : 0};
    var auxUlt = {i : 0,j : 0};
    auxUlt.i = kybus.lastI;
    auxUlt.j = kybus.lastJ;
    kybus.lastI = kybus.i;
    kybus.lastJ = kybus.j;
    if(kybus.dX > kybus.dY){
        if(kybus.iterador){
            kybus.i+= kybus.incrementoX;
            if(kybus.p<0){
                kybus.p+= 2*kybus.dY;
            }else{
                kybus.p+= 2*kybus.dY-2*kybus.dX;
                kybus.j+= kybus.incrementoY;
            }
            if(mapa[kybus.i][kybus.j].tipo_obstaculo != '' || 
                (mapa[kybus.i][kybus.j].alpha >=10 && mapa[kybus.i][kybus.j].objeto_alpha != '')){
                aux.i = kybus.i;
                aux.j = kybus.j;
                var cordenada = eightDirections(auxUlt,{i : kybus.lastI, j: kybus.lastJ},{i : kybus.i, j: kybus.j},0);
                if(cordenada.i == kybus.i && cordenada.j == kybus.j){
                    if(mapa[auxUlt.i][auxUlt.j].tipo_obstaculo == '' ||
                    (mapa[auxUlt.i][auxUlt.j].objeto_alpha != '' 
                    && mapa[auxUlt.i][auxUlt.j].alpha < 10)){
                        cordenada.i = auxUlt.i;
                        cordenada.j = auxUlt.j;
                    }else{
                        cordenada.i = kybus.lastI;
                        cordenada.j = kybus.lastJ;
                        clearInterval(buscando);
                        buscando = undefined;
                    }
                }
                kybus.i = cordenada.i;
                kybus.j = cordenada.j;
                kybus.dX = Math.abs(casa.i-kybus.i);
                kybus.dY = Math.abs(casa.j-kybus.j);
                if(casa.i > kybus.i){
                    kybus.incrementoX = 1;
                }else if(casa.i == kybus.i){
                    kybus.incrementoX = 0;
                }else{
                    kybus.incrementoX = -1;
                }
                if(kybus.j < casa.j){
                    kybus.incrementoY = 1;
                }else if(casa.j == kybus.j){
                    kybus.incrementoY = 0;
                }else{
                    kybus.incrementoY = -1;
                }
                if(kybus.dX > kybus.dY){
                    kybus.p        = 2*kybus.dY-kybus.dX;
                    kybus.iterador = kybus.dX;
                }else{
                    kybus.p        = 2*kybus.dX-kybus.dY;
                    kybus.iterador = kybus.dY;
                }
            }
            mapa[kybus.lastI][kybus.lastJ].kybus          = 0;
            mapa[kybus.lastI][kybus.lastJ].casa           = 0;
            mapa[kybus.lastI][kybus.lastJ].objeto         = '';
            mapa[kybus.lastI][kybus.lastJ].tipo_obstaculo = '';
            if(mapa[kybus.lastI][kybus.lastJ].objeto_alpha == ''){
                var elemento = '';
                var ruta     = '';
                var imagen   = '';
                elemento                                        = document.getElementById('arbol');
                mapa[kybus.lastI][kybus.lastJ].alpha            = 1;
                ruta                                            = elemento.src.split('/');
                imagen                                          = new Image();
                imagen.src                                      = ruta[4] + "/" + ruta[5];
                mapa[kybus.lastI][kybus.lastJ].objeto_alpha     = imagen;
            }else{
                if(mapa[kybus.lastI][kybus.lastJ].alpha < 10){
                    mapa[kybus.lastI][kybus.lastJ].alpha+= 2;
                }else{
                    mapa[kybus.lastI][kybus.lastJ].tipo_obstaculo   = 'arbol';
                }
            }
            kybus.x = mapa[kybus.i][kybus.j].x;
            kybus.y = mapa[kybus.i][kybus.j].y;
            mapa[kybus.i][kybus.j].kybus            = 1;
            mapa[kybus.i][kybus.j].tipo_obstaculo   = 'kybus';
            var elemento                            = document.getElementById('kybus');
            var ruta                                = elemento.src.split('/');
            var imagen                              = new Image();
            imagen.src                              = ruta[4] + "/" + ruta[5];
            mapa[kybus.i][kybus.j].objeto           = imagen;
            kybus.iterador--;

        }else{
            clearInterval(buscando);
            buscando = undefined;
        }
    }else{
        if(kybus.iterador){
            kybus.j+= kybus.incrementoY;
            if(kybus.p < 0){
                kybus.p+= 2*kybus.dX;
            }else{
                kybus.p+= 2*kybus.dX-2*kybus.dY;
                kybus.i+= kybus.incrementoX;
            }
            if(mapa[kybus.i][kybus.j].tipo_obstaculo != '' || 
                (mapa[kybus.i][kybus.j].alpha >=10 && mapa[kybus.i][kybus.j].objeto_alpha != '')){
                aux.i = kybus.i;
                aux.j = kybus.j;
                var cordenada = eightDirections(auxUlt,{i : kybus.lastI, j: kybus.lastJ},{i : kybus.i, j: kybus.j},0);
                if(cordenada.i == kybus.i && cordenada.j == kybus.j){
                    if(mapa[auxUlt.i][auxUlt.j].tipo_obstaculo == '' ||
                    (mapa[auxUlt.i][auxUlt.j].objeto_alpha != '' 
                    && mapa[auxUlt.i][auxUlt.j].alpha < 10)){
                        cordenada.i = auxUlt.i;
                        cordenada.j = auxUlt.j;
                    }else{
                        cordenada.i = kybus.lastI;
                        cordenada.j = kybus.lastJ;
                        clearInterval(buscando);
                        buscando = undefined;
                    }
                }
                kybus.i = cordenada.i;
                kybus.j = cordenada.j;
                kybus.dX = Math.abs(casa.i-kybus.i);
                kybus.dY = Math.abs(casa.j-kybus.j);
                if(casa.i > kybus.i){
                    kybus.incrementoX = 1;
                }else if(casa.i == kybus.i){
                    kybus.incrementoX = 0;
                }else{
                    kybus.incrementoX = -1;
                }
                if(kybus.j < casa.j){
                    kybus.incrementoY = 1;
                }else if(casa.j == kybus.j){
                    kybus.incrementoY = 0;
                }else{
                    kybus.incrementoY = -1;
                }
                if(kybus.dX > kybus.dY){
                    kybus.p        = 2*kybus.dY-kybus.dX;
                    kybus.iterador = kybus.dX;
                }else{
                    kybus.p        = 2*kybus.dX-kybus.dY;
                    kybus.iterador = kybus.dY;
                }
            }
            mapa[kybus.lastI][kybus.lastJ].kybus          = 0;
            mapa[kybus.lastI][kybus.lastJ].casa           = 0;
            mapa[kybus.lastI][kybus.lastJ].objeto         = '';
            mapa[kybus.lastI][kybus.lastJ].tipo_obstaculo = '';
            if(mapa[kybus.lastI][kybus.lastJ].objeto_alpha == ''){
                var elemento = '';
                var ruta     = '';
                var imagen   = '';
                elemento                                        = document.getElementById('arbol');
                mapa[kybus.lastI][kybus.lastJ].alpha            = 1;
                ruta                                            = elemento.src.split('/');
                imagen                                          = new Image();
                imagen.src                                      = ruta[4] + "/" + ruta[5];
                mapa[kybus.lastI][kybus.lastJ].objeto_alpha     = imagen;
            }else{
                if(mapa[kybus.lastI][kybus.lastJ].alpha < 10){
                    mapa[kybus.lastI][kybus.lastJ].alpha+= 2;
                }else{
                    mapa[kybus.lastI][kybus.lastJ].tipo_obstaculo   = 'arbol';
                }
            }
            kybus.x = mapa[kybus.i][kybus.j].x;
            kybus.y = mapa[kybus.i][kybus.j].y;
            mapa[kybus.i][kybus.j].kybus            = 1;
            mapa[kybus.i][kybus.j].tipo_obstaculo   = 'kybus';
            var elemento                            = document.getElementById('kybus');
            var ruta                                = elemento.src.split('/');
            var imagen                              = new Image();
            imagen.src                              = ruta[4] + "/" + ruta[5];
            mapa[kybus.i][kybus.j].objeto           = imagen;
            kybus.iterador--;
        }else{
            clearInterval(buscando);
            buscando = undefined;
        }
    }
}

function profundidad(){
    var actual;
    var paso = pilaIda.pop();
    if(paso != undefined){
        
        var x    = paso.i;
        var y    = paso.j;
        if(casa.i == x && casa.j == y) {
            llegue  = true;
            mapa[kybus.i][kybus.j].kybus          = 0;
            mapa[kybus.i][kybus.j].casa           = 0;
            mapa[kybus.i][kybus.j].tipo_obstaculo = '';
            mapa[kybus.i][kybus.j].objeto         = '';
            kybus.i = x;
            kybus.j = y;
            kybus.x = mapa[x][y].x;
            kybus.y = mapa[x][y].y;
            mapa[kybus.i][kybus.j].kybus            = 1;
            mapa[kybus.i][kybus.j].tipo_obstaculo   = 'kybus';
            var elemento                            = document.getElementById('kybus');
            var ruta                                = elemento.src.split('/');
            var imagen                              = new Image();
            imagen.src                              = ruta[4] + "/" + ruta[5];
            mapa[kybus.i][kybus.j].objeto           = imagen;
            clearInterval(buscando);
            buscando = undefined;
            pilaIda = [];
            pilaIda.push({i : kybus.i,j : kybus.j});
            pila[0] = {i : kybus.i,j : kybus.j};
        }
        mapa[kybus.i][kybus.j].kybus          = 0;
        mapa[kybus.i][kybus.j].casa           = 0;
        mapa[kybus.i][kybus.j].tipo_obstaculo = '';
        mapa[kybus.i][kybus.j].objeto         = '';
        kybus.i = x;
        kybus.j = y;
        kybus.x = mapa[x][y].x;
        kybus.y = mapa[x][y].y;
        mapa[kybus.i][kybus.j].kybus            = 1;
        mapa[kybus.i][kybus.j].tipo_obstaculo   = 'kybus';
        var elemento                            = document.getElementById('kybus');
        var ruta                                = elemento.src.split('/');
        var imagen                              = new Image();
        imagen.src                              = ruta[4] + "/" + ruta[5];
        mapa[kybus.i][kybus.j].objeto           = imagen;
        visitados[x][y] = true;
        if(x+1 < mapa.length && (mapa[x+1][y].tipo_obstaculo == '' || mapa[x+1][y].tipo_obstaculo == 'casa') && visitados[x+1][y] == false){
            pilaIda.push({i : x+1,j : y});
        }
        if(y+1 < mapa[0].length && (mapa[x][y+1].tipo_obstaculo == '' || mapa[x][y+1].tipo_obstaculo == 'casa') && visitados[x][y+1] == false){
            pilaIda.push({i : x,j : y+1});
        }
        if(x-1 >= 0 && (mapa[x-1][y].tipo_obstaculo == '' || mapa[x-1][y].tipo_obstaculo == 'casa') && visitados[x-1][y] == false){
            pilaIda.push({i : x-1,j : y});
        }
        if(y-1 >= 0 && (mapa[x][y-1].tipo_obstaculo == '' || mapa[x][y-1].tipo_obstaculo == 'casa') && visitados[x][y-1] == false){
            pilaIda.push({i : x,j : y-1});
        }
    }else{
        if(pilaIda.length<=0){
            pilaIda = [];
            pilaIda.push({i : kybus.i,j : kybus.j});
            pila[0] = {i : kybus.i,j : kybus.j};
            clearInterval(buscando);
            buscando = undefined; 
        }
    }
}

function frameLoop(){
    drawBackground();
    drawMapElements();
    NewElement();
    drawElements();
}


addingKeyBoardEvents();
addingMouseEvents();
loadMedia();