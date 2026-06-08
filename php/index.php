<?php
require_once 'claseValidar.php';
require_once 'api.php';

$Validar = new Validar();

$api = new ApiControlador($Validar);

$api->gestionarRespuesta();

/*const DATOS = [ 'Legionario'=>['tipoDeUnidad'=>'infanteria',
                               'civilizacion'=>'Romanos',
                               'costoDeAlimento'=>50,
                               'costoDeMadera'=>0,
                               'costoDeOro'=>20,
                               'puntosDeVida'=>75,
                               'ataqueCuerpoACuarpo'=>12,
                               'armaduraCuerpoACuerpo'=>2,
                               'armaduraAntiPerforante'=>2,
                               'velocidad'=>0.96,
                               'lineaDeVision'=>7,
                               'fuerteContra'=>'Hostigadores, Camellos, Guerrero Águila, edificios, Piqueros, Caballería Ligera, infantería',
                               'debilContra'=>'Arqueros, Escorpiones, Catafracta, Guerreros Jaguar, Boyardos, Consquistadores, Jenízaro, Honderos, Caballeros de la Orden Teutónica, Obuses']
];

foreach (DATOS['Legionario'] as $key => $value) {
    echo "$key => $value \n";
}
var_dump((-5 < 0));*/
try {

    $json = '{"valorString":"    .*Guerrer@ Jaguar      \n", 
              "valorInt":"@#$%25",
              "valorBoleano":true,
              "valorFloat":1.27}';

    $matriz = json_decode($json, true);

    var_dump(strlen($matriz['valorFloat']));
    
} catch (Exception $e) {
    var_dump($e->getMessage());
}


/*
private function validarBooleano($valor, string $propiedad): bool {
    // filter_var con FILTER_VALIDATE_BOOLEAN acepta "1", "true", "on", "yes"
    // y los convierte a true. Muy útil para parámetros de URL.
    $valorBool = filter_var($valor, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    
    if ($valorBool === null) {
        throw new Exception("La propiedad $propiedad debe ser un booleano (true/false).");
    }
    return $valorBool;
}

private function validarFloat($valor, string $propiedad): float {
    // filter_var con FILTER_VALIDATE_FLOAT es ideal
    $valorFloat = filter_var($valor, FILTER_VALIDATE_FLOAT);
    
    if ($valorFloat === false) {
        throw new Exception("La propiedad $propiedad debe ser un número decimal válido.");
    }
    return $valorFloat;
}

private function validarTipo(string $propiedad, $valor, string $tipo) {
    switch ($tipo) {
        case 'int':
            return $this->validarEntero($valor, $propiedad);
        case 'float':
            return $this->validarFloat($valor, $propiedad);
        case 'bool':
            return $this->validarBooleano($valor, $propiedad);
        default:
            throw new Exception("Tipo de validación no soportado: $tipo");
    }
}*/

?>