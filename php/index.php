<?php
require_once 'clase_mysqli.php';
require_once 'claseCRUD.php';
require_once 'claseValidar.php';
require_once 'api.php';
$config = require 'config.php';

$MysqliDB = new MysqliDB($config['host'], $config['user'], $config['pass'], $config['db']);

$CRUD = new CRUD();

$Validar = new Validar();

$api = new ApiControlador($Validar, $MysqliDB, $CRUD);

$api->gestionarRespuesta();

?>