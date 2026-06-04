<?php 
require_once 'clase_mysqli.php';
require_once 'claseCRUDCorregida.php';
require_once 'clase-sesion.php';
require_once 'claseValidarCorregida.php';

class comodin{

	private object $mysqli;

	private object $CRUD;

	private object $sesion;

	private object $validar;

	private string $inputJSON = '';

	private array $solicitud = [];

	private array $respuesta = ['seccion'=>'',
								'error'=>[]];

	/*private string $mensaje = '{"seccion":"buscarViviendaPorIdDeVivienda",
								"idSesion": 1, 
	                            "usuario":"PABLO",
	                            "tipoDeUsuario":"ADMIN", 
								"idVivienda":113849}';*/

								/*'{"seccion":"guardarVivienda",
								"idSesion": 1, 
	                            "usuario":"PABLO",
	                            "tipoDeUsuario":"ADMIN",
							    "idPlanilla":467,
	                            "numeroDeVivienda":"0001",
	                            "manzana":"001",
	                            "lado":1,
	                            "idCodigoCalle":51,
	                            "altura":"S/A",
	                            "manzanaSector":"",
	                            "edificio":"",
	                            "entrada":"",
	                            "piso":"",
	                            "departamentoHabitacion":"",
	                            "casaLote":"",
	                            "idTipoDeVivienda":20,
	                            "idActividadEconomica":8,
	                            "descripcion":"S/D"}';*/

							  /*'{"seccion":"buscarViviendaPorIdDePlanillaYNumeroDeVivienda",
								"idSesion": 1, 
	                            "usuario":"PABLO",
	                            "tipoDeUsuario":"ADMIN", 
								"idPlanilla":467, 
								"numeroDeVivienda":"0001"}';*/

							  /*'{"seccion":"buscarIdDePlanilla",
								"idSesion": 1, 
	                            "usuario":"PABLO",
	                            "tipoDeUsuario":"ADMIN",
							    "idProvincia":1, 
								"idDepartamento":1, 
								"idLocalidad":1,
								"fraccion":"01",
								"radio":"01"}';*/

							/*'{"fraccion": "01",
								"idDepartamento": 1,
								"idLocalidad": 1,
								"idProvincia": 1,
 								"idSesion": 1,
								"seccion": "buscarRadiosPorIdProvinciaIdDepartamentoIdLocalidadFraccion",
								"tipoDeUsuario": "ADMIN",
								"usuario": "PABLO"}';*/

							/*'{"seccion":"buscarFraccionesPorIdProvinciaIdDepartamentoIdLocalidad",
								"idSesion": 1, 
	                            "usuario":"PABLO",
	                            "tipoDeUsuario":"ADMIN",
							    "idProvincia":1, 
								"idDepartamento":1, 
								"idLocalidad":1}';*/

								/*'{"seccion":"guardarPlanilla",
								  "idSesion": 1, 
	                              "usuario":"PABLO",
	                              "tipoDeUsuario":"ADMIN",
							      "idProvincia":1, 
								  "idDepartamento":1, 
								  "idLocalidad":1, 
								  "fraccion":"99", 
								  "radio":"99", 
								  "idActualizador":1, 
								  "idSupervisor":1, 
								  "fecha":"2025-12-10"}';*/

								/*'{"seccion":"buscarDatosDeUsuarioPorNombreYClave",
								    "usuario":"PABLO", 
								    "clave":"Pablo38573714"}';*/

								/*'{"seccion":"buscarViviendasPorIdDePlanilla",
									"idSesion":1,
	 								"usuario":"PABLO",
	 								"tipoDeUsuario":"ADMIN",
	                            	"idPlanilla":1}';*/


								/*'{ "idProvincia":"1",
	 							  "idDepartamento":"1",
	 							  "idLocalidad":"1",
	 							  "fraccion":"01",
	 							  "radio":"01",
	 							  "seccion":"buscarPlanilla",
	 							  "idSesion":1,
	 							  "usuario":"PABLO",
	 							  "tipoDeUsuario":"ADMIN"}';*/

							   	/*'{"seccion":"buscarDatosDeUsuarioPorNombreYClave",
	                              "usuario":"PABLO",
	                              "clave":"Pablo38573714" }';*/

	                            /*'{"seccion":"destruirSesion",
	                              "idSesion":1,
	                              "usuario":"PABLO",
	                              "tipoDeUsuario":"ADMIN"}';*/

							   

	public function __construct(){

		try {

			//Establecer el tipo de contenido de respuesta como JSON
			header("Content-Type: application/json; charset=utf-8");

			$this->inputJSON = file_get_contents('php://input');

			$this->mysqli = new MysqliDB();

			$this->CRUD = new CRUD();

			$this->sesion = new Sesion();

			$this->validar = new Validar($this->inputJSON /*$this->mensaje*/);

			$this->solicitud = $this->validar->devolverRespuesta();

			$this->llamarFuncionesPorSeccion($this->solicitud['seccion']);

		} catch (Exception $e) { //fin try
			$this->almacenarError($e->getTrace(), $e->getMessage());
		} finally { //fin catch
			$this->respuesta['seccion'] = $this->solicitud['seccion'];
			echo json_encode($this->respuesta);
		}//fin finally

	}//fin constructor


