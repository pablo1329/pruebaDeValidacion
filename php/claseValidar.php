<?php 
class Validar {

	private array $matrizArgumentos = [];

	private array $propiedades = [];

	private array $restricciones = [];

	private int $cantidadDePropiedades = 0;

	private int $codigoHTTP = 200;

	private string $metodoHTTP = '';

	private array $datosRecibidos = [];

	private const MENSAJE_DE_ERROR = [405=>'405 Metodo no permitido',
									  406=>'406 El servidor solos puede proporcionar datos en formato application/json',
									  415=>'415 El Content-Type debe ser application/json.',
									  'arrayVacio'=>'El array recivido en la solicitud está vacío',
									  'jsonInvalido'=>'es un json invalido',
									  'propiedadObligatoriaVacia'=>'el valor de la propiedad está vacío',
									  'propiedadNoEcontrada'=>'es una propiedad obligatoria y no se encuentra en la petición',
									  'seccionInexistente'=>'no coincide con secciones permitidas',
									  'caracteresInvalidos'=>'contiene caractéres invalidos',
									  'longitudMinima'=>'tiene una cantidad de caractéres inferior a la permitida',
									  'longitudMaxima'=>'tiene una cantidad de caractéres superior a la permitida',
									  'valorAbsolutoInferior'=>'tiene un valor absoluto inferior al permitido',
									  'valorAbsolutoSuperior'=>'tiene un valor absoluto superior al permitido',
									  'errorAlIniciarSesion'=>'El usuario y/o la clave son incorrectos'];

