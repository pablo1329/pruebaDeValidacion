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

//$api = new ApiControlador($Validar, $MysqliDB, $CRUD);

//$api->gestionarRespuesta();

    $codigoHTTP = 200;
try {

    //Establecer el tipo de contenido de respuesta como JSON
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");
    //Si no se lanza una excepción, se devuelven los datos sanitizados.
    $resultado = ['inputOrigenDeIngreso'=>3,
                  'año'=>2026,
                  'mes'=>6
                  ];
    //Almacenamos la seccion recibída y previamente validada dentro de la función validar.
    $seccion = 'buscarIngresoDuplicado';
    //Se almacenan los datos de consulta por seccion.
    $resultado = Transformador::devolverDatosParaConsultar($resultado);
    $datosDeConsulta = $CRUD->asignarConsultasPorSeccion($seccion);
    $resultado = $MysqliDB->devolverEjecutarConsulta($datosDeConsulta['consulta'], $resultado, $datosDeConsulta['tipos']);
    $resultado = Transformador::devolverRespuesta($resultado);  //devolverArrayEstructurado($this->resultado);
}catch (Exception $e) { //fin try
   
    $codigoHTTP = 400;
    //$this->resultado = $this->Validar->devolverAlmacenarError($e->getTrace(), $e->getMessage());
    $resultado = Logger::obtenerUltimoError();
    //$this->resultado[] = $_SERVER;
} finally { //fin catch
    http_response_code($codigoHTTP);
    echo json_encode($resultado);
}//fin finally

?>