	private function ejecutarSentencia():array{

		$sentencia = $this->CRUD->devolverAsignarConsultaPorSeccion($this->solicitud['seccion']);
		
		$this->mysqli->devolverPrepararConsulta($sentencia);

		$this->mysqli->devolverLigarParametrosParaMarcadores($this->solicitud['seccion'], $this->solicitud);	

		$this->mysqli->devolverEjecutarConsulta();

		return $this->mysqli->devolverResultadosDeConsulta($this->solicitud['seccion'], $this->respuesta);

	}//fin function ejecutarSentencia


	private function devolverDatosDeBusqueda(string $seccion):array {

		$datosDeBusqueda = [];

		if($seccion === 'buscarPlanilla'){

	 		$datosDeBusqueda["seccion"] = $seccion;

			$datosDeBusqueda["idProvincia"] = $this->solicitud["idProvincia"];

			$datosDeBusqueda["idDepartamento"] = $this->solicitud["idDepartamento"];

			$datosDeBusqueda["idLocalidad"] = $this->solicitud["idLocalidad"];

			$datosDeBusqueda["fraccion"] = $this->solicitud["fraccion"];

			$datosDeBusqueda["radio"] = $this->solicitud["radio"];

		} else if($seccion === 'buscarViviendaPorIdDePlanillaYNumeroDeVivienda'){

			$datosDeBusqueda["seccion"] = $seccion;

			$datosDeBusqueda["idPlanilla"] = $this->solicitud["idPlanilla"];

			$datosDeBusqueda["numeroDeVivienda"] = $this->solicitud["numeroDeVivienda"];
		}

		return $datosDeBusqueda;

	}//fin function devolverDatosDeBusqueda


	private function verificarDuplicados(string $seccion) {

		$datosDeBusqueda = $this->devolverDatosDeBusqueda($seccion);

		$sentencia = $this->CRUD->devolverAsignarConsultaPorSeccion($seccion);
					
		$this->mysqli->devolverPrepararConsulta($sentencia);

		$this->mysqli->devolverLigarParametrosParaMarcadores($seccion, $datosDeBusqueda);	

		$this->mysqli->devolverEjecutarConsulta();

		$this->mysqli->devolverVerificarDuplicado();

	}//fin function verificarDuplicados


	private function llamarFuncionesPorSeccion(string $seccion){

		switch ($seccion) {

			case 'destruirSesion':
				$this->respuesta[] = $this->sesion->devolverDestruirSesion($this->solicitud['idSesion'], 
					                                   					   $this->solicitud['usuario']);
			break;

			case 'buscarDatosDeUsuarioPorNombreYClave':

				$datosDeSesion = $this->ejecutarSentencia();

				$this->respuesta = $this->sesion->devolverIniciarSesion($datosDeSesion['ID_USUARIO'][0], 
													                    $datosDeSesion['USUARIO'][0],
													         			$datosDeSesion["TIPO_USUARIO"][0]);

			break;

			case 'guardarPlanilla':

				$this->sesion->devolverControlDeSesion($this->solicitud['idSesion'], 
					                                   $this->solicitud['usuario'], 
					                                   $this->solicitud['tipoDeUsuario']);

				$this->verificarDuplicados('buscarPlanilla');
				
				$this->respuesta = $this->ejecutarSentencia();

			break;

			case 'buscarViviendaPorIdDePlanillaYNumeroDeVivienda':

				$this->sesion->devolverControlDeSesion($this->solicitud['idSesion'], 
					                                   $this->solicitud['usuario'], 
					                                   $this->solicitud['tipoDeUsuario']);

				$this->verificarDuplicados('buscarViviendaPorIdDePlanillaYNumeroDeVivienda');
				
				$this->respuesta['idPlanilla'] = $this->solicitud['idPlanilla'];

				$this->respuesta['numeroDeVivienda'] = $this->solicitud['numeroDeVivienda'];

			break;
			
			default:

				$this->sesion->devolverControlDeSesion($this->solicitud['idSesion'], 
					                                   $this->solicitud['usuario'], 
					                                   $this->solicitud['tipoDeUsuario']);

				$this->respuesta = $this->ejecutarSentencia();

			break;

		}//fin switch

	}//fin function llamarFuncionesPorSeccion


	private function llamarFuncion(string $nombreDeFuncion, array $argumentos = []){

		if ($this->disparador && method_exists($this, $nombreDeFuncion)) {
    		return call_user_func_array([$this, $nombreDeFuncion], $argumentos);	
		}

	}//fin function llamarFuncionDos


	private function almacenarError(array $rastreoDeError, string $mensajeDeError) {

		$cantidadDeErrores = count($rastreoDeError);

		$this->respuesta['error']['Mensaje'] = $mensajeDeError;

		for ($i=0; $i < $cantidadDeErrores; $i++) { 
			$this->respuesta['error'][] = "[$i]" . ' LINEA: ' . $rastreoDeError[$i]["line"] . ' CLASE: ' . $rastreoDeError[$i]["class"] . ' FUNCIÓN: ' . $rastreoDeError[$i]["function"];
		}//fin bucle for.

	}//fin function almacenarError


	public function devolverRespuesta():array{
		return $this->respuesta;
	}//fin function devolverRespuesta


}//fin class comodin

$comodin = new comodin();

?>