<?php 
class MysqliDB {
	
	private mysqli $enlace;
	private ?mysqli_stmt $sentencia = null;
	private int $codigoHTTP = 200;

	public function __construct(string $host, string $usuario, string $clave, string $bd) {
    	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    	$this->enlace = new mysqli($host, $usuario, $clave, $bd);
    	$this->enlace->set_charset('utf8mb4');
	}

	public function ejecutar(string $sql, array $params = [], string $types = ""): mysqli_result|bool {
    	$stmt = $this->enlace->prepare($sql);
    	if (!empty($params)) $stmt->bind_param($types, ...$params);
    	$stmt->execute();
    	
    	$result = $stmt->get_result();
    	$status = ($result instanceof mysqli_result) ? $result : $stmt->affected_rows > 0;
    	
    	$stmt->close();
    	return ($result instanceof mysqli_result) ? $result : $status;
	}

	public function devolverEjecutarConsulta(string $sql, array $params = [], string $types = ""): mysqli_result|int {
    	return $this->ejecutar($sql, $params, $types);
	}
	
	/**
	 * Obtiene el código HTTP asociado al último error
	 * @return int Código HTTP (200, 400, 500, 503, etc.)
	 */
	public function devolverCodigoHTTP(): int {
    	return $this->codigoHTTP;
	}

	/**
	 * Cierra la conexión a la base de datos de forma segura
	 * Valida el estado y lanza excepciones si algo falla
	 * @return void
	 * @throws Exception
	 */
	public function cerrarConexion(): void {
    	try {
        	// Cerrar statement si existe
        	if ($this->sentencia instanceof mysqli_stmt) {
            	@$this->sentencia->close();
            	$this->sentencia = null;
        	}
        	
        	// Cerrar conexión a BD
        	if ($this->enlace instanceof mysqli) {
            	// Verificar que la conexión esté activa
            	if (!$this->enlace->ping()) {
                	$this->codigoHTTP = 503; // Service Unavailable
                	throw new Exception("La conexión a la base de datos no está disponible");
            	}
            	
            	// Cerrar conexión (mysqli lanza excepciones si falla)
            	$this->enlace->close();
        	}
    	} catch (mysqli_sql_exception $e) {
        	// Excepciones específicas de mysqli
        	// 1045: Access denied (credenciales inválidas)
        	// 1049: Unknown database (BD no existe)
        	// 2002: Connection refused (servidor BD caído)
        	// 2003: Can't connect to MySQL (servidor no accesible)
        	
        	$codigoMysqli = $e->getCode();
        	
        	if ($codigoMysqli == 1045 || $codigoMysqli == 1049) {
            	$this->codigoHTTP = 400; // Bad Request
        	} elseif ($codigoMysqli == 2002 || $codigoMysqli == 2003) {
            	$this->codigoHTTP = 503; // Service Unavailable
        	} else {
            	$this->codigoHTTP = 500; // Internal Server Error
        	}
        	
        	throw new Exception("Error al cerrar conexión BD: " . $e->getMessage(), $this->codigoHTTP, $e);
    	}
	}


	/**
	 * Destructor seguro: Se ejecuta automáticamente al finalizar
	 * Atrapa excepciones para evitar que rompan el script
	 * Los destructores no pueden lanzar excepciones
	 * @return void
	 */
	public function __destruct() {
    	try {
        	$this->cerrarConexion();
    	} catch (Throwable $e) {
        	// Registrar error en Logger
        	//registrarError(string $mensaje, string $contexto = '', string $tipo = 'ERROR')
        	Logger::registrarError(
        	    $e->getMessage(),
        	    'MYSQLI_DESTRUCTOR_ERROR',
        	    'ERROR'
        	);
    	}
	}

}
?>
