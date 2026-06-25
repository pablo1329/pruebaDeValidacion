<?php 
class CRUD {
	
	private const CONSULTAS = ['obtenerTodosLosOrigenesDeIngreso'=>['consulta'=>'SELECT * FROM origen_ingreso',
        															'tipos'=>''],
        					   'obtenerTodasLasCategoriasDeGastos'=>['consulta'=>'SELECT * FROM categoria_gasto',
        															 'tipos'=>''],
        					   'itemGuardarIngreso'=>['consulta'=>'INSERT INTO ingreso(FECHA, IMPORTE, FK_INGRESO_ORIGEN_INGRESO) VALUES (?,?,?)',
        											  'tipos'=>'sdi']
    ];
	
	public function __construct(){}//fin constructor


	public function asignarConsultasPorSeccion(string $seccion): array {
    	return self::CONSULTAS[$seccion] ?? throw new Exception("Consulta no encontrada: $seccion");
	}//fin function asignarConsultasPorSeccion


}//fin class CRUD
?>