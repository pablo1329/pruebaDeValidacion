<?php
class ApiControlador{

    private int $codigoHTTP = 200;

    private object $Validar;

    private object $MysqliDB;

    private object $CRUD;

    private array $respuesta = ['seccion'=>'',
                                'error'=>[] ];

    private string $seccion = '';

    private array $datosDeConsulta = [];

    public function __construct(Validar $Validar, MysqliDB $MysqliDB, CRUD $CRUD){

        $this->Validar = $Validar;

        $this->MysqliDB = $MysqliDB;

        $this->CRUD = $CRUD;

    }//fin constructor

    public function gestionarRespuesta(){

        try {

            //Establecer el tipo de contenido de respuesta como JSON
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
            header("Access-Control-Allow-Headers: Content-Type, Authorization");
            header("Content-Type: application/json; charset=UTF-8");
            $this->Validar->devolverValidarPeticion();
            //Si no se lanza una excepción, se devuelven los datos sanitizados.
            $this->respuesta = $this->Validar->devolverDatosSanitizados();
            //Almacenamos la seccion recibída y previamente validada dentro de la función validar.
            $this->seccion = $this->Validar->devolverSeccion();
            //Se almacenan los datos de consulta por seccion.
            $this->$datosDeConsulta = $this->CRUD->asignarConsultasPorSeccion($this->seccion);

            $this->respuesta = $MysqliDB->devolverEjecutarConsulta($this->$datosDeConsulta['consulta'], $this->respuesta, $this->$datosDeConsulta['tipos']);

        } catch (Exception $e) { //fin try
            $this->respuesta = $this->Validar->devolverAlmacenarError($e->getTrace(), $e->getMessage());
        } finally { //fin catch
            $this->codigoHTTP = $this->Validar->devolverCodigoHTTP();
            http_response_code($this->codigoHTTP);
            echo json_encode($this->respuesta);
        }//fin finally

    }//fin function gestionarRespuesta

}//fin class ApiControlador