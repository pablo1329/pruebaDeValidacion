<?php 
class Validar {

	private array $matrizArgumentos = [];

	private array $propiedades = [];

	private array $restricciones = [];

	private int $cantidadDePropiedades = 0;

	private int $codigoHTTP = 200;

	private string $metodoHTTP = '';

	private array $datosRecibidos = [];

	private array $datosSanitizados = [];

	private const MENSAJE_DE_ERROR = [405=>'405 Metodo no permitido',
									  406=>'406 El servidor solos puede proporcionar datos en formato application/json',
									  415=>'415 El Content-Type debe ser application/json.',
									  'arrayVacio'=>'El array recivido en la solicitud está vacío',
									  'jsonInvalido'=>'es un json invalido',
									  'propiedadObligatoriaVacia'=>'el valor de la propiedad está vacío',
									  'propiedadNoEcontrada'=>'es una propiedad obligatoria y no se encuentra en la petición',
									  'seccionInexistente'=>'no coincide con secciones permitidas',
									  'caracteresInvalidos'=>'contiene caractéres invalidos',
									  'valorNumericoEnteroInvalido'=>'El valor almacenado en la propiedad no es un valor numérico entero valido',
									  'valorNumericoDecimalInvalido'=>'El valor almacenado en la propiedad no es un valor numérico decimal valido',
									  'longitudMinima'=>'tiene una cantidad de caractéres inferior a la permitida',
									  'longitudMaxima'=>'tiene una cantidad de caractéres superior a la permitida',
									  'valorAbsolutoInferior'=>'tiene un valor absoluto inferior al permitido',
									  'valorAbsolutoSuperior'=>'tiene un valor absoluto superior al permitido',
									  'errorAlIniciarSesion'=>'El usuario y/o la clave son incorrectos'];

