<?php
class ApiControlador{

    private int $codigoHTTP = 200;

    private object $Validar;

    private array $respuesta = ['seccion'=>'',
                                'error'=>[] ];

    public function __construct(object $Validar){

        $this->Validar = $Validar;

    }//fin constructor

    public function gestionarRespuesta(){

        header("Content-Type: application/json; charset=UTF-8");

        try {

            //Establecer el tipo de contenido de respuesta como JSON
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
            header("Access-Control-Allow-Headers: Content-Type, Authorization");
            header("Content-Type: application/json; charset=UTF-8");
            $this->Validar->devolverValidarPeticion();
            $this->respuesta = $this->Validar->devolverDatosSanitizados();
        } catch (Exception $e) { //fin try
            $this->respuesta = $this->Validar->devolverAlmacenarError($e->getTrace(), $e->getMessage());
        } finally { //fin catch
            $this->codigoHTTP = $this->Validar->devolverCodigoHTTP();
            http_response_code($this->codigoHTTP);
            //echo json_encode($this->respuesta);
        }//fin finally

    }//fin function gestionarRespuesta

}//fin class ApiControlador