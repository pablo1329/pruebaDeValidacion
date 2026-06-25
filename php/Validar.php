<?php 
class Validar {

	private array $matrizArgumentos = [];

	private array $propiedades = [];

	private array $restricciones = [];

	private int $cantidadDePropiedades = 0;

	private string $metodoHTTP = '';

	private array $datosRecibidos = [];

	private array $datosSanitizados = [];

	private const RESTRICCIONES = [	'seccion'=>['obligatorio'=>true,
						           	 			'longitudMinima'=>2,
						           	 			'longitudMaxima'=>50,
						           	 			'caracteresPermitidos'=>'/^[a-zA-Z]+$/',
						           	 			'tipoDeDatoAValidar'=>'string',
						          			    'valorAbsolutoMinimo'=>0,
						         		 	    'valorAbsolutoMaximo'=>0],
						         		 	   
						         	'inputImporte'=>['obligatorio'=>true,
						           	 			     'longitudMinima'=>1,
						           	 			     'longitudMaxima'=>15,
						           	 			     'caracteresPermitidos'=>'/^\d+(\.\d+)?$/',
						           	 			     'tipoDeDatoAValidar'=>'float',
						          			         'valorAbsolutoMinimo'=>0.00,
						         		 	         'valorAbsolutoMaximo'=>999999999.99],

						         	'inputOrigenDeIngreso'=>['obligatorio'=>true,
						           	 			             'longitudMinima'=>1,
						           	 			             'longitudMaxima'=>11,
						           	 			             'caracteresPermitidos'=>'/^[0-9]+$/',
						           	 			             'tipoDeDatoAValidar'=>'int',
						          			                 'valorAbsolutoMinimo'=>1,
						         		 	                 'valorAbsolutoMaximo'=>9],

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

						         	'inputFecha'=>['obligatorio'=>true,
						           			  	   'longitudMinima'=>8,
						           			  	   'longitudMaxima'=>15,
						           			       'caracteresPermitidos'=>'/^[0-9-]+$/',
						           			       'tipoDeDatoAValidar'=>'date',
						          			       'valorAbsolutoMinimo'=>0,
						         		 	       'valorAbsolutoMaximo'=>0],

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

							 	 'obtenerTodosLosOrigenesDeIngreso'=>['seccion'],

							 	 'obtenerTodasLasCategoriasDeGastos'=>['seccion'],
							 	 
							 	 'itemGuardarIngreso'=>['seccion',
							 							'inputFecha',
							 							'inputImporte',
							 							'inputOrigenDeIngreso']
	];