	private const RESTRICCIONES = [	'seccion'=>['obligatorio'=>true,
						           	 			'longitudMinima'=>8,
						           	 			'longitudMaxima'=>28,
						           	 			'caracteresPermitidos'=>'/^[a-zA-Z]+$/',
						           	 			'verificarValorNumerico'=>false,
						          			    'valorAbsolutoMinimo'=>0,
						         		 	    'valorAbsolutoMaximo'=>0],

									'usuario'=>['obligatorio'=>true,
						           			   'longitudMinima'=>4,
						           			   'longitudMaxima'=>25,
						           			   'caracteresPermitidos'=>'/^[a-zA-Z0-9]+$/',
						           			   'verificarValorNumerico'=>false,
						           			   'valorAbsolutoMinimo'=>0,
						         		 	   'valorAbsolutoMaximo'=>0],

									'clave'=>['obligatorio'=>true,
						          			  'longitudMinima'=>4,
						          			  'longitudMaxima'=>40,
						          			  'caracteresPermitidos'=>'/^[a-zA-Z0-9]+$/',
						          			  'verificarValorNumerico'=>false,
						          			  'valorAbsolutoMinimo'=>0,
						         		 	  'valorAbsolutoMaximo'=>0],

									'apellido'=>['obligatorio'=>true,
						           	 			 'longitudMinima'=>2,
						           	 			 'longitudMaxima'=>20,
						           	 			 'caracteresPermitidos'=>'/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n\/.,\-()"' . "'°]+$/u",
						           	 			 'verificarValorNumerico'=>false,
						          			     'valorAbsolutoMinimo'=>0,
						         		 	     'valorAbsolutoMaximo'=>0],

									'nombre'=>['obligatorio'=>true,
						           			   'longitudMinima'=>2,
						           			   'longitudMaxima'=>30,
						           			   'caracteresPermitidos'=>'/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n\/.,\-()"' . "'°]+$/u",
						           			   'verificarValorNumerico'=>false,
						          			   'valorAbsolutoMinimo'=>0,
						         		 	   'valorAbsolutoMaximo'=>0],

									'nombreDeCalle'=>['obligatorio'=>true,
						           		              'longitudMinima'=>2,
						           		              'longitudMaxima'=>30,
						           		              'caracteresPermitidos'=>'/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n\/.,\-()"' . "'°]+$/u",
						           		              'verificarValorNumerico'=>false,
						          			          'valorAbsolutoMinimo'=>0,
						         		 	          'valorAbsolutoMaximo'=>0],

									'descripcion'=>['obligatorio'=>true,
						           					'longitudMinima'=>2,
						           					'longitudMaxima'=>140,
						           					'caracteresPermitidos'=>'/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n\/.,\-()"' . "'°]+$/u",
						           				    'verificarValorNumerico'=>false,
						          			        'valorAbsolutoMinimo'=>0,
						         		 	        'valorAbsolutoMaximo'=>0],

						         	'fecha'=>['obligatorio'=>true,
						           			  'longitudMinima'=>8,
						           			  'longitudMaxima'=>10,
						           			  'caracteresPermitidos'=>'/^[0-9-]+$/',
						           			  'verificarValorNumerico'=>false,
						          			  'valorAbsolutoMinimo'=>0,
						         		 	  'valorAbsolutoMaximo'=>0],

									'altura'=>['obligatorio'=>true,
						           			   'longitudMinima'=>1,
						           			   'longitudMaxima'=>7,
						           			   'caracteresPermitidos'=>'/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n\/.,\-()"' . "'°]+$/u",
						           			   'verificarValorNumerico'=>false,
						          			   'valorAbsolutoMinimo'=>0,
						         		 	   'valorAbsolutoMaximo'=>0],

						            'manzanaSector'=>['obligatorio'=>false,
						           		              'longitudMinima'=>0,
						           		              'longitudMaxima'=>4,
						           		              'caracteresPermitidos'=>'/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n\/.,\-()"' . "'°]+$/u",
						           		              'verificarValorNumerico'=>false,
						          			          'valorAbsolutoMinimo'=>0,
						         		 	          'valorAbsolutoMaximo'=>0],

						            'edificio'=>['obligatorio'=>false,
						                         'longitudMinima'=>0,
						                         'longitudMaxima'=>3,
						                         'caracteresPermitidos'=>'/^[a-zA-Z0-9]+$/',
						                         'verificarValorNumerico'=>false,
						          			     'valorAbsolutoMinimo'=>0,
						         		 	     'valorAbsolutoMaximo'=>0],

						            'entrada'=>['obligatorio'=>false,
						                        'longitudMinima'=>0,
						                        'longitudMaxima'=>1,
						                        'caracteresPermitidos'=>'/^[a-zA-Z0-9]+$/',
						                        'verificarValorNumerico'=>false,
						          			    'valorAbsolutoMinimo'=>0,
						         		 	    'valorAbsolutoMaximo'=>0],

						            'piso'=>['obligatorio'=>false,
						                     'longitudMinima'=>0,
						                     'longitudMaxima'=>2,
						                     'caracteresPermitidos'=>'/^[a-zA-Z0-9]+$/',
						                     'verificarValorNumerico'=>false,
						          			 'valorAbsolutoMinimo'=>0,
						         		 	 'valorAbsolutoMaximo'=>0],

						            'departamentoHabitacion'=>['obligatorio'=>false,
						         				               'longitudMinima'=>0,
						         				               'longitudMaxima'=>3,
						         				               'caracteresPermitidos'=>'/^[a-zA-Z0-9]+$/',
						         				               'verificarValorNumerico'=>false,
						          			                   'valorAbsolutoMinimo'=>0,
						         		 	                   'valorAbsolutoMaximo'=>0],

						       		'casaLote'=>['obligatorio'=>false,
						         				 'longitudMinima'=>0,
						         				 'longitudMaxima'=>3,
						         				 'caracteresPermitidos'=>'/^[a-zA-Z0-9]+$/',
						         				 'verificarValorNumerico'=>true,
						          			     'valorAbsolutoMinimo'=>0,
						         		 	     'valorAbsolutoMaximo'=>999],

						         	'tipoDeUsuario'=>['obligatorio'=>false,
						         				      'longitudMinima'=>4,
						         				      'longitudMaxima'=>20,
						         				      'caracteresPermitidos'=>'/^[a-zA-Z0-9]+$/',
						         				      'verificarValorNumerico'=>false,
						          			          'valorAbsolutoMinimo'=>0,
						         		 	          'valorAbsolutoMaximo'=>0],

						            'numeroDeVivienda'=>['obligatorio'=>true,
						         			             'longitudMinima'=>4,
						         			             'longitudMaxima'=>4,
						         		                 'caracteresPermitidos'=>'/^[0-9]+$/',
						         		                 'verificarValorNumerico'=>true,
						         		 	             'valorAbsolutoMinimo'=>1,
						         		 	             'valorAbsolutoMaximo'=>9999],

						            'manzana'=>['obligatorio'=>true,
						         	            'longitudMinima'=>3,
						         	            'longitudMaxima'=>3,
						         	            'caracteresPermitidos'=>'/^[0-9]+$/',
						         	            'verificarValorNumerico'=>true,
						         	            'valorAbsolutoMinimo'=>1,
						         	            'valorAbsolutoMaximo'=>999],

						            'lado'=>['obligatorio'=>true,
						                     'longitudMinima'=>1,
						                     'longitudMaxima'=>2,
						                     'caracteresPermitidos'=>'/^[0-9]+$/',
						                     'verificarValorNumerico'=>true,
						                     'valorAbsolutoMinimo'=>1,
						                     'valorAbsolutoMaximo'=>99],

						            'codigoDeCalle'=>['obligatorio'=>true,
						                     		  'longitudMinima'=>1,
						                     		  'longitudMaxima'=>5,
						                     		  'caracteresPermitidos'=>'/^[0-9]+$/',
						                     		  'verificarValorNumerico'=>false,
						                     		  'valorAbsolutoMinimo'=>0,
						                     		  'valorAbsolutoMaximo'=>0],

						            'idNombreDeCalle'=>['obligatorio'=>true,
						         		         		'longitudMinima'=>1,
						         		         		'longitudMaxima'=>6,
						         		         		'caracteresPermitidos'=>'/^[0-9]+$/',
						         		         		'verificarValorNumerico'=>true,
						         		         		'valorAbsolutoMinimo'=>1,
						         		         		'valorAbsolutoMaximo'=>999999],

						            'idSesion'=>['obligatorio'=>true,
						         		         'longitudMinima'=>1,
						         		         'longitudMaxima'=>3,
						         		         'caracteresPermitidos'=>'/^[0-9]+$/',
						         		         'verificarValorNumerico'=>true,
						         		         'valorAbsolutoMinimo'=>1,
						         		         'valorAbsolutoMaximo'=>999],

						            'idCodigoCalle'=>['obligatorio'=>true,
						         		              'longitudMinima'=>1,
						         		              'longitudMaxima'=>8,
						         		              'caracteresPermitidos'=>'/^[0-9]+$/',
						         		              'verificarValorNumerico'=>true,
						         		              'valorAbsolutoMinimo'=>1,
						         		              'valorAbsolutoMaximo'=>99999999],

						            'idTipoDeVivienda'=>['obligatorio'=>true,
						         		                 'longitudMinima'=>1,
						         		                 'longitudMaxima'=>2,
						         		                 'caracteresPermitidos'=>'/^[0-9]+$/',
						         		                 'verificarValorNumerico'=>true,
						         		  	             'valorAbsolutoMinimo'=>1,
						         		  	             'valorAbsolutoMaximo'=>25],

						            'idActividadEconomica'=>['obligatorio'=>true,
						         		                     'longitudMinima'=>1,
						         		                     'longitudMaxima'=>2,
						         		                     'caracteresPermitidos'=>'/^[0-9]+$/',
						         		                     'verificarValorNumerico'=>true,
						         		  	 	             'valorAbsolutoMinimo'=>1,
						         		  	 	             'valorAbsolutoMaximo'=>8],

						            'idPlanilla'=>['obligatorio'=>true,
						         	               'longitudMinima'=>1,
						         	               'longitudMaxima'=>11,
						         	               'caracteresPermitidos'=>'/^[0-9]+$/',
						         	               'verificarValorNumerico'=>true,
						         	               'valorAbsolutoMinimo'=>1,
						         	               'valorAbsolutoMaximo'=>99999999999],

									'idVivienda'=>['obligatorio'=>true,
						         	               'longitudMinima'=>1,
						         	               'longitudMaxima'=>11,
						         	               'caracteresPermitidos'=>'/^[0-9]+$/',
						         	               'verificarValorNumerico'=>true,
						         	               'valorAbsolutoMinimo'=>1,
						         	               'valorAbsolutoMaximo'=>99999999999],

						         	'idProvincia'=>['obligatorio'=>true,
						         					'longitudMinima'=>1,
						         	                'longitudMaxima'=>2,
						         	                'caracteresPermitidos'=>'/^[0-9]+$/',
						         	                'verificarValorNumerico'=>true,
						         	                'valorAbsolutoMinimo'=>1,
						         	                'valorAbsolutoMaximo'=>99],

						         	'idDepartamento'=>['obligatorio'=>true,
						         					   'longitudMinima'=>1,
						         	                   'longitudMaxima'=>1,
						         	                   'caracteresPermitidos'=>'/^[0-9]+$/',
						         	                   'verificarValorNumerico'=>true,
						         	                   'valorAbsolutoMinimo'=>1,
						         	                   'valorAbsolutoMaximo'=>9],

						         	'idLocalidad'=>['obligatorio'=>true,
						         					'longitudMinima'=>1,
						         	                'longitudMaxima'=>3,
						         	                'caracteresPermitidos'=>'/^[0-9]+$/',
						         	                'verificarValorNumerico'=>true,
						         	                'valorAbsolutoMinimo'=>1,
						         	                'valorAbsolutoMaximo'=>999],

						         	'idActualizador'=>['obligatorio'=>true,
						         					   'longitudMinima'=>1,
						         	                   'longitudMaxima'=>3,
						         	                   'caracteresPermitidos'=>'/^[0-9]+$/',
						         	                   'verificarValorNumerico'=>true,
						         	                   'valorAbsolutoMinimo'=>1,
						         	                   'valorAbsolutoMaximo'=>999],

						         	'idSupervisor'=>['obligatorio'=>true,
						         					 'longitudMinima'=>1,
						         	                 'longitudMaxima'=>3,
						         	                 'caracteresPermitidos'=>'/^[0-9]+$/',
						         	                 'verificarValorNumerico'=>true,
						         	                 'valorAbsolutoMinimo'=>1,
						         	                 'valorAbsolutoMaximo'=>999],

						         	'fraccion'=>['obligatorio'=>true,
						         				 'longitudMinima'=>1,
						         	             'longitudMaxima'=>2,
						         	             'caracteresPermitidos'=>'/^[0-9]+$/',
						         	             'verificarValorNumerico'=>true,
						         	             'valorAbsolutoMinimo'=>1,
						         	             'valorAbsolutoMaximo'=>99],

						         	'radio'=>['obligatorio'=>true,
						         			  'longitudMinima'=>1,
						         	          'longitudMaxima'=>2,
						         	          'caracteresPermitidos'=>'/^[0-9]+$/',
						         	          'verificarValorNumerico'=>true,
						         	          'valorAbsolutoMinimo'=>1,
						         	          'valorAbsolutoMaximo'=>99]

					                ];

private const PROPIEDADES = ['destruirSesion'=>['idSesion', 
	                            			    'usuario',
	                            			    'tipoDeUsuario'],

	                         'buscarTodosLosRadiosCargados'=>['idSesion', 
	                            			    			  'usuario',
	                            			    			  'tipoDeUsuario'],
					
							 'buscarDatosDeUsuarioPorNombreYClave'=>['usuario', 
									  		   						 'clave'],

					         'buscarPlanilla'=>['idSesion',
							 					'usuario',
	                            				'tipoDeUsuario',
							 					'idProvincia',	
					                    		'idDepartamento',	
					                    		'idLocalidad',	
					                    		'fraccion',	
					                    		'radio'],

					         'buscarIdDePlanilla'=>['idSesion',
							 					    'usuario',
	                            				    'tipoDeUsuario',
							 					    'idProvincia',	
					                    		    'idDepartamento',	
					                    		    'idLocalidad',	
					                    		    'fraccion',	
					                    		    'radio'],

					         'buscarViviendasPorIdDePlanilla'=>['idSesion', 
	                            								'usuario',
	                            								'tipoDeUsuario',
	                            								'idPlanilla'],

	                         'buscarTodasLasPlanillas'=>['idSesion', 
	                            						 'usuario',
	                            						 'tipoDeUsuario'],

	                         'buscarCantidadDeViviendasPorPlanilla'=>['idSesion', 
	                            						              'usuario',
	                            						              'tipoDeUsuario',
	                            						          	  'idPlanilla'],

	                         'buscarDatosDeProvincia'=>['idSesion', 
	                            						'usuario',
	                            						'tipoDeUsuario'],
	                            						
	                         'buscarDatosDeDepartamento'=>['idSesion', 
	                            						   'usuario',
	                            						   'tipoDeUsuario'],
	                            						   
	                         'buscarDatosDeLocalidad'=>['idSesion', 
	                            						'usuario',
	                            						'tipoDeUsuario'],
	                            						
	                         'buscarDatosDeActualizador'=>['idSesion', 
	                            						   'usuario',
	                            						   'tipoDeUsuario'],
	                            						   
	                         'buscarDatosDeActualizadorPorNombreYApellido'=>['idSesion', 
	                            						   				     'usuario',
	                            						                     'tipoDeUsuario',
	                            						                     'apellido',
	                            						                     'nombre'],
	                            						                     
	                         'buscarDatosDeSupervisor'=>['idSesion', 
	                            						 'usuario',
	                            						 'tipoDeUsuario'],
	                            						 
	                         'buscarDatosDeSupervisorPorNombreYApellido'=>['idSesion', 
	                            						                   'usuario',
	                            						                   'tipoDeUsuario',
	                            						                   'apellido',
	                            						                   'nombre'],
	                            						                   
	                         'buscarDatosDeCodigoDeCalle'=>['idSesion', 
	                            						    'usuario',
	                            						    'tipoDeUsuario'],
	                            						    
	                         'buscarDatosDeTipoDeVivienda'=>['idSesion', 
	                            						     'usuario',
	                            						     'tipoDeUsuario'],
	                            						     
	            	         'buscarDatosDeTipoDeActividadEconomica'=>['idSesion', 
	                            						               'usuario',
	                            						               'tipoDeUsuario'],
	                            						               
	            	         'buscarDatosDeNombreDeCalle'=>['idSesion', 
	                            						    'usuario',
	                            						    'tipoDeUsuario'],
	                            						    
	                         'buscarCallePorNombre'=>['idSesion', 
	                            					  'usuario',
	                            				      'tipoDeUsuario',
	                            				      'nombreDeCalle'],

	                         'buscarFraccionesPorIdProvinciaIdDepartamentoIdLocalidad'=>['idSesion', 
	                            					  								     'usuario',
	                            				      									 'tipoDeUsuario',
	                            				      									 'idProvincia',	
					                    												 'idDepartamento',	
					                    												 'idLocalidad'],

					         'buscarRadiosPorIdProvinciaIdDepartamentoIdLocalidadFraccion'=>['idSesion', 
	                            					  								         'usuario',
	                            				      									     'tipoDeUsuario',
	                            				      									     'idProvincia',	
					                    												     'idDepartamento',	
					                    												     'idLocalidad',
					                    												     'fraccion'],

					         'buscarViviendaPorIdDePlanillaYNumeroDeVivienda'=>['idSesion', 
	                            												'usuario',
	                            												'tipoDeUsuario', 
																				'idPlanilla', 
																				'numeroDeVivienda'],

							 'buscarViviendaPorIdDeVivienda'=>['idSesion', 
	                            							   'usuario',
	                            							   'tipoDeUsuario', 
															   'idVivienda'],

							 'buscarDatosDeViviendaAModificar'=>['idSesion', 
	                            							     'usuario',
	                            							     'tipoDeUsuario',
	                            							     'idPlanilla', 
																 'numeroDeVivienda'],

							 'guardarPlanilla'=>['idSesion', 
	                            				 'usuario',
	                            				 'tipoDeUsuario',
							                     'idProvincia', 
										 		 'idDepartamento', 
										 		 'idLocalidad', 
										 		 'fraccion', 
										 		 'radio', 
										 		 'idActualizador', 
										 		 'idSupervisor', 
										 		 'fecha'],

							 'guardarVivienda'=>['idSesion',
							 					 'usuario',
	                            				 'tipoDeUsuario',
							                     'idPlanilla',
	                            				 'numeroDeVivienda',
	                            				 'manzana',
	                            				 'lado',
	                            				 'idCodigoCalle',
	                            				 'altura',
	                            				 'manzanaSector',
	                            				 'edificio',
	                            				 'entrada',
	                            				 'piso',
	                            				 'departamentoHabitacion',
	                            				 'casaLote',
	                            				 'idTipoDeVivienda',
	                            				 'idActividadEconomica',
	                            				 'descripcion'],

	                         'guardarActualizador'=>['idSesion',
							 					     'usuario',
	                            				     'tipoDeUsuario',
	                            				     'apellido',
	                            				     'nombre'],

	                         'guardarSupervisor'=>['idSesion',
							 					   'usuario',
	                            				   'tipoDeUsuario',
	                            				   'apellido',
	                            				   'nombre'],

	                         'guardarCodigoDeCalle'=>['idSesion',
							 					      'usuario',
	                            				      'tipoDeUsuario',
	                            				      'codigoDeCalle',
	                            				      'idNombreDeCalle'],

	                         'guardarNombreDeCalle'=>['idSesion',
							 					      'usuario',
	                            				      'tipoDeUsuario',
	                            				      'nombreDeCalle'],

	                         'eliminarActualizador'=>['idSesion',
							 					      'usuario',
	                            				      'tipoDeUsuario',
	                            				  	  'idActualizador'],

	                         'eliminarSupervisor'=>['idSesion',
							 					    'usuario',
	                            				    'tipoDeUsuario',
	                            				  	'idSupervisor'],

	                         'eliminarCodigoDeCalle'=>['idSesion',
							 				           'usuario',
	                            			           'tipoDeUsuario',
	                            			           'idCodigoCalle'],

	                         'eliminarNombreDeCalle'=>['idSesion',
							 				           'usuario',
	                            			           'tipoDeUsuario',
	                            			           'idNombreDeCalle'],

	                         'eliminarViviendaPorIdDeVivienda'=>['idSesion',
							 				           			 'usuario',
	                            			           			 'tipoDeUsuario',
	                            			           			 'idVivienda'],

	                         'eliminarPlanillaPorIdDePlanilla'=>['idSesion',
							 				           			 'usuario',
	                            			           			 'tipoDeUsuario',
	                            			           			 'idPlanilla'],

	                         'modificarRelaPlanilla'=>['idSesion',
							 				           'usuario',
	                            			           'tipoDeUsuario',
	                            			           'idPlanilla',
	                            			           'idPlanilla'],

	                         'modificarDatosDePlanillaPorIdDePlanilla'=>['idSesion',
							 				           					 'usuario',
	                            			           					 'tipoDeUsuario',
	                         											 'idProvincia',
	                        											 'idDepartamento',
	                            										 'idLocalidad',
	                            										 'fraccion',
	                            										 'radio',
	                            		 								 'idActualizador',
	                            										 'idSupervisor',
	                            										 'fecha',
	                            										 'idPlanilla'],

	                         'modificarDatosDeViviendaPorIdDeVivienda'=>['numeroDeVivienda',
	                            										 'manzana',
	                            										 'lado',
	                            										 'idCodigoCalle',
	                            										 'altura',
	                            										 'manzanaSector',
	                            										 'edificio',
	                            										 'entrada',
	                            										 'piso',
	                            										 'departamentoHabitacion',
	                            										 'casaLote',
	                            										 'idTipoDeVivienda',
	                            										 'idActividadEconomica',
	                            										 'descripcion',
	                            										 'idVivienda' ]

							];

