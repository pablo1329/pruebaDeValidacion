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


  private function ejecutar(string $sql, array $params = [], string $types = ""): mysqli_result|int {

    $stmt = $this->enlace->prepare($sql);  
    if (!empty($params)) {
      $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    // Si es un SELECT, devolvemos el resultado; si es INSERT/UPDATE, filas afectadas
    $result = $stmt->get_result();
    $stmt->close();
    return ($result instanceof mysqli_result) ? $result : $stmt->affected_rows;
    
  }


  public function devolverEjecutarConsulta(string $sql, array $params = [], string $types = ""): mysqli_result|int{
    return $this->ejecutar($sql, $params, $types);
  }//fin function devolverEjecutarConsulta

  public function __destruct() {
    if (isset($this->enlace) && $this->enlace instanceof mysqli) {
      $this->enlace->close();
    }
  }


}//fin class MysqliDB

?>