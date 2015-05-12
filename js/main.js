//elementos html
var canvas         = document.getElementById('mundo');
var barra          = document.getElementById('barra');
var rangoDibujar   = document.getElementById('textInput');
var dragger1       = document.getElementById('dragger1');
var dragger2       = document.getElementById('dragger2');
var btnRegresar    = document.getElementById('regresar');
var btnInicio      = document.getElementById('inicio');
var pasto          = document.getElementById('pasto');
var anillos        = document.getElementById('anillos');
var barras         = document.getElementById('barras');
var zigzag         = document.getElementById('zigzag');
var ciclos         = document.getElementById('ciclos');

//contexto
var ctx            = canvas.getContext('2d');

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
                        origenI : 0,
                        origenJ : 0,
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

//cantidad de obstaculos a dibujar
var cantElementos  = 0;

//setIntervals
var buscando;

//velocidad
var velocidad = 6;

var ciclosTotales = 3;

var matrizAdyacencia;
var tamMatrizAdyacencia;
var cantidadNodos = 1;

function loadMedia(){
    mapa        = [];
    for (var i = 0,cordY = 0; cordY < canvas.height; cordY += pasto.height, i++) {
        mapa[i] = [];
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
                            visitado : false
                         };
        }
    }
    for (var i = 0,cordY = 0; i < mapa.length; cordY += pasto.height, i++) {
        for (var j = 0,cordX = 0; j < mapa[0].length; cordX += pasto.width, j++) {
            mapa[i][j].i = i;
            mapa[i][j].j = j;
            mapa[i][j].x = cordX;
            mapa[i][j].y = cordY;
        }
    }
    tamMatrizAdyacencia = mapa.length * mapa[0].length;
    matrizAdyacencia    = [];
    for (var i = 1; i <= tamMatrizAdyacencia; i++) {
        matrizAdyacencia[i] = [];
        for (var j = 1; j <= tamMatrizAdyacencia; j++) {
            matrizAdyacencia[i][j] = {
                                        costo : Number.MAX_VALUE/2,
                                        conectado : false
                                     }
        }
    }
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
    //var bandera = 1;
    while(cantElementos && buscando == undefined){
        var i       = Math.floor((Math.random() * mapa.length) + 0);
        var j       = Math.floor((Math.random() * mapa[0].length) + 0);
        var elemento = '';
        var ruta     = '';
        var imagen   = '';
        if(mapa[i][j].objeto == ''){
            //if(bandera){
                mapa[i][j].tipo_obstaculo   = 'roca';
                elemento                    = document.getElementById('roca');
                //bandera                     = 0;
            /*}else{
                mapa[i][j].tipo_obstaculo   = 'arbol';
                elemento                    = document.getElementById('arbol');
                bandera                     = 1;
            }*/
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
    var nodoPos;
    if(!jQuery.isEmptyObject(dibujoElemento) && dibujoElemento.x>=0 && dibujoElemento.y>=0 && buscando == undefined){
        for (var i = 0;i < mapa.length;i++) {
            for (var j = 0; j < mapa[0].length;j++) {
                if(isInside(dibujoElemento,mapa[i][j]) && mapa[i][j].objeto == '' && dibujoElemento.id != 'pasto'){
                    var elemento = '';
                    var ruta     = '';
                    var imagen   = '';
                    mapa[i][j].i                = i;
                    mapa[i][j].j                = j;
                    if(dibujoElemento.id != 'kybus' && dibujoElemento.id != 'casa'){
                        mapa[i][j].obstaculo    = 1; 
                    }else if(dibujoElemento.id == 'kybus'){
                        if(kybus.exists == 1){
                            nodoPos          = (kybus.i+1) * (kybus.j+1);
                            matrizAdyacencia[nodoPos][nodoPos].conectado = false;
                            mapa[kybus.i][kybus.j].kybus = 0; 
                            mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                            mapa[kybus.i][kybus.j].objeto = '';
                        }
                        mapa[i][j].kybus = 1;
                        kybus.x          = dibujoElemento.x;
                        kybus.y          = dibujoElemento.y;
                        kybus.i          = i;
                        kybus.j          = j;
                        kybus.origenI    = i;
                        kybus.origenJ    = j;
                        kybus.lastI      = i;
                        kybus.lastJ      = j;
                        kybus.exists     = 1;
                        nodoPos          = (kybus.i+1) * (kybus.j+1);
                        matrizAdyacencia[nodoPos][nodoPos].conectado = true;
                    }else{
                        if(casa.exists == 1){
                            nodoPos          = (casa.i+1) * (casa.j+1);
                            matrizAdyacencia[nodoPos][nodoPos].conectado = false;
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
                        nodoPos          = (casa.i+1) * (casa.j+1);
                        matrizAdyacencia[nodoPos][nodoPos].conectado = true;
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
                        nodoPos          = (kybus.i+1) * (kybus.j+1);
                        matrizAdyacencia[nodoPos][nodoPos].conectado = false;
                        kybus = {
                            i : 0,
                            j : 0,
                            origenI : 0,
                            origenJ : 0,
                            x : 0,
                            y : 0,
                            exists : 0,
                            p : 0,
                            iterador : 0,
                            lastI : 0,
                            lastJ : 0
                         };
                    }else if(mapa[i][j].casa == 1){
                        nodoPos          = (casa.i+1) * (casa.j+1);
                        matrizAdyacencia[nodoPos][nodoPos].conectado = false;
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
                    mapa[i][j].objeto = '';
                    mapa[i][j].visitado = false;
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
    addingEvent(barras,'click',function(e){
        for (var i = 0;i < mapa.length;i++) {
            for (var j = 0; j < mapa[0].length;j++) {
                if(mapa[i][j].tipo_obstaculo == 'kybus'){
                    if(kybus.exists == 1){
                        mapa[kybus.i][kybus.j].kybus = 0; 
                        mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                        mapa[kybus.i][kybus.j].objeto = '';
                    }
                    kybus = {
                        i : 0,
                        j : 0,
                        origenI : 0,
                        origenJ : 0,
                        x : 0,
                        y : 0,
                        exists : 0,
                        p : 0,
                        iterador : 0,
                    };
                }else if(mapa[i][j].tipo_obstaculo == 'casa'){
                    if(casa.exists == 1){
                        mapa[casa.i][casa.j].casa = 0; 
                        mapa[casa.i][casa.j].tipo_obstaculo = '';
                        mapa[casa.i][casa.j].objeto = '';
                    }
                    casa = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0
                    };
                }
                mapa[i][j].kybus          = 0;
                mapa[i][j].casa           = 0;
                mapa[i][j].tipo_obstaculo = '';
                mapa[i][j].objeto         = '';
                mapa[i][j].visitado       = false;
            }
        }
        var dibujo = [
                    [0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0],
                    [0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0],
                    [0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0]
                 ];
        dibujarMapas(dibujo);
    });
    
    addingEvent(anillos,'click',function(e){
        for (var i = 0;i < mapa.length;i++) {
            for (var j = 0; j < mapa[0].length;j++) {
                if(mapa[i][j].tipo_obstaculo == 'kybus'){
                    if(kybus.exists == 1){
                        mapa[kybus.i][kybus.j].kybus = 0; 
                        mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                        mapa[kybus.i][kybus.j].objeto = '';
                    }
                    kybus = {
                        i : 0,
                        j : 0,
                        origenI : 0,
                        origenJ : 0,
                        x : 0,
                        y : 0,
                        exists : 0,
                        p : 0,
                        iterador : 0,
                    };
                }else if(mapa[i][j].tipo_obstaculo == 'casa'){
                    if(casa.exists == 1){
                        mapa[casa.i][casa.j].casa = 0; 
                        mapa[casa.i][casa.j].tipo_obstaculo = '';
                        mapa[casa.i][casa.j].objeto = '';
                    }
                    casa = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0
                    };
                }
                mapa[i][j].kybus          = 0;
                mapa[i][j].casa           = 0;
                mapa[i][j].tipo_obstaculo = '';
                mapa[i][j].objeto         = '';
                mapa[i][j].visitado       = false;
            }
        }
        var dibujo = [
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
                    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
                    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
                    [0,0,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0],
                    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
                    [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
                    [0,0,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                 ];
        dibujarMapas(dibujo);
    });
    
    addingEvent(zigzag,'click',function(e){
        for (var i = 0;i < mapa.length;i++) {
            for (var j = 0; j < mapa[0].length;j++) {
                if(mapa[i][j].tipo_obstaculo == 'kybus'){
                    if(kybus.exists == 1){
                        mapa[kybus.i][kybus.j].kybus = 0; 
                        mapa[kybus.i][kybus.j].tipo_obstaculo = '';
                        mapa[kybus.i][kybus.j].objeto = '';
                    }
                    kybus = {
                        i : 0,
                        j : 0,
                        origenI : 0,
                        origenJ : 0,
                        x : 0,
                        y : 0,
                        exists : 0,
                        p : 0,
                        iterador : 0,
                    };
                }else if(mapa[i][j].tipo_obstaculo == 'casa'){
                    if(casa.exists == 1){
                        mapa[casa.i][casa.j].casa = 0; 
                        mapa[casa.i][casa.j].tipo_obstaculo = '';
                        mapa[casa.i][casa.j].objeto = '';
                    }
                    casa = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0
                    };
                }
                mapa[i][j].kybus          = 0;
                mapa[i][j].casa           = 0;
                mapa[i][j].tipo_obstaculo = '';
                mapa[i][j].objeto         = '';
                mapa[i][j].visitado       = false;
            }
        }
        var dibujo = [
                    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
                    [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
                    [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                    [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
                    [0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                 ];
        dibujarMapas(dibujo);
    });

    addingEvent(btnInicio,'click',function(e){
        if(casa.exists && kybus.exists){
            auxUlt   = {i : 0,j : 0};
            buscando = setInterval(training,1000/velocidad);
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

    addingEvent(ciclos,'click',function(e){
        e.preventDefault();
        ciclosTotales = ciclos.value;
        console.log(ciclosTotales);
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
                    }
                    kybus = {
                        i : 0,
                        j : 0,
                        origenI : 0,
                        origenJ : 0,
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
                    }
                    casa = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0
                    };
                }
                mapa[i][j].kybus          = 0;
                mapa[i][j].casa           = 0;
                mapa[i][j].tipo_obstaculo = '';
                mapa[i][j].objeto         = '';
                mapa[i][j].visitado       = false;
            }
        }
    });
}

function eightDirections(cordenadaU ,cordenadaA, cordenadaS){
    var nodoPosViejo;
    var nodoPosNuevo;
    var cordenadaMin = {
                            i : -1,
                            j : -1
                        }; 
    nodoPosViejo = (cordenadaA.i+1) * (cordenadaA.j+1);
    nodoPosNuevo = (cordenadaA.i-1+1) * (cordenadaA.j+1);           
    if(cordenadaA.i-1 >= 0 && mapa[cordenadaA.i-1][cordenadaA.j].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i-1 == cordenadaU.i && cordenadaA.j == cordenadaU.j) &&
    !matrizAdyacencia[nodoPosViejo][nodoPosNuevo].conectado ) {
        cordenadaMin.i = cordenadaA.i-1;
        cordenadaMin.j = cordenadaA.j;
    }

    nodoPosViejo = (cordenadaA.i+1) * (cordenadaA.j+1);
    nodoPosNuevo = (cordenadaA.i+1) * (cordenadaA.j+1+1); 
    if(cordenadaA.j+1 < mapa[0].length && mapa[cordenadaA.i][cordenadaA.j+1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i == cordenadaU.i && cordenadaA.j+1 == cordenadaU.j) &&
    !matrizAdyacencia[nodoPosViejo][nodoPosNuevo].conectado ) {
        cordenadaMin.i = cordenadaA.i;
        cordenadaMin.j = cordenadaA.j+1;
        
    }

    nodoPosViejo = (cordenadaA.i+1) * (cordenadaA.j+1);
    nodoPosNuevo = (cordenadaA.i+1+1) * (cordenadaA.j+1); 
    if(cordenadaA.i+1 < mapa.length && mapa[cordenadaA.i+1][cordenadaA.j].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i+1 == cordenadaU.i && cordenadaA.j == cordenadaU.j) &&
    !matrizAdyacencia[nodoPosViejo][nodoPosNuevo].conectado ) {
        cordenadaMin.i = cordenadaA.i+1;
        cordenadaMin.j = cordenadaA.j;
    }

    nodoPosViejo = (cordenadaA.i+1) * (cordenadaA.j+1);
    nodoPosNuevo = (cordenadaA.i+1) * (cordenadaA.j-1+1); 
    if(cordenadaA.j-1 >= 0 && mapa[cordenadaA.i][cordenadaA.j-1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i == cordenadaU.i && cordenadaA.j-1 == cordenadaU.j) &&
    !matrizAdyacencia[nodoPosViejo][nodoPosNuevo].conectado ) {
        cordenadaMin.i = cordenadaA.i;
        cordenadaMin.j = cordenadaA.j-1;
    }

    nodoPosViejo = (cordenadaA.i+1) * (cordenadaA.j+1);
    nodoPosNuevo = (cordenadaA.i-1+1) * (cordenadaA.j-1+1); 
    if(cordenadaA.i-1 >= 0 && cordenadaA.j-1 >= 0 && mapa[cordenadaA.i-1][cordenadaA.j-1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i-1 == cordenadaU.i && cordenadaA.j-1 == cordenadaU.j) &&
    !matrizAdyacencia[nodoPosViejo][nodoPosNuevo].conectado ) {
        cordenadaMin.i = cordenadaA.i-1;
        cordenadaMin.j = cordenadaA.j-1;
        
    }

    nodoPosViejo = (cordenadaA.i+1) * (cordenadaA.j+1);
    nodoPosNuevo = (cordenadaA.i-1+1) * (cordenadaA.j+1+1); 
    if(cordenadaA.i-1 >= 0 && cordenadaA.j+1 < mapa[0].length && 
        mapa[cordenadaA.i-1][cordenadaA.j+1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i-1 == cordenadaU.i && cordenadaA.j+1 == cordenadaU.j) &&
    !matrizAdyacencia[nodoPosViejo][nodoPosNuevo].conectado ) {
        cordenadaMin.i = cordenadaA.i-1;
        cordenadaMin.j = cordenadaA.j+1;
        
    }

    nodoPosViejo = (cordenadaA.i+1) * (cordenadaA.j+1);
    nodoPosNuevo = (cordenadaA.i+1+1) * (cordenadaA.j+1+1); 
    if(cordenadaA.i+1 < mapa.length && cordenadaA.j+1 < mapa[0].length && 
        mapa[cordenadaA.i+1][cordenadaA.j+1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i+1 == cordenadaU.i && cordenadaA.j+1 == cordenadaU.j) &&
    !matrizAdyacencia[nodoPosViejo][nodoPosNuevo].conectado ) {
        cordenadaMin.i = cordenadaA.i+1;
        cordenadaMin.j = cordenadaA.j+1;
        
    }

    nodoPosViejo = (cordenadaA.i+1) * (cordenadaA.j+1);
    nodoPosNuevo = (cordenadaA.i+1+1) * (cordenadaA.j-1+1); 
    if(cordenadaA.i+1 < mapa.length && cordenadaA.j-1 >= 0 && 
        mapa[cordenadaA.i+1][cordenadaA.j-1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i+1 == cordenadaU.i && cordenadaA.j-1 == cordenadaU.j) &&
    !matrizAdyacencia[nodoPosViejo][nodoPosNuevo].conectado ) {
        cordenadaMin.i = cordenadaA.i+1;
        cordenadaMin.j = cordenadaA.j-1; 
    }
    if(cordenadaMin.i == -1 && cordenadaMin.j == -1){
        cordenadaMin.i = cordenadaU.i;
        cordenadaMin.j = cordenadaU.j; 
    }
    return cordenadaMin;
}

function avanzar(cordenadaA){
    var nodoPosViejo;
    var nodoPosNuevo;
    var auxiliarCordenada = {i:-1,j:-1};
    while (auxiliarCordenada.i == -1 && auxiliarCordenada.j == -1){
        switch(Math.floor((Math.random() * 8) + 1)){
            case 1:
                if(cordenadaA.i-1 >= 0 && mapa[cordenadaA.i-1][cordenadaA.j].tipo_obstaculo != 'roca'){
                    auxiliarCordenada.i = cordenadaA.i-1;
                    auxiliarCordenada.j = cordenadaA.j;    
                }
                break;
            case 2:
                if(cordenadaA.j+1 < mapa[0].length && mapa[cordenadaA.i][cordenadaA.j+1].tipo_obstaculo != 'roca'){
                    auxiliarCordenada.i = cordenadaA.i;
                    auxiliarCordenada.j = cordenadaA.j+1; 
                    
                }
                break;
            case 3:
                if(cordenadaA.i+1 < mapa.length && mapa[cordenadaA.i+1][cordenadaA.j].tipo_obstaculo != 'roca'){
                    auxiliarCordenada.i = cordenadaA.i+1;
                    auxiliarCordenada.j = cordenadaA.j; 
                }
                break;
            case 4:
                if(cordenadaA.j-1 >= 0 && mapa[cordenadaA.i][cordenadaA.j-1].tipo_obstaculo != 'roca'){
                    auxiliarCordenada.i = cordenadaA.i;
                    auxiliarCordenada.j = cordenadaA.j-1;
                }
                break;
            case 5:
                if(cordenadaA.i-1 >= 0 && cordenadaA.j-1 >= 0 && 
                    mapa[cordenadaA.i-1][cordenadaA.j-1].tipo_obstaculo != 'roca'){
                    auxiliarCordenada.i = cordenadaA.i-1;
                    auxiliarCordenada.j = cordenadaA.j-1;
                    
                }
                break;
            case 6:
                if(cordenadaA.i-1 >= 0 && cordenadaA.j+1 < mapa[0].length && 
                    mapa[cordenadaA.i-1][cordenadaA.j+1].tipo_obstaculo != 'roca'){
                    auxiliarCordenada.i = cordenadaA.i-1;
                    auxiliarCordenada.j = cordenadaA.j+1; 
                    
                }
                break;
            case 7:
                if(cordenadaA.i+1 < mapa.length && cordenadaA.j+1 < mapa[0].length && 
                    mapa[cordenadaA.i+1][cordenadaA.j+1].tipo_obstaculo != 'roca'){
                    auxiliarCordenada.i = cordenadaA.i+1;
                    auxiliarCordenada.j = cordenadaA.j+1; 
                    
                }
                break;
            case 8:
                if(cordenadaA.i+1 < mapa.length && cordenadaA.j-1 >= 0 && 
                    mapa[cordenadaA.i+1][cordenadaA.j-1].tipo_obstaculo != 'roca'){
                    auxiliarCordenada.i = cordenadaA.i+1;
                    auxiliarCordenada.j = cordenadaA.j-1; 
                }
                break;
            default:
                break;
        }
    }
    return auxiliarCordenada;
}

function training(){
    if(kybus.iterador < ciclosTotales){
        auxUlt.i    = kybus.lastI;
        auxUlt.j    = kybus.lastJ;
        kybus.lastI = kybus.i;
        kybus.lastJ = kybus.j;
        var nodoPosViejo;
        var nodoPosNuevo;
        var nuevaCoordenada              = avanzar(
                                                    {
                                                        i : kybus.i, 
                                                        j : kybus.j, 
                                                    }
                                                  );
        kybus.i      = nuevaCoordenada.i;
        kybus.j      = nuevaCoordenada.j;
        nodoPosViejo = (kybus.lastI+1) * (kybus.lastJ+1);
        nodoPosNuevo = (kybus.i+1) * (kybus.j+1);
        if(mapa[kybus.i][kybus.j].tipo_obstaculo == 'roca' || mapa[kybus.lastI][kybus.lastJ].visitado == true){
            var cordenada  =  eightDirections(
                                                 auxUlt,
                                                 {i : kybus.lastI, j: kybus.lastJ},
                                                 {i : kybus.i, j: kybus.j}
                                             );
            kybus.i      = cordenada.i;
            kybus.j      = cordenada.j;
            nodoPosNuevo = (kybus.i+1) * (kybus.j+1);
        }  
        cantidadNodos++;  
        matrizAdyacencia[nodoPosViejo][nodoPosNuevo].conectado = true;

        if(mapa[kybus.lastI][kybus.lastJ].visitado == true){
            mapa[kybus.lastI][kybus.lastJ].visitado = false;
        }else{
            mapa[kybus.lastI][kybus.lastJ].visitado = true;
        }

        mapa[kybus.lastI][kybus.lastJ].kybus          = 0;
        mapa[kybus.lastI][kybus.lastJ].casa           = 0;
        mapa[kybus.lastI][kybus.lastJ].objeto         = '';
        mapa[kybus.lastI][kybus.lastJ].tipo_obstaculo = '';
        kybus.x = mapa[kybus.i][kybus.j].x;
        kybus.y = mapa[kybus.i][kybus.j].y;
        mapa[casa.i][casa.j].casa               = 1;
        mapa[casa.i][casa.j].tipo_obstaculo     = 'casa';
        var elemento                            = document.getElementById('casa');
        var ruta                                = elemento.src.split('/');
        var imagen                              = new Image();
        imagen.src                              = ruta[4] + "/" + ruta[5];
        mapa[casa.i][casa.j].objeto             = imagen;
        if(kybus.i == casa.i && kybus.j == casa.j){
            kybus.iterador++;
            console.log('tamaño del recorrido' + cantidadNodos);
            cantidadNodos = 1;
            kybus.i = kybus.origenI;
            kybus.j = kybus.origenJ;
            console.log('inicial X ' + kybus.i + ' inicial Y ' + kybus.j);
            auxUlt   = {i : 0,j : 0};
            for (var i = 0;i < mapa.length;i++) {
                for (var j = 0; j < mapa[0].length;j++) {
                    mapa[i][j].visitado = false;
                }
            }
            mapa[kybus.i][kybus.j].kybus            = 1;
            mapa[kybus.i][kybus.j].tipo_obstaculo   = 'kybus';
            var elemento                            = document.getElementById('kybus');
            var ruta                                = elemento.src.split('/');
            var imagen                              = new Image();
            imagen.src                              = ruta[4] + "/" + ruta[5];
            mapa[kybus.i][kybus.j].objeto           = imagen;
        }else{
            mapa[kybus.i][kybus.j].kybus            = 1;
            mapa[kybus.i][kybus.j].tipo_obstaculo   = 'kybus';
            var elemento                            = document.getElementById('kybus');
            var ruta                                = elemento.src.split('/');
            var imagen                              = new Image();
            imagen.src                              = ruta[4] + "/" + ruta[5];
            mapa[kybus.i][kybus.j].objeto           = imagen;
        }
    }else{
        clearInterval(buscando);
        console.log("Entrenamiento Terminado");
        buscando = undefined;
    }
}

function dibujarMapas(dibujo){
    for (var i = 0;i < mapa.length;i++) {
        for (var j = 0; j < mapa[0].length;j++) {
            if(dibujo[i][j] == 1){
                var elemento = '';
                var ruta     = '';
                var imagen   = '';
                if(mapa[i][j].objeto == ''){
                    mapa[i][j].tipo_obstaculo   = 'roca';
                    elemento                    = document.getElementById('roca');
                    bandera                     = 0;
                    mapa[i][j].alpha            = 12;
                    mapa[i][j].obstaculo        = 1;
                    mapa[i][j].tipo_obstaculo   = elemento.id;
                    ruta                        = elemento.src.split('/');
                    imagen                      = new Image();
                    imagen.src                  = ruta[4] + "/" + ruta[5];
                    mapa[i][j].objeto           = imagen;
                }
            }
        }
    }
}

function frameLoop(){
    drawBackground();
    drawMapElements();
    NewElement();
    drawElements();
}

addingMouseEvents();
loadMedia();