	private const METODOS_PERMITIDOS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];


	public function __construct(){}//fin constructor


	private function validarMetodoDeRespuesta():void{

		$this->metodoHTTP = $_SERVER['REQUEST_METHOD'];
		
		if(!in_array($this->metodoHTTP, self::METODOS_PERMITIDOS)){
			Logger::registrarError('405', 'claseValidar');
		}

	}//fin function validarMetodoDeRespuesta


	private function validarHTTPAcept():void{

		//Validar CONTENT-TYPE (esperamos application/json)
		if (empty($_SERVER['HTTP_ACCEPT']) || 
	        $_SERVER['HTTP_ACCEPT'] !== 'application/json'){
			Logger::registrarError('406', 'claseValidar');
		}

	}//fin function validarHTTPAcept


	private function validarContentType():void{

		// Si es GET, no necesitamos validar Content-Type, así que retornamos inmediatamente
    	if ($this->metodoHTTP === 'GET') {
        	return;
    	}

    	// Si NO es GET, entonces sí validamos obligatoriamente que sea application/json
    	//if (!isset($_SERVER['HTTP_CONTENT_TYPE']) || $_SERVER['HTTP_CONTENT_TYPE'] !== 'application/json') {
    	if (!isset($_SERVER['CONTENT_TYPE']) || $_SERVER['CONTENT_TYPE'] !== 'application/json') {
    		Logger::registrarError('415', 'claseValidar');
    	}

	}//fin function validarContentType


	private function validarArrayVacio(array $datosRecibidos):void{

		//Se valida si el array está vacío.
    	if (empty($datosRecibidos)) {
    		Logger::registrarError('arrayVacio', 'claseValidar');
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
		   Logger::registrarError('errorAlIniciarSesion', 'claseValidar');
		}

	}//fin function validarDatosEnArrayDeSesion


	private function verificarFecha(mixed $fechaAComparar, string $propiedad):void{

		// 1. Limpiar errores de sesiones anteriores de DateTime
    	// Esto es crucial si vas a llamar a esta función varias veces
    	DateTime::createFromFormat('Y-m-d', 'dummy'); 

    	$zonaArgentina = new DateTimeZone('America/Argentina/Buenos_Aires');
    	$d = DateTime::createFromFormat('Y-m-d', (string)$fechaAComparar, $zonaArgentina);

    	// 2. Comprobar si el objeto se creó correctamente Y no tiene errores de sintaxis
    	$control = DateTime::getLastErrors();
    
    	if (!$d || ($control["warning_count"] > 0 || $control["error_count"] > 0)) {
        	Logger::registrarError('Fecha invalida', 'claseValidar');
       	 
    	}

    	// 3. Guardamos el objeto DateTime limpio
    	$this->datosSanitizados[$propiedad] = $d->format('Y-m-d');

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
         			Logger::registrarError('propiedadObligatoriaVacia', 'claseValidar');
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

         	//Se valida el dato recibído, según el 'tipoDeDatoAValidar' almacenado en $restricciones[$propiedad]['tipoDeDatoAValidar'] (int, float, bool, etc.)
         	$this->validarDatoPorTipo($this->datosSanitizados[$propiedad], $propiedad, $restricciones);

		}//fin bucle forEach

	}//fin function validarPropiedades


	private function validarValoresVacios(string $propiedad):bool {

		//Verificamos si el valor de la propiedad esta vacío.
		if(empty($propiedad) ) {

			//Si la propiedad obligatorio es true, se almacena un error por qué las propiedades obligatorias no deben estar vacías.
			if($this->restricciones['obligatorio']) {
				Logger::registrarError($propiedad, 'propiedadObligatoriaVacia', 'claseValidar');
			}//fin if($this->restricciones['obligatorio'])

		}//fin if(empty($this->datosRecibidos[$this->propiedades[$i]]) )

	}//fin function validarValoresVacios


	private function validarPropiedadEnArray(string $propiedad):void{

		//Verificamos si los datosRecibidos contienen todas las propiedades obligatorias en base a la seccion.
		if(array_key_exists($propiedad, $this->datosRecibidos) === false) {
			Logger::registrarError($propiedad, 'propiedadNoEcontrada', 'claseValidar');
		}

	}//fin function validarPropiedadEnArray


	private function validarPropiedadesPorSeccion(array $datosRecibidos):void{

		if(array_key_exists($datosRecibidos['seccion'], self::PROPIEDADES) === false){
			Logger::registrarError('seccionInexistente', 'claseValidar');
		}

	}//fin function validarPropiedadesPorSeccion


	private function validarSeccion(array $datosRecibidos):void {

		//Se verifica que la key "seccion", se encuentre en el array de $datosRecibidos.
		if(!array_key_exists('seccion', $datosRecibidos)){
			Logger::registrarError('propiedadNoEcontrada', 'claseValidar');
		}

		//Verificamos si el valor contenido en la key "seccion", no está vacío, de lo contrario se lanza una excepción.
		if(empty($datosRecibidos['seccion'])) {
			Logger::registrarError('propiedadObligatoriaVacia', 'claseValidar');
		} 

		//Validamos si existen propiedades asociadas al valor contenido en "seccion", de lo contrario, se lanza una excepción.
		$this->validarPropiedadesPorSeccion($datosRecibidos);

	}//fin  function validarSeccion


	private function verificarCaracteresEspeciales(string $propiedad, string $cadena, string $caracteresPermitidos):void{

		//Aplicamos configuracion de validacion en base a los caracteres permitidos.
		if (preg_match($caracteresPermitidos, $cadena) !== 1) {
			Logger::registrarError($propiedad, 'caracteresInvalidos', 'claseValidar');
     	}

	}//fin function verificarCaracteresEspeciales


	private function validarLongitudDeCadena(string $propiedad, string $cadena, int $longitudMinima, int $longitudMaxima):void {

		//Almacenamos cantidad de caracteres de la cadena.
		$longitudDeCadena = strlen($cadena);

		//Si la longitud de la cadena es menor a la longitud minima o mayor a la longitud maxima, se estable el disparador a false.
		if($longitudDeCadena < $longitudMinima) {
			Logger::registrarError($propiedad, 'longitudMinima', 'claseValidar');
		}

		if($longitudDeCadena > $longitudMaxima) {
			Logger::registrarError($propiedad, 'longitudMaxima', 'claseValidar');
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
			Logger::registrarError($propiedad,  'valorAbsolutoInferior', 'claseValidar');	
		}

		//Comparamos si el valor absoluto del numero a comparar es superior al minimo permitido.
		if($numeroAComparar > $limiteMaximo){
			Logger::registrarError($propiedad, 'valorAbsolutoSuperior', 'claseValidar');
		}

		$this->datosSanitizados[$propiedad] = $numeroAComparar;

	}//fin function validarLimitesAbsolutos


	private function validarNumeroEntero(mixed $numeroAComparar, string $propiedad, int $valorAbsolutoMinimo, int $valorAbsolutoMaximo):void{

		$numeroSanitizado = filter_var($numeroAComparar, FILTER_SANITIZE_NUMBER_INT);

		//Almacenamos el valor entero.
		$valorEnteroAComparar = filter_var($numeroSanitizado, FILTER_VALIDATE_INT);
		
		if ($valorEnteroAComparar === false) {
			Logger::registrarError('valorNumericoEnteroInvalido', 'claseValidar');
     	}

		$this->validarLimitesAbsolutos($valorEnteroAComparar, $propiedad, $valorAbsolutoMinimo, $valorAbsolutoMaximo); 
	
	}//fin function validarNumeroEntero


	private function validarNumeroDecimal(mixed $valor, string $propiedad, float $valorAbsolutoMinimo, float $valorAbsolutoMaximo):void{

		$numeroSanitizado = filter_var($valor, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);

		//Se valida el valor decimal recibído.
     	$valorDecimal = filter_var($numeroSanitizado, FILTER_VALIDATE_FLOAT);
     
     	if ($valorDecimal === false) {
     		Logger::registrarError($propiedad, 'valorNumericoDecimalInvalido', 'claseValidar');
     	}

     	$this->validarLimitesAbsolutos($valorDecimal, $propiedad, $valorAbsolutoMinimo, $valorAbsolutoMaximo);

	}//fin function validarNumeroDecimal


	/**
	 * Valida y sanitiza valores booleanos
	 * Acepta: true, false, 1, 0, "true", "false", "on", "off", "yes", "no"
	 * @param mixed $valor El valor a validar
	 * @param string $propiedad El nombre de la propiedad
	 * @return void
	 * @throws Exception Si el valor no es un booleano válido
	 */
	private function validarBooleano(mixed $valor, string $propiedad): void {
    	// filter_var con FILTER_VALIDATE_BOOLEAN acepta "1", "true", "on", "yes"
    	// y los convierte a true. Muy útil para parámetros de URL.
    	$valorBool = filter_var($valor, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    
    	if ($valorBool === null) {
    		Logger::registrarError($propiedad, 'valorBooleanoInvalido', 'claseValidar');
    	}
    	
    	// Guardamos el valor sanitizado en el array de datos sanitizados
    	$this->datosSanitizados[$propiedad] = $valorBool;
	}//fin function validarBooleano


	private function validarDatoPorTipo(mixed $valor, string $propiedad, array $restricciones):void{

		switch ($restricciones['tipoDeDatoAValidar']) {

         	case 'int':
             	$this->validarNumeroEntero($valor, $propiedad, $restricciones['valorAbsolutoMinimo'], $restricciones['valorAbsolutoMaximo']);
            break;
         	case 'float':
             	$this->validarNumeroDecimal($valor, $propiedad, $restricciones['valorAbsolutoMinimo'], $restricciones['valorAbsolutoMaximo']);
            break;
         	case 'bool':
             	$this->validarBooleano($valor, $propiedad);
            break;
            case 'date':
            	$this->verificarFecha($valor, $propiedad);
            break;

     	}//fin switch

	}//fin function validarDatoPorTipo


	public function devolverValidarDatosEnArrayDeSesion(array $respuesta):void{
		$this->validarDatosEnArrayDeSesion($respuesta);
	}//fin function devolverValidarDatosEnArrayDeSesion

	public function devolverValidarPeticion():void{
		$this->validarPeticion();
	}//fin function devolverValidarPeticion

	public function devolverDatosSanitizados(): array {
     	// Si ninguna excepción es lanzada, se devuelve el array con los datos sanitizados.
     	return $this->datosSanitizados;
	}//fin function devolverDatosSanitizados

	public function devolverSeccion(): string{
		return $this->datosRecibidos['seccion'];
	}//fin function devolverSeccion

}//fin class Validar

?>
