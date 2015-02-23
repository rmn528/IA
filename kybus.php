<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Kybus</title>
	<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
	<link rel="stylesheet" type="text/css" href="css/mis-estilos.css">
</head>
<body>	
	<div class="container-fluid">
		<div class="row well">
			<strong><h3>Proyecto 1 kybus</h3></strong>
		</div>
		<div class="row" id = "barra">
			<div class="thumbnail col-xs-1">
				<img src="img/zelda_.gif" id = "kybus" alt="..." class="img-responsive imagen"/>
			</div>
			<div class="thumbnail col-xs-1">
				<img src="img/House2.gif" id = "casa" alt="..." class="img-responsive imagen"/>
			</div>
			<div class="thumbnail col-xs-1">
				<img src="img/arbolito.jpg" id = "arbol" alt="..." class="img-responsive imagen"/>
			</div>
			<div class="thumbnail col-xs-1">
				<img src="img/rock2.gif" id = "roca" alt="..." class="img-responsive imagen"/>
			</div>
			<div class="thumbnail col-xs-1">
				<img src="img/pastoC.jpg" id = "pasto" alt="..." class="img-responsive imagen"/>
			</div>	

		</div>
		<canvas id = "mundo" class = "col-xs-12 canvas" width = "1000" height = '266' draggable = "true">Tu navegador no soporta Canvas</canvas>
		<!--Inicio del Canvas -->
			
			
			
			<!--Fin del Canvas -->
		<div class="row">

			<div class="col-xs-12 well">
				<!--
				<div class="thumbnail col-xs-2 mundos">
					<a href=""><img src="img/one.jpg" alt="..." class="img-responsive"></a>
				</div>
				<div class="thumbnail col-xs-2 mundos">
					<a href=""><img src="img/dos.jpg" alt="..." class="img-responsive"></a>
				</div>
				<div class="thumbnail col-xs-2 mundos">
					<a href=""><img src="img/tres.jpg" alt="..." class="img-responsive"></a>
				</div>
				<div class="thumbnail col-xs-2 mundos">
					<a href=""><img src="img/cuatro.jpg" alt="..." class="img-responsive"></a>
				</div>	
				-->
				<div class="col-xs-5">										
					<div class="col-xs-10">
						<input type="range" name="rangeInput" min="20" max="80" onmousemove="updateTextInput(this.value);">                                                       	
					</div>
					<div class="col-xs-2">
						<input type="text" id="textInput" value="50">	
					</div>
					<div class="col-xs-10">
						<input type="range" name="rangeInput" min="0" max="10" onmousemove="updateTextInput2(this.value);">                                                       	
					</div>
					
					<div class="col-xs-2">
						<input type="text" id="textInput2" value="5">	
					</div>
				</div>

				<div class="col-xs-1 pull-right">
					<button class="btn btn-primary col-xs-12">Regresar</button>	
					<br><br>
					<button class="btn btn-success col-xs-12">Inicio</button>	
				</div>				
			</div>
		</div>
	</div>

	<script src="js/jquery.js"></script>	
	<script src="js/bootstrap.js"></script>	
	<script src="js/bootstrap-slider.js"></script>	
	<script src="js/sliders.js"></script>
	<script src="js/main.js"></script>
</body>
</html>