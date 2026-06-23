<?php
spl_autoload_register(function ($nombre_clase) {
    // Busca el archivo basado en el nombre de la clase
    $archivo = __DIR__ . '/' . $nombre_clase . '.php';
    if (file_exists($archivo)) {
        require_once $archivo;
    }
});

$config = require __DIR__ . '/config.php';

$MysqliDB = new MysqliDB($config['host'], $config['user'], $config['pass'], $config['db']);

$CRUD = new CRUD();

$Validar = new Validar();

$api = new ApiControlador($Validar, $MysqliDB, $CRUD);

$api->gestionarRespuesta();

?>