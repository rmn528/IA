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
                     };
var casa           = {
                        i : 0,
                        j : 0,
                        x : 0,
                        y : 0,
                        exists : 0
                     };
var abejas         = [];
var cordenadaMayor = {
                        i : -1,
                        j : -1,
                        alpha : -1000000000000
                    }; 
var mapa;

//estructuras de datos
var pila;

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
                            objeto_alpha : '',
                            alpha : 0,
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
            mapa[i][j].alpha = 0;
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
            mapa[i][j].alpha            = 12;
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
                        kybus.exists     = 1;
                        paso.i           = kybus.i;
                        paso.j           = kybus.j;
                        pila[0]          = paso;
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
                        drawHeat();
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
                            exists : 0,
                            p : 0,
                            iterador : 0,
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
            }else if(mapa[i][j].objeto_alpha != '' && mapa[i][j].alpha > 0){
                ctx.globalAlpha = mapa[i][j].alpha;
                ctx.drawImage(mapa[i][j].objeto_alpha,mapa[i][j].x+3,mapa[i][j].y+2,34,32);
                ctx.globalAlpha = 1;
            }else {
                mapa[i][j].objeto_alpha = '';
            }
        }
    }
}

function drawHeat(){
    for (var i = 0;i < mapa.length;i++) {
        for (var j = 0; j < mapa[0].length;j++) {
            var imagen    = '';
            imagen        = new Image();
            imagen.src    = "img/Rojo0.png";
            var x1        = i;
            var y1        = j;
            var x2        = casa.i;
            var y2        = casa.j;
            var respuesta = 0
            if(x1>=x2)
                while(x2<x1)
                {
                    respuesta+=1;
                    x2++;
                }
            else
                while(x1<x2)
                {
                    respuesta+=1;
                    x1++;
                }
            if(y1>=y2)
                while(y2<y1)
                {
                    respuesta+=1;
                    y2++;
                }
            else
                while(y1<y2)
                {
                    respuesta+=1;
                    y1++;
                }
            mapa[i][j].objeto_alpha = imagen;
            mapa[i][j].alpha        = (50-respuesta)/100;
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

    addingEvent(barras,'click',function(e){
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
                mapa[i][j].alpha          = 0;
                mapa[i][j].objeto = '';
                mapa[i][j].objeto_alpha = '';
                mapa[i][j].visitado = false;
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
                mapa[i][j].alpha          = 0;
                mapa[i][j].objeto = '';
                mapa[i][j].objeto_alpha = '';
                mapa[i][j].visitado = false;
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
                mapa[i][j].alpha          = 0;
                mapa[i][j].objeto = '';
                mapa[i][j].objeto_alpha = '';
                mapa[i][j].visitado = false;
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
            for(var i = 0; i < 5 ; i++){
                abejas[i] = {
                            i: kybus.i,
                            j: kybus.j,
                            x: kybus.x,
                            y: kybus.y,
                            lastI : 0,
                            lastJ : 0,
                            auxUlt: {i : 0,j : 0}
                         }
            }
            kybus.camino   = [{i: kybus.i,j: kybus.j}];
            kybus.sentido  = true;
            kybus.key      = 0;
            kybus.iterador = 0;
            buscando = setInterval(beeSearch,1000/velocidad);
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
                mapa[i][j].alpha          = 0;
                mapa[i][j].objeto = '';
                mapa[i][j].objeto_alpha = '';
                mapa[i][j].visitado = false;
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

function eightDirections(cordenadaU ,cordenadaA, cordenadaS){
    var cordenadaMin = {
                            i : -1,
                            j : -1,
                            alpha : -1000000000000
                        };              
    if(cordenadaA.i-1 >= 0 && mapa[cordenadaA.i-1][cordenadaA.j].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i-1 == cordenadaU.i && cordenadaA.j == cordenadaU.j) &&
    mapa[cordenadaA.i-1][cordenadaA.j].alpha > cordenadaMin.alpha) {
        cordenadaMin.i = cordenadaA.i-1;
        cordenadaMin.j = cordenadaA.j;
        cordenadaMin.alpha = mapa[cordenadaA.i-1][cordenadaA.j].alpha;
    }
    if(cordenadaA.j+1 < mapa[0].length && mapa[cordenadaA.i][cordenadaA.j+1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i == cordenadaU.i && cordenadaA.j+1 == cordenadaU.j) &&
    mapa[cordenadaA.i][cordenadaA.j+1].alpha > cordenadaMin.alpha) {
        cordenadaMin.i = cordenadaA.i;
        cordenadaMin.j = cordenadaA.j+1;
        cordenadaMin.alpha = mapa[cordenadaA.i][cordenadaA.j+1].alpha;
        
    }
    if(cordenadaA.i+1 < mapa.length && mapa[cordenadaA.i+1][cordenadaA.j].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i+1 == cordenadaU.i && cordenadaA.j == cordenadaU.j) &&
    mapa[cordenadaA.i+1][cordenadaA.j].alpha > cordenadaMin.alpha) {
        cordenadaMin.i = cordenadaA.i+1;
        cordenadaMin.j = cordenadaA.j;
        cordenadaMin.alpha = mapa[cordenadaA.i+1][cordenadaA.j].alpha;
    }
    if(cordenadaA.j-1 >= 0 && mapa[cordenadaA.i][cordenadaA.j-1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i == cordenadaU.i && cordenadaA.j-1 == cordenadaU.j) &&
    mapa[cordenadaA.i][cordenadaA.j-1].alpha > cordenadaMin.alpha) {
        cordenadaMin.i = cordenadaA.i;
        cordenadaMin.j = cordenadaA.j-1;
        cordenadaMin.alpha = mapa[cordenadaA.i][cordenadaA.j-1].alpha;
    }
    if(cordenadaA.i-1 >= 0 && cordenadaA.j-1 >= 0 && mapa[cordenadaA.i-1][cordenadaA.j-1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i-1 == cordenadaU.i && cordenadaA.j-1 == cordenadaU.j) &&
    mapa[cordenadaA.i-1][cordenadaA.j-1].alpha > cordenadaMin.alpha) {
        cordenadaMin.i = cordenadaA.i-1;
        cordenadaMin.j = cordenadaA.j-1;
        cordenadaMin.alpha = mapa[cordenadaA.i-1][cordenadaA.j-1].alpha;
        
    }
    if(cordenadaA.i-1 >= 0 && cordenadaA.j+1 < mapa[0].length && 
        mapa[cordenadaA.i-1][cordenadaA.j+1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i-1 == cordenadaU.i && cordenadaA.j+1 == cordenadaU.j) &&
    mapa[cordenadaA.i-1][cordenadaA.j+1].alpha > cordenadaMin.alpha) {
        cordenadaMin.i = cordenadaA.i-1;
        cordenadaMin.j = cordenadaA.j+1;
        cordenadaMin.alpha = mapa[cordenadaA.i-1][cordenadaA.j+1].alpha;
        
    }
    if(cordenadaA.i+1 < mapa.length && cordenadaA.j+1 < mapa[0].length && 
        mapa[cordenadaA.i+1][cordenadaA.j+1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i+1 == cordenadaU.i && cordenadaA.j+1 == cordenadaU.j) &&
    mapa[cordenadaA.i+1][cordenadaA.j+1].alpha > cordenadaMin.alpha) {
        cordenadaMin.i = cordenadaA.i+1;
        cordenadaMin.j = cordenadaA.j+1;
        cordenadaMin.alpha = mapa[cordenadaA.i+1][cordenadaA.j+1].alpha;
        
    }
    if(cordenadaA.i+1 < mapa.length && cordenadaA.j-1 >= 0 && 
        mapa[cordenadaA.i+1][cordenadaA.j-1].tipo_obstaculo != 'roca' &&
    !(cordenadaA.i+1 == cordenadaU.i && cordenadaA.j-1 == cordenadaU.j) &&
    mapa[cordenadaA.i+1][cordenadaA.j-1].alpha > cordenadaMin.alpha) {
        cordenadaMin.i = cordenadaA.i+1;
        cordenadaMin.j = cordenadaA.j-1; 
        cordenadaMin.alpha = mapa[cordenadaA.i+1][cordenadaA.j-1].alpha;
    }
    if(cordenadaMin.alpha == -1000000000000){
        cordenadaMin.i = cordenadaU.i;
        cordenadaMin.j = cordenadaU.j; 
        cordenadaMin.alpha = cordenadaU.alpha;
    }
    return cordenadaMin;
}

function avanzar(cordenadaA){
    var auxiliarCordenada = {i:-1,j:-1};
    while (auxiliarCordenada.i == -1 && auxiliarCordenada.j == -1){
        switch(Math.floor((Math.random() * 8) + 1)){
            case 1:
                if(cordenadaA.i-1 >= 0){
                    auxiliarCordenada.i = cordenadaA.i-1;
                    auxiliarCordenada.j = cordenadaA.j;    
                }
                break;
            case 2:
                if(cordenadaA.j+1 < mapa[0].length){
                    auxiliarCordenada.i = cordenadaA.i;
                    auxiliarCordenada.j = cordenadaA.j+1; 
                    
                }
                break;
            case 3:
                if(cordenadaA.i+1 < mapa.length){
                    auxiliarCordenada.i = cordenadaA.i+1;
                    auxiliarCordenada.j = cordenadaA.j; 
                }
                break;
            case 4:
                if(cordenadaA.j-1 >= 0){
                    auxiliarCordenada.i = cordenadaA.i;
                    auxiliarCordenada.j = cordenadaA.j-1;
                }
                break;
            case 5:
                if(cordenadaA.i-1 >= 0 && cordenadaA.j-1 >= 0){
                    auxiliarCordenada.i = cordenadaA.i-1;
                    auxiliarCordenada.j = cordenadaA.j-1;
                    
                }
                break;
            case 6:
                if(cordenadaA.i-1 >= 0 && cordenadaA.j+1 < mapa[0].length ){
                    auxiliarCordenada.i = cordenadaA.i-1;
                    auxiliarCordenada.j = cordenadaA.j+1; 
                    
                }
                break;
            case 7:
                if(cordenadaA.i+1 < mapa.length && cordenadaA.j+1 < mapa[0].length ){
                    auxiliarCordenada.i = cordenadaA.i+1;
                    auxiliarCordenada.j = cordenadaA.j+1; 
                    
                }
                break;
            case 8:
                if(cordenadaA.i+1 < mapa.length && cordenadaA.j-1 >= 0 ){
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

function beeSearch(){
    var cant_nodos = kybus.camino.length-1;
    if(kybus.iterador < 5){
        if(kybus.sentido){
            if(kybus.camino[cant_nodos].i == abejas[0].i && kybus.camino[cant_nodos].j == abejas[0].j){
                for(var cant_abejas = 0; cant_abejas < 5 ; cant_abejas++){
                    abejas[cant_abejas].auxUlt.i     = abejas[cant_abejas].lastI;
                    abejas[cant_abejas].auxUlt.j     = abejas[cant_abejas].lastJ;
                    abejas[cant_abejas].auxUlt.alpha = mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].alpha;
                    abejas[cant_abejas].lastI        = abejas[cant_abejas].i;
                    abejas[cant_abejas].lastJ        = abejas[cant_abejas].j;
                    var nuevaCoordenada              = avanzar(
                                                                {
                                                                    i : abejas[cant_abejas].i, 
                                                                    j : abejas[cant_abejas].j, 
                                                                }
                                                              );
                    abejas[cant_abejas].i = nuevaCoordenada.i;
                    abejas[cant_abejas].j = nuevaCoordenada.j;
                    if(mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].tipo_obstaculo == 'roca' || mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].visitado == true){
                        var cordenada = eightDirections(
                                                            abejas[cant_abejas].auxUlt,
                                                            {i : abejas[cant_abejas].lastI, j: abejas[cant_abejas].lastJ, alpha : mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].alpha},
                                                            {i : abejas[cant_abejas].i, j: abejas[cant_abejas].j, alpha : mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].alpha}
                                                        );
                        if(mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].alpha <= 0){
                            mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].objeto_alpha = '';
                        }
                        mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].alpha -= 0.01;
                        abejas[cant_abejas].i = cordenada.i;
                        abejas[cant_abejas].j = cordenada.j;
                    }
                    if(mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].visitado == true){
                        mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].visitado = false;
                    }else{
                        mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].visitado = true;
                    }
                    if(mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].tipo_obstaculo == 'abeja'){
                        mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].kybus               = 0;
                        mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].casa                = 0;
                        mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].objeto              = '';
                        mapa[abejas[cant_abejas].lastI][abejas[cant_abejas].lastJ].tipo_obstaculo      = '';
                    }
                    abejas[cant_abejas].x = mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].x;
                    abejas[cant_abejas].y = mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].y;
                    mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].tipo_obstaculo              = 'abeja';
                    var imagen                                                                     = new Image();
                    imagen.src                                                                     = "img/Hada.png";
                    mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].objeto                      = imagen;
                }
                kybus.sentido = false;  
                for(var cant_abejas = 0; cant_abejas < 5 ; cant_abejas++){
                    if(mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].alpha > cordenadaMayor.alpha){
                        cordenadaMayor.alpha = mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].alpha;
                        cordenadaMayor.i     = abejas[cant_abejas].i;
                        cordenadaMayor.j     = abejas[cant_abejas].j;
                    }
                }
                kybus.camino.push({i:cordenadaMayor.i,j:cordenadaMayor.j});
            }else{
                if(kybus.key > 0){
                    for(var cant_abejas = 0; cant_abejas < 5 ; cant_abejas++){
                        if(mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].tipo_obstaculo != 'kybus'){
                            mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].kybus               = 0;
                            mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].casa                = 0;
                            mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].objeto              = '';
                            mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].tipo_obstaculo      = '';
                        }
                        abejas[cant_abejas].i = kybus.camino[kybus.key].i;
                        abejas[cant_abejas].j = kybus.camino[kybus.key].j;
                        abejas[cant_abejas].x = mapa[kybus.camino[kybus.key].i][kybus.camino[kybus.key].j].x;
                        abejas[cant_abejas].y = mapa[kybus.camino[kybus.key].i][kybus.camino[kybus.key].j].y;
                        mapa[kybus.camino[kybus.key].i][kybus.camino[kybus.key].j].tipo_obstaculo      = 'abeja';
                        var imagen                                                                     = new Image();
                        imagen.src                                                                     = "img/Hada.png";
                        mapa[kybus.camino[kybus.key].i][kybus.camino[kybus.key].j].objeto              = imagen;
                    }
                }
                if(kybus.key < cant_nodos){
                    kybus.key++;
                }
            }
        }else{
            if(!(kybus.camino[0].i == abejas[0].i && kybus.camino[0].j == abejas[0].j)){
                for(var cant_abejas = 0; cant_abejas < 5 ; cant_abejas++){
                    mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].kybus               = 0;
                    mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].casa                = 0;
                    mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].objeto              = '';
                    mapa[abejas[cant_abejas].i][abejas[cant_abejas].j].tipo_obstaculo      = '';
                    abejas[cant_abejas].i = kybus.camino[kybus.key].i;
                    abejas[cant_abejas].j = kybus.camino[kybus.key].j;
                    abejas[cant_abejas].x = mapa[kybus.camino[kybus.key].i][kybus.camino[kybus.key].j].x;
                    abejas[cant_abejas].y = mapa[kybus.camino[kybus.key].i][kybus.camino[kybus.key].j].y;
                    if(mapa[kybus.camino[kybus.key].i][kybus.camino[kybus.key].j].tipo_obstaculo != 'kybus'){
                        mapa[kybus.camino[kybus.key].i][kybus.camino[kybus.key].j].tipo_obstaculo      = 'abeja';
                        var imagen                                                                     = new Image();
                        imagen.src                                                                     = "img/Hada.png";
                        mapa[kybus.camino[kybus.key].i][kybus.camino[kybus.key].j].objeto              = imagen;
                    }
                }
                if(kybus.key > 0){
                    kybus.key--;
                }
            }else{
                cordenadaMayor = {
                                    i : -1,
                                    j : -1,
                                    alpha : -1000000000000
                                }; 
                kybus.iterador++;
                kybus.sentido = true;
            } 
        }
    }else{
        mapa[kybus.i][kybus.j].kybus          = 0;
        mapa[kybus.i][kybus.j].casa           = 0;
        mapa[kybus.i][kybus.j].objeto         = '';
        mapa[kybus.i][kybus.j].tipo_obstaculo = '';
        kybus.x = mapa[kybus.i][kybus.j].x;
        kybus.y = mapa[kybus.i][kybus.j].y;
        kybus.i = kybus.camino[kybus.key].i;
        kybus.j = kybus.camino[kybus.key].j;
        if(kybus.i == casa.i && kybus.j == casa.j){
            clearInterval(buscando);
            buscando = undefined;
        }
        if(kybus.key < cant_nodos){
            kybus.key++;
        }else{
            kybus.iterador = 0;
            for(var i = 0; i < 5 ; i++){
                abejas[i] = {
                            i: kybus.i,
                            j: kybus.j,
                            x: kybus.x,
                            y: kybus.y,
                            lastI : 0,
                            lastJ : 0,
                            auxUlt: {i : 0,j : 0}
                         }
            }
            kybus.camino  = [{i: kybus.i,j: kybus.j}];
            kybus.sentido = true;
            kybus.key     = 0;
        }
    }
    mapa[casa.i][casa.j].casa               = 1;
    mapa[casa.i][casa.j].tipo_obstaculo     = 'casa';
    var elemento                            = document.getElementById('casa');
    var ruta                                = elemento.src.split('/');
    var imagen                              = new Image();
    imagen.src                              = ruta[4] + "/" + ruta[5];
    mapa[casa.i][casa.j].objeto             = imagen;

    mapa[kybus.i][kybus.j].kybus            = 1;
    mapa[kybus.i][kybus.j].tipo_obstaculo   = 'kybus';
    var elemento                            = document.getElementById('kybus');
    var ruta                                = elemento.src.split('/');
    var imagen                              = new Image();
    imagen.src                              = ruta[4] + "/" + ruta[5];
    mapa[kybus.i][kybus.j].objeto           = imagen;
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


addingKeyBoardEvents();
addingMouseEvents();
loadMedia();