<?php 
class Transformador {

	/**
	 * Convierte un array asociativo a un array indexado (0, 1, 2, ...)
	 * @param array $datosSanitizados Array con datos a transformar
	 * @return array Array con índices numéricos
	 */
	public static function devolverDatosParaConsultar(array $datosSanitizados): array {
		// Inicializar array vacío
		$datosParaConsultar = [];

		// Recorrer y agregar valores
		foreach ($datosSanitizados as $key => $value) {

			if($key !=='seccion') {
				$datosParaConsultar[] = $value;	
			}
			
		}

		return $datosParaConsultar;

	}//fin function devolverDatosParaConsultar

	/**
	 * Estructura los resultados de la BD en formato JSON amigable
	 * Transforma resultados por filas en resultados por columnas
	 * @param mysqli_result $resultado Resultado de la consulta
	 * @return array Array con cantidad de resultados y datos estructurados
	 * @throws Exception Si el resultado no es válido
	 */
	public static function devolverArrayEstructurado(mysqli_result $resultado): array {

		// Validar que sea un resultado válido
		if (!($resultado instanceof mysqli_result)) {
			throw new Exception("El resultado proporcionado no es un objeto mysqli_result válido");
		}

		$data = [];

		// Recorrer resultados y estructurar por columnas
		while ($row = $resultado->fetch_assoc()) {
			foreach ($row as $key => $value) {
				$data[$key][] = $value;
			}
		}

		// Retornar cantidad de resultados y datos
		return [
			'cantidadDeResultados' => count($data ? $data[array_key_first($data)] : []),
			'datos' => $data
		];

	}//fin function devolverArrayEstructurado


	public static function devolverRespuesta(mixed $resultado): array|string {

		if($resultado instanceof mysqli_result) {
			return self::devolverArrayEstructurado($resultado);
		} else {
			return "Filas afectadas: " . $resultado;
		}
		
	}//fin function devolverRespuesta

}//fin class Transformador
?>
