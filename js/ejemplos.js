
var miAp = angular.module('miAp', []);

miAp.factory('Dato', function() {
 	 return {mensaje: 'Saludos desde la Fabrica!'};
});

function ControladorTareas($scope) {
	$scope.tareas = [{texto: 'Ser Super Heorico con Angular js', hecho: true}, 
					 {texto: 'crear una ap con Angular', hecho: false}];

	 $scope.agregarTarea= function() {
	 	$scope.tareas.push({texto: $scope.textoNuevaTarea, hecho:false});
	 	$scope.textoNuevaTarea = '';
 	 };

 	 $scope.restantes= function() {
 	 	var cuenta = 0;
 	 	angular.forEach($scope.tareas, function(tarea){
	 		cuenta += tarea.hecho ? 0 : 1;
 	 	});
 	 	return cuenta;
 	 };

 	 $scope.eliminar = function() {
 	 	var tareasViejas = $scope.tareas;
 	 	$scope.tareas = [];

 	 	angular.forEach(tareasViejas, function(tarea){
 	 		if(!tarea.hecho) $scope.tareas.push(tarea);
 	 	});
 	 };

}

function ControladorFiltros($scope) {
  $scope.empleados =
    [
      {
        nombre:'Ana', paterno: 'Guzman', materno: 'Guzman', primerDia: new Date(),
        salario: 12000, telefono:'5587687687', bono: 1.456789
      },
      {
        nombre:'Adrian', paterno: 'Romero', materno: 'Paez', primerDia:  new Date(),
        salario: 12000, telefono:'5512345678', bono: 9.654321
      },
      {
        nombre:'Rodolfo', paterno: 'Solares', materno: 'Madero', primerDia:  new Date(),
        salario: 14000, telefono:'5587654321', bono: 7.333333
      },
      {
        nombre:'Manuel', paterno: 'Perez', materno: 'Solin', primerDia:  new Date(),
        salario: 11000, telefono:'5518273645', bono: 5.272727
      },
      {
        nombre:'Dana', paterno: 'Roman', materno: 'Herrera', primerDia:  new Date(),
        salario: 20000, telefono:'5581726354', bono: 1.444444
      },
      {
        nombre:'Alejandro', paterno: 'Mena', materno: 'Morales', primerDia:  new Date(),
        salario: 5000, telefono:'5512312312', bono: 12.989898
      }
    ];

  $scope.ordenarPor = function(orden) {
    $scope.ordenSeleccionado = orden;
  };
};

function ControladorUno($scope, Dato) {
 	$scope.dato = Dato;
};

function ControladorDos($scope, Dato) {
  	$scope.dato = Dato;
};