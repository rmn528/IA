var miAp = angular.module('miAp', []);
//var miAp = angular.module('app', ['ngRoute']);

miAp.factory('Dato', function() {
  return {mensaje: 'Saludos desde la Fabrica!'};
});

function ControladorUno($scope, Dato) {
  $scope.dato = Dato;
};

function ControladorDos($scope, Dato) {
  $scope.dato = Dato;
};