	private const METODOS_PERMITIDOS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];


	public function __construct(){

	}//fin constructor


	private function almacenarError(array $rastreoDeError, string $mensajeDeError):array {

		$cantidadDeErrores = count($rastreoDeError);

		$respuesta['error']['Mensaje'] = $mensajeDeError;

		for ($i=0; $i < $cantidadDeErrores; $i++) { 
			$respuesta['error'][] = "[$i]" . ' LINEA: ' . $rastreoDeError[$i]["line"] . ' CLASE: ' . $rastreoDeError[$i]["class"] . ' FUNCIÓN: ' . $rastreoDeError[$i]["function"];
		}//fin bucle for.

		return $respuesta;

	}//fin function almacenarError


	private function validarMetodoDeRespuesta():void{

		$this->metodoHTTP = $_SERVER['REQUEST_METHOD'];
		
		if(!in_array($this->metodoHTTP, self::METODOS_PERMITIDOS)){
			$this->codigoHTTP = 405;
			throw new Exception(self::MENSAJE_DE_ERROR[405]);
		}

	}//fin function validarMetodoDeRespuesta


	private function validarHTTPAcept():void{

		//Validar CONTENT-TYPE (esperamos application/json)
		if (empty($_SERVER['HTTP_ACCEPT']) || 
	        $_SERVER['HTTP_ACCEPT'] !== 'application/json'){
			$this->codigoHTTP = 406;
			throw new Exception(self::MENSAJE_DE_ERROR[406]);
		}

	}//fin function validarHTTPAcept


	private function validarContentType():void{

		if(!isset($_SERVER['HTTP_CONTENT_TYPE']) || $this->metodoHTTP !== 'GET'){
			if($_SERVER['HTTP_CONTENT_TYPE'] !== 'application/json') {
				$this->codigoHTTP = 415;
       		 throw new Exception(self::MENSAJE_DE_ERROR[415]);
    		}
		}

	}//fin function validarContentType


	private function validarArrayVacio(array $datosRecibidos):void{

		//Se valida si el array está vacío.
    	if (empty($datosRecibidos)) {
        	// Se asigna el codigo de error.
        	$this->codigoHTTP = 400; 
        	throw new Exception(self::MENSAJE_DE_ERROR['arrayVacio']);
   	 	}

	}//fin function validarArrayVacio


	private function obtenerDatosSegunMetodoHTTP():array{

		//Se almacena el array de la petición, en base al metodo http.
		if ($this->metodoHTTP === 'GET') {
        	$this->datosRecibidos = $_GET;
    	} else {
        	$this->datosRecibidos = json_decode(file_get_contents('php://input'), true, 512, JSON_THROW_ON_ERROR);
    	}

    	//Se valída que el array recibído en la solicitud no esté vacío, de lo contrario, se lanza una excepción.
    	$this->validarArrayVacio($this->datosRecibidos);

    	return $this->datosRecibidos;

	}//fin function obtenerDatosSegunMetodoHTTP


	private function validarPeticion():void{

		/*Se llama a la función para determinar que se haya hecho una petición permitida('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'), 
		  de lo contrario, se lanza una excepción*/
		$this->validarMetodoDeRespuesta();
		
		$this->validarHTTPAcept();

		$this->validarContentType();

		$this->datosRecibidos = $this->obtenerDatosSegunMetodoHTTP();

		$this->validarSeccion($this->datosRecibidos);

		$this->validarPropiedades();

		//Verificamos si el json no esta vacío.
		/*$this->json = json_decode($mensaje, true);

		$this->validarJson();

		$this->validarSeccion();

	    $this->validarPropiedades();

	    $this->verificarFecha();*/

	}//fin validarPeticion


	private function validarDatosEnArrayDeSesion(array $respuesta){

		if(empty($respuesta['ID_USUARIO']) ||
		   empty($respuesta['USUARIO']) || 
		   empty($respuesta['TIPO_USUARIO']) ) {
			throw new Exception(self::MENSAJE_DE_ERROR['errorAlIniciarSesion']);
		}

	}//fin function validarDatosEnArrayDeSesion


	private function almacenarAdvertenciasDeFecha(array $controlDeErroresDeFecha): string{

		$advertencias = '';

		if($controlDeErroresDeFecha["warning_count"]) {
     	   foreach ($controlDeErroresDeFecha["warnings"] as $key => $value) {
     	   	$advertencias .= ' ADVERTENCIA ' .  $value;
     	   }
     	}

     	return $advertencias;

	}//fin function almacenarAdvertenciasDeFecha


	private function almacenarErrorDeFecha(array $controlDeErroresDeFecha): string{

		$errores = '';

		if($controlDeErroresDeFecha["error_count"]) {
     		foreach ($controlDeErroresDeFecha["errors"] as $key => $value) {
     			$errores .= ' ADVERTENCIA ' .  $value;
     		}
     		
     	}

     	return $errores;

	}//fin function almacenarErrorDeFecha


	private function verificarFecha(){

		$advertencias = '';

		$error = '';

		//Se almacena la zona horaria.
		$zonaArgentina = new DateTimeZone('America/Argentina/Buenos_Aires');
		
		//Si la llave 'fecha' se encuentra en el json, se procede a verificar la validez de la misma.
		if(array_key_exists('fecha', $this->json)) {

			//Almacenamos la fecha con formato.
			$d = DateTime::createFromFormat('Y-m-d', $this->json['fecha'], $zonaArgentina);

			//Almacenamos los errores.
     		$controlDeErroresDeFecha = DateTimeImmutable::getLastErrors();
     		
     		if($controlDeErroresDeFecha["warning_count"] OR $controlDeErroresDeFecha["error_count"]) {

     			$advertencias = $this->almacenarAdvertenciasDeFecha($controlDeErroresDeFecha);	

     			$error = $this->almacenarErrorDeFecha($controlDeErroresDeFecha);

     			throw new Exception("La fecha es invalida. ADVERTENCIA: $advertencias ERRORES: $error");

     		}

		}

	}//fin function verificarFecha


	private function validarPropiedades(){

		$variableVacia = false;

		//Obtenemos las propiedades obligatorias en base a la seccion.
		$this->propiedades = self::PROPIEDADES[$this->datosRecibidos['seccion']];

		foreach($this->propiedades as $propiedad) {

        	$restricciones = self::RESTRICCIONES[$propiedad];

        	// Usamos $valor directamente, sin llamar a $this->json
        	$this->validarPropiedadEnArray($propiedad);
        	
        	//Verificamos si la variable está vacía.
        	$variableVacia = empty($this->datosRecibidos[$propiedad]);

        	if($restricciones['obligatorio']){

        		$variableVacia ? throw new Exception("La propiedad obligatoria: $propiedad " . self::MENSAJE_DE_ERROR['propiedadObligatoriaVacia']) : continue(2);
        	}

        	// Si es obligatoria, validamos que no esté vacía
        	if ($restricciones['obligatorio'] === true) {
            	$this->validarValoresVacios($this->datosRecibidos[$propiedad]);
        	}

        	// Si NO es obligatoria y está vacía → no tiene sentido validar el contenido
        	if ($restricciones['obligatorio'] === false && empty($this->json[$propiedad])) {
            	continue;
        	}

        	//validarValoresVacios(string $propiedad);

		}//fin bucle forEach

/*---------------------------------------------------------------------------------*/
		//Obtenemos la cantidad de propiedades.
		$this->cantidadDePropiedades = count($this->propiedades);

		//Recorremos las propiedades
		for($i=0; $i < $this->cantidadDePropiedades; $i++) { 

        	$propiedad = $this->propiedades[$i];

        	$restricciones = self::RESTRICCIONES[$propiedad];

        	// Validamos que exista la propiedad en el JSON
        	$this->validarPropiedadEnArray($propiedad);

        	// Si es obligatoria, validamos que no esté vacía
        	if ($restricciones['obligatorio'] === true) {
            	$this->validarValoresVacios($propiedad);
        	}

        	// Si NO es obligatoria y está vacía → no tiene sentido validar el contenido
        	if ($restricciones['obligatorio'] === false && empty($this->json[$propiedad])) {
            	continue;
        	}

        	// Validamos el string según las restricciones
        	$this->validarString($propiedad,
            					 $this->json[$propiedad],
            					 $restricciones['caracteresPermitidos'],
            				     $restricciones['longitudMinima'],
            					 $restricciones['longitudMaxima'] );

        	// Si corresponde, validamos el valor numérico
        	$this->validarValorNumericoAbsoluto($propiedad,
            									$this->json[$propiedad],
            									$restricciones['verificarValorNumerico'],
            									$restricciones['valorAbsolutoMinimo'],
            									$restricciones['valorAbsolutoMaximo'] );

		}//fin bucle for

	}//fin function validarPropiedades


	private function validarValoresVacios(string $propiedad):bool {

		//Verificamos si el valor de la propiedad esta vacío.
		if(empty($propiedad) ) {

			//Si la propiedad boligatorio es true, se almacena un error por qué las propiedades obligatorias no deben estar vacías.
			if($this->restricciones['obligatorio']) {
			   throw new Exception("La propiedad obligatoria: $propiedad " . self::MENSAJE_DE_ERROR['propiedadObligatoriaVacia']);
			}//fin if($this->restricciones['obligatorio'])

		}//fin if(empty($this->json[$this->propiedades[$i]]) )

	}//fin function validarValoresVacios


	private function validarPropiedadEnArray(string $propiedad):void{

		//Verificamos si el json contiene todas las propiedades obligatorias en base a la seccion.
		if(array_key_exists($propiedad, $this->datosRecibidos) === false) {
			throw new Exception("La propiedad: $propiedad " . self::MENSAJE_DE_ERROR['propiedadNoEcontrada']);
		}

	}//fin function validarPropiedadEnJson


	private function validarPropiedadesPorSeccion(array $datosRecibidos):void{

		if(array_key_exists($datosRecibidos['seccion'], self::PROPIEDADES) === false){
			throw new Exception('Seccion invalida: ' . $datosRecibidos['seccion'] .' '. self::MENSAJE_DE_ERROR['seccionInexistente']);
		}

	}//fin function validarLlaveDeSeccion


	private function validarSeccion(array $datosRecibidos):void {

		//Se verifica que la key "seccion", se encuentre en el array de $datosRecibidos.
		if(!array_key_exists('seccion', $datosRecibidos)){
			throw new Exception("seccion " . self::MENSAJE_DE_ERROR['propiedadNoEcontrada']);
		}

		//Verificamos si el valor contenido en la key "seccion", no está vacío, de lo contrario se lanza una excepción.
		if(empty($datosRecibidos['seccion'])) {
			throw new Exception("Seccion invalida: " . self::MENSAJE_DE_ERROR['propiedadObligatoriaVacia']);
		} 

		//Validamos si existen propiedades asociadas al valor contenido en "seccion", de lo contrario, se lanza una excepción.
		$this->validarPropiedadesPorSeccion($datosRecibidos);

	}//fin  function validarSeccion


	private function verificarCaracteresEspeciales(string $propiedad, string $cadena, string $caracteresPermitidos){

		//Aplicamos configuracion de validacion en base a los caracteres permitidos.
		$this->disparador = boolval(preg_match($caracteresPermitidos, $cadena));

		if($this->disparador === false) {
			throw new Exception("La propiedad: $propiedad con valor: $cadena " . self::MENSAJE_DE_ERROR['caracteresInvalidos']);
		}

	}//fin function verificarCaracteresEspeciales


	private function validarLongitudDeCadena(string $propiedad, string $cadena, int $longitudMinima, int $longitudMaxima) {

		//Almacenamos cantidad de caracteres de la cadena.
		$longitudDeCadena = strlen($cadena);

		//Si la longitud de la cadena es menor a la longitud minima o mayor a la longitud maxima, se estable el disparador a false.
		if($longitudDeCadena < $longitudMinima) {
			throw new Exception("El valor: $cadena almacenado en la propiedad: $propiedad " . self::MENSAJE_DE_ERROR['longitudMinima'] . ". Limite permitido: $longitudMinima");
		}

		if($longitudDeCadena > $longitudMaxima) {
		   throw new Exception("El valor: $cadena almacenado en la propiedad: $propiedad " . self::MENSAJE_DE_ERROR['longitudMaxima'] . ". Limite permitido: $longitudMaxima");
		}

	}//fin function validarLongitudDeCadena


	private function validarString(string $propiedad, string $cadena, string $caracteresPermitidos, int $longitudMinima, int $longitudMaxima) {

		//Limpiamos espacios en blanco al principio y al final de la cadena.
		$cadena = trim($cadena);

		/*Verifica que la cadena contenga solo caracteres permitidos. Almacena "true" en "$this->disparador" si la cadena es valida, de lo contrario, almacena "false".*/
		$this->verificarCaracteresEspeciales($propiedad, $cadena, $caracteresPermitidos);

		//Validámos la longitud de la cadena;
		$this->validarLongitudDeCadena($propiedad, $cadena, $longitudMinima, $longitudMaxima);
		//$this->llamarFuncion('validarLongitudDeCadena', [$cadena, $longitudMinima, $longitudMaxima]);

	}//fin function validarString	


	private function validarLimitesAbsolutosEnteros(string $numeroAComparar, string $propiedad, int $limiteMinimo, int $limiteMaximo) {

		//Almacenamos el valor entero.
		$valorAbsolutoDeNumeroAComparar = intval($numeroAComparar);

		//Comparamos si el valor absoluto del numero a comparar es inferior al minimo permitido.
		if($valorAbsolutoDeNumeroAComparar < $limiteMinimo) {
		   throw new Exception("El valor: $numeroAComparar almacenado en la propiedad: $propiedad " . self::MENSAJE_DE_ERROR['valorAbsolutoInferior'] . ". Limite permitido: $limiteMinimo");	
		}

		//Comparamos si el valor absoluto del numero a comparar es superior al minimo permitido.
		if($valorAbsolutoDeNumeroAComparar > $limiteMaximo){
		   throw new Exception("El valor: $numeroAComparar almacenado en la propiedad: $propiedad " . self::MENSAJE_DE_ERROR['valorAbsolutoSuperior'] . ". Limite permitido: $limiteMinimo");  
		}

	}//fin function validarLimitesAbsolutosEnteros


	private function validarValorNumericoAbsoluto(string $propiedad, string $cadena, bool $verificarValorNumerico, int $valorAbsolutoMinimo, int $valorAbsolutoMaximo){

		if($verificarValorNumerico) {
			$this->validarLimitesAbsolutosEnteros($cadena, $propiedad, $valorAbsolutoMinimo, $valorAbsolutoMaximo); 
		}//fin if($this->restricciones['verificarValorNumerico'])

	}//fin function validarValorNumericoAbsoluto


	public function devolverRespuesta(){
		return $this->json;
	}//fin function devolverRespuesta


	public function devolverValidarDatosEnArrayDeSesion(array $respuesta){
		return $this->validarDatosEnArrayDeSesion($respuesta);
	}//fin function devolverValidarDatosEnArrayDeSesion

	public function devolverValidarPeticion(){
		return $this->validarPeticion();
	}//fin function devolverValidarPeticion

	public function devolverAlmacenarError(array $rastreoDeError, string $mensajeDeError) {
		return $this->almacenarError($rastreoDeError, $mensajeDeError);
	}

	public function devolverCodigoHTTP():int{
		return $this->codigoHTTP;
	}//fin function devolverCodigoHTTP

}//fin class validar

?>