	private const RESTRICCIONES = [	'seccion'=>['obligatorio'=>true,
						           	 			'longitudMinima'=>8,
						           	 			'longitudMaxima'=>50,
						           	 			'caracteresPermitidos'=>'/^[a-zA-Z]+$/',
						           	 			'tipoDeDatoAValidar'=>'string',
						          			    'valorAbsolutoMinimo'=>0,
						         		 	    'valorAbsolutoMaximo'=>0],

						            'civilizacion'=>['obligatorio'=>true,
						           	 				 'longitudMinima'=>4,
						           	 				 'longitudMaxima'=>40,
						           	 				 'caracteresPermitidos'=>'#^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n/.,\-()\'°]+$#u',
						           	 				 'tipoDeDatoAValidar'=>'string',
						          			    	 'valorAbsolutoMinimo'=>0,
						         		 	    	 'valorAbsolutoMaximo'=>0],

						         	'nombreDeUnidad'=>['obligatorio'=>true,
						           	 				   'longitudMinima'=>4,
						           	 				   'longitudMaxima'=>30,
						           	 				   'caracteresPermitidos'=>'#^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n/.,\-()\'°]+$#u',
						           	 				   'tipoDeDatoAValidar'=>'string',
						          			    	   'valorAbsolutoMinimo'=>0,
						         		 	    	   'valorAbsolutoMaximo'=>0],

						         	'tipoDeUnidad'=>['obligatorio'=>true,
						           	 				 'longitudMinima'=>4,
						           	 				 'longitudMaxima'=>30,
						           	 				 'caracteresPermitidos'=>'#^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n/.,\-()\'°]+$#u',
						           	 				 'tipoDeDatoAValidar'=>'string',
						          			    	 'valorAbsolutoMinimo'=>0,
						         		 	    	 'valorAbsolutoMaximo'=>0],

						         	'costoDeAlimento'=>['obligatorio'=>true,
						           	 				 	'longitudMinima'=>1,
						           	 				 	'longitudMaxima'=>3,
						           	 				 	'caracteresPermitidos'=>'#^[1-9]$#',
						           	 				 	'tipoDeDatoAValidar'=>'int',
						          			    	 	'valorAbsolutoMinimo'=>1,
						         		 	    	 	'valorAbsolutoMaximo'=>500],

						     		'costoDeMadera'=>['obligatorio'=>true,
						           	 				  'longitudMinima'=>1,
						           	 				  'longitudMaxima'=>3,
						           	 				  'caracteresPermitidos'=>'#^[1-9]$#',
						           	 				  'tipoDeDatoAValidar'=>'int',
						          			    	  'valorAbsolutoMinimo'=>1,
						         		 	    	  'valorAbsolutoMaximo'=>500],

						     		'costoDeOro'=>['obligatorio'=>true,
						           	 			   'longitudMinima'=>4,
						           	 			   'longitudMaxima'=>30,
						           	 			   'caracteresPermitidos'=>'#^[1-9]$#',
						           	 			   'tipoDeDatoAValidar'=>'string',
						          			       'valorAbsolutoMinimo'=>1,
						         		 	       'valorAbsolutoMaximo'=>500],
						         	/*// Permite dígitos, comas (miles) y punto (decimal)
										 $regexFloatConMiles = '#^[0-9]{1,3}(,[0-9]{3})*(\.[0-9]+)?$#';*/
						         	'velocidad'=>['obligatorio'=>true,
						           	 			  'longitudMinima'=>4,
						           	 			  'longitudMaxima'=>4,
						           	 			  'caracteresPermitidos'=>'#^[0-9]+(\.[0-9]+)?$#',
						           	 			  'tipoDeDatoAValidar'=>'float',
						          			      'valorAbsolutoMinimo'=>0.50,
						         		 	      'valorAbsolutoMaximo'=>1.90],

						         	'valorBoleano'=>['obligatorio'=>true,
						           	 			  	 'longitudMinima'=>1,
						           	 			  	 'longitudMaxima'=>1,
						           	 			  	 'caracteresPermitidos'=>'',
						           	 			  	 'tipoDeDatoAValidar'=>'bool',
						          			      	 'valorAbsolutoMinimo'=>0,
						         		 	      	 'valorAbsolutoMaximo'=>0],

									'usuario'=>['obligatorio'=>true,
						           			   'longitudMinima'=>4,
						           			   'longitudMaxima'=>25,
						           			   'caracteresPermitidos'=>'/^[a-zA-Z0-9]+$/',
						           			   'tipoDeDatoAValidar'=>'string',
						           			   'valorAbsolutoMinimo'=>0,
						         		 	   'valorAbsolutoMaximo'=>0],

									'nombre'=>['obligatorio'=>true,
						           			   'longitudMinima'=>2,
						           			   'longitudMaxima'=>30,
						           			   'caracteresPermitidos'=>'#^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\n/.,\-()\'°]+$#u',
						           			   'tipoDeDatoAValidar'=>'string',
						          			   'valorAbsolutoMinimo'=>0,
						         		 	   'valorAbsolutoMaximo'=>0],

						         	'id_civilizacion'=>['obligatorio'=>true,
						           	 			   		'longitudMinima'=>1,
						           	 			   		'longitudMaxima'=>99,
						           	 			   		'caracteresPermitidos'=>'#^[1-9]$#',
						           	 			   		'tipoDeDatoAValidar'=>'int',
						          			       		'valorAbsolutoMinimo'=>1,
						         		 	       		'valorAbsolutoMaximo'=>99],

						         	'fecha'=>['obligatorio'=>true,
						           			  'longitudMinima'=>8,
						           			  'longitudMaxima'=>10,
						           			  'caracteresPermitidos'=>'/^[0-9-]+$/',
						           			  'tipoDeDatoAValidar'=>'date',
						          			  'valorAbsolutoMinimo'=>0,
						         		 	  'valorAbsolutoMaximo'=>0]

					                ];

	private const PROPIEDADES = ['destruirSesion'=>['idSesion', 
	                            			    	'usuario',
	                            			    	'tipoDeUsuario'],
					
							 	 'buscarDatosDeUsuarioPorNombreYClave'=>['usuario', 
									  		   						 	 'clave'],

								 'buscarDatosPorNombreDeCivilizacion'=>['id_civilizacion'],

						         'buscarDatosPorNombreDeUnidad'=>['nombreDeUnidad'],

						         'buscarDatosPorTipoDeUnidad'=>['tipoDeUnidad'],

						         'buscarUnidadesPorCosto'=>['costoDeAlimento',
						     								'costoDeMadera',
						     							    'costoDeOro'],

						         'buscarUnidadesPorVelocidad'=>['velocidad']
	];

