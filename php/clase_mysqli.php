<?php 
class MysqliDB {
	
	/*----------PROPIEDADES----------*/

    private mysqli $enlace;

    private ?mysqli_stmt $sentencia = null;

  /*---------/PROPIEDADES----------*/

	public function __construct(string $host, string $usuario, string $clave, string $bd) {
   
    //Se activa el reporte de informes para mysqli.
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $this->enlace = new mysqli($host, $usuario, $clave, $bd);
    $this->enlace->set_charset('utf8mb4');

  }//fin constructor


  public function ejecutar(string $sql, array $params = [], string $types = ""): mysqli_result|bool {

    $stmt = $this->enlace->prepare($sql);
    if (!empty($params)) $stmt->bind_param($types, ...$params);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $status = ($result instanceof mysqli_result) ? $result : $stmt->affected_rows > 0;
    
    $stmt->close();
    return ($result instanceof mysqli_result) ? $result : $status;

  }//fin function ejecutar


  public function devolverEjecutarConsulta(string $sql, array $params = [], string $types = ""): mysqli_result|int{
    return $this->ejecutar($sql, $params, $types);
  }//fin function devolverEjecutarConsulta
  

  /**
   * Cierra la conexión a la base de datos de forma segura
   * @return void
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
        if ($this->enlace->ping()) {
          $this->enlace->close();
        }
      }
    } catch (Exception $e) {
      // Log del error (opcional)
      error_log("Error al cerrar conexión BD: " . $e->getMessage());
    }
  }//fin function cerrarConexion


  /**
   * Destructor seguro: Se ejecuta automáticamente al finalizar
   * Atrapa excepciones para evitar que rompan el script
   * @return void
   */
  public function __destruct() {
    try {
      $this->cerrarConexion();
    } catch (Throwable $e) {
      // En destructores no se pueden lanzar excepciones
      error_log("Error fatal en destructor de MysqliDB: " . $e->getMessage());
    }
  }//fin function __destruct


}//fin class MysqliDB

?>
