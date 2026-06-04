<?php
require_once 'claseValidar.php';
require_once 'api.php';

$Validar = new Validar();

$api = new ApiControlador($Validar);

$api->gestionarRespuesta();

$json = '{"nombreDeUnidad":"Guerrero Jaguar", 
          "costoDeAlimento":60, 
          "costoDeMadera":0}';

$matriz = json_decode($json, true);

var_dump($matriz);

//Sanea la cadena eliminando todos los caracteres excepto dígitos ([0-9]), signo más (+), y signo menos (-).
$numeroSanitizado = filter_var('1', FILTER_SANITIZE_NUMBER_INT);
var_dump($numeroSanitizado);
var_dump(filter_var($numeroSanitizado, FILTER_VALIDATE_INT));
?>