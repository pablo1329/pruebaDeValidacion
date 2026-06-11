<?php 
class Transformador {

	public static function devolverDatosParaConsultar(array $datosSanitizados): array {

		foreach ($datosSanitizados as $key => $value) {
			$datosDatosParaConsultar[] = $value;
		}

		return $datosDatosParaConsultar;

	}//fin function devolverDatosParaConsultar

    public static function devolverArrayEstructurado(mysqli_result $resultado): array {

        $data = [];

        while ($row = $resultado->fetch_assoc()) {
            foreach ($row as $key => $value) {
                $data[$key][] = $value;
            }
        }
        return [
            'cantidadDeResultados' => count($data ? $data[array_key_first($data)] : []),
            'datos' => $data
        ];
    }

}//fin class Transformador
?>