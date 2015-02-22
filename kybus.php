<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
	<style>
		.zelda{
			max-width: 7em;
			max-height: 6em;
		}
		.mundos{
			max-width: 10em;
			max-height: 10em;
		}		
		#ex1Slider .slider-selection {
			background: #BABABA;
		}
	</style>
</head>
<body>	
	<div class="container-fluid">
		<div class="row well">
			<strong><h3>Proyecto 1 kybus</h3></strong>
		</div>
		<div class="row">
			<div class="col-xs-1 well">
				<div class="thumbnail zelda" href="#">
					<a href=""><img href="#" src="img/zelda_.gif" alt="..." class="img-responsive"></a>
				</div>
				<div class="thumbnail zelda">
					<a href=""><img src="img/House2.gif" alt="..." class="img-responsive"></a>
				</div>
				<div class="thumbnail zelda">
					<a href=""><img src="img/pasto.png" alt="..." class="img-responsive"></a>
				</div>
				<div class="thumbnail zelda">
					<a href=""><img src="img/rock2.gif" alt="..." class="img-responsive"></a>
				</div>
				<div class="thumbnail zelda">
					<a href=""><img src="img/equis.png" alt="..." class="img-responsive"></a>
				</div>
			</div>
			<!--Inicio del Canvas -->
			<div class="col-xs-11 well">
				
			</div>
			<!--Fin del Canvas -->
		</div>
		<div class="row">
			<div class="col-xs-12 well">
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

				<div class="col-xs-5">										
					<div class="col-xs-10">
						<input type="range" name="rangeInput" min="20" max="80" onchange="updateTextInput(this.value);">                                                       	
					</div>
					<div class="col-xs-2">
						<input type="text" id="textInput" value="50">	
					</div>
					<div class="col-xs-10">
						<input type="range" name="rangeInput" min="0" max="10" onchange="updateTextInput2(this.value);">                                                       	
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
	<script type="text/javascript">
		function updateTextInput(val) {
	      document.getElementById('textInput').value=val; 
	    }
	    function updateTextInput2(val) {
	      document.getElementById('textInput2').value=val; 
	    }
	</script>
</body>
</html>