	private const METODOS_PERMITIDOS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];


	public function __construct(){}//fin constructor


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

		// Si es GET, no necesitamos validar Content-Type, así que retornamos inmediatamente
    	if ($this->metodoHTTP === 'GET') {
        	return;
    	}

    	// Si NO es GET, entonces sí validamos obligatoriamente que sea application/json
    	if (!isset($_SERVER['HTTP_CONTENT_TYPE']) || $_SERVER['HTTP_CONTENT_TYPE'] !== 'application/json') {
        	$this->codigoHTTP = 415;
        	throw new Exception(self::MENSAJE_DE_ERROR[415]);
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

			// Usamos $valor directamente, sin llamar a $this->json
        	$this->validarPropiedadEnArray($propiedad);

			$valor = $this->datosRecibidos[$propiedad] ?? null;

        	$restricciones = self::RESTRICCIONES[$propiedad];

        	$estaVacio = ($valor === null || $valor === '');

        	if ($estaVacio) {

        		if ($restricciones['obligatorio'] === true) {
            		throw new Exception("La propiedad $propiedad ". self::MENSAJE_DE_ERROR['propiedadObligatoriaVacia']);
        		}

        		// Si no es obligatorio y está vacío, no hay nada más que hacer.
        		continue;
    		}

        	// Validamos el string según las restricciones
        	$this->validarString($propiedad,
            					 $this->datosRecibidos[$propiedad],
            					 $restricciones['caracteresPermitidos'],
            				     $restricciones['longitudMinima'],
            					 $restricciones['longitudMaxima'] );

        	//Se valida el dato recibído, segú el 'tipoDeDatoAValidar' almacenado en $restricciones[$propiedad]['tipoDeDatoAValidar'] (int, float, bool, etc.)
        	$this->validarDatoPorTipo($this->datosSanitizados[$propiedad], $propiedad, $restricciones);

		}//fin bucle forEach

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


	private function verificarCaracteresEspeciales(string $propiedad, string $cadena, string $caracteresPermitidos):void{

		//Aplicamos configuracion de validacion en base a los caracteres permitidos.
		if (preg_match($caracteresPermitidos, $cadena) !== 1) {
        	throw new Exception("La propiedad: {$propiedad} " . self::MENSAJE_DE_ERROR['caracteresInvalidos']);
    	}

	}//fin function verificarCaracteresEspeciales


	private function validarLongitudDeCadena(string $propiedad, string $cadena, int $longitudMinima, int $longitudMaxima):void {

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


	private function validarString(string $propiedad, string $cadena, string $caracteresPermitidos, int $longitudMinima, int $longitudMaxima):void {

		//Limpiamos espacios en blanco al principio y al final de la cadena.
		$cadenaLimpia = trim($cadena);

		/*Verifica que la cadena contenga solo caracteres permitidos. Almacena "true" en "$this->disparador" si la cadena es valida, de lo contrario, almacena "false".*/
		$this->verificarCaracteresEspeciales($propiedad, $cadenaLimpia, $caracteresPermitidos);

		//Validámos la longitud de la cadena;
		$this->validarLongitudDeCadena($propiedad, $cadenaLimpia, $longitudMinima, $longitudMaxima);

		$this->datosSanitizados[$propiedad] = $cadenaLimpia;

	}//fin function validarString	


	private function validarLimitesAbsolutos(mixed $numeroAComparar, string $propiedad, float $limiteMinimo, float $limiteMaximo):void {

		//Comparamos si el valor absoluto del numero a comparar es inferior al minimo permitido.
		if($numeroAComparar < $limiteMinimo) {
		   throw new Exception("El valor: $numeroAComparar almacenado en la propiedad: $propiedad " . self::MENSAJE_DE_ERROR['valorAbsolutoInferior'] . ". Limite permitido: $limiteMinimo");	
		}

		//Comparamos si el valor absoluto del numero a comparar es superior al minimo permitido.
		if($numeroAComparar > $limiteMaximo){
		   throw new Exception("El valor: $numeroAComparar almacenado en la propiedad: $propiedad " . self::MENSAJE_DE_ERROR['valorAbsolutoSuperior'] . ". Limite permitido: $limiteMaximo");  
		}

		$this->datosSanitizados[$propiedad] = $numeroAComparar;

	}//fin function validarLimitesAbsolutosEnteros


	private function validarNumeroEntero(mixed $numeroAComparar, string $propiedad, int $valorAbsolutoMinimo, int $valorAbsolutoMaximo):void{

		$numeroSanitizado = filter_var($numeroAComparar, FILTER_SANITIZE_NUMBER_INT);

		//Almacenamos el valor entero.
		$valorEnteroAComparar = filter_var($numeroSanitizado, FILTER_VALIDATE_INT);
		
		if ($valorEnteroAComparar === false) {
        	throw new Exception("El valor de $propiedad " . self::MENSAJE_DE_ERROR['valorNumericoEnteroInvalido']);
    	}

		$this->validarLimitesAbsolutos($valorEnteroAComparar, $propiedad, $valorAbsolutoMinimo, $valorAbsolutoMaximo); 
	
	}//fin function validarValorNumericoAbsoluto


	private function validarNumeroDecimal(mixed $valor, string $propiedad, float $valorAbsolutoMinimo, float $valorAbsolutoMaximo):void{

		$numeroSanitizado = filter_var($valor, FILTER_SANITIZE_NUMBER_FLOAT);

		//Se valida el valor decimal recibído.
    	$valorDecimal = filter_var($numeroSanitizado, FILTER_VALIDATE_FLOAT);
    
    	if ($valorDecimal === false) {
        	throw new Exception("El valor de $propiedad " . self::MENSAJE_DE_ERROR['valorNumericoDecimalInvalido']);
    	}

    	$this->validarLimitesAbsolutos($valorDecimal, $propiedad, $valorAbsolutoMinimo, $valorAbsolutoMaximo);

	}//fin function validarNumeroDecimal


	private function validarBooleano($valor, string $propiedad): bool {
    	// filter_var con FILTER_VALIDATE_BOOLEAN acepta "1", "true", "on", "yes"
    	// y los convierte a true. Muy útil para parámetros de URL.
    	$valorBool = filter_var($valor, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    
    	if ($valorBool === null) {
        	throw new Exception("La propiedad $propiedad debe ser un booleano (true/false).");
    	}
    	return $valorBool;
	}


	private function validarDatoPorTipo(mixed $valor, string $propiedad, array $restricciones):void{

		switch ($restricciones['tipoDeDatoAValidar']) {

        	case 'int':
            	$this->validarNumeroEntero($valor, $propiedad, $restricciones['valorAbsolutoMinimo'], $restricciones['valorAbsolutoMaximo']);
            break;
        	case 'float':
            	$this->validarNumeroDecimal($valor, $propiedad, $restricciones['valorAbsolutoMinimo'], $restricciones['valorAbsolutoMaximo']);
            break;
        	case 'bool':
            	//$this->validarBooleano($valor, $propiedad);
            break;

    	}//fin switch

	}//fin function validarDatoPorTipo


	public function devolverValidarDatosEnArrayDeSesion(array $respuesta):void{
		$this->validarDatosEnArrayDeSesion($respuesta);
	}//fin function devolverValidarDatosEnArrayDeSesion

	public function devolverValidarPeticion():void{
		$this->validarPeticion();
	}//fin function devolverValidarPeticion

	public function devolverAlmacenarError(array $rastreoDeError, string $mensajeDeError):array {
		return $this->almacenarError($rastreoDeError, $mensajeDeError);
	}

	public function devolverCodigoHTTP():int{
		return $this->codigoHTTP;
	}//fin function devolverCodigoHTTP

	public function devolverDatosSanitizados(): array {
    	// Si ninguna excepción es lanzada, se devuelve el array con los datos sanitizados.
    	return $this->datosSanitizados;
	}//fin function devolverDatosSanitizados

	public function devolverSeccion(): string{
		return $this->datosRecibidos['seccion'];
	}//fin function devolverSeccion

}//fin class validar

?>