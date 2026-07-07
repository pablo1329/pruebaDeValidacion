<?php 
class CRUD {
	
	private const CONSULTAS = ['obtenerTodosLosOrigenesDeIngreso'=>['consulta'=>'SELECT * FROM origen_ingreso',
        															'tipos'=>''],
        					   'obtenerTodasLasCategoriasDeGastos'=>['consulta'=>'SELECT * FROM categoria_gasto',
        															 'tipos'=>''],
        					   'obtenerUltimoIngresoPorOrigenDeIngreso'=>['consulta'=>'SELECT (MAX(MES)) AS MES, (MAX(AÑO)) AS AÑO, ORIGEN, IMPORTE FROM ingreso  													JOIN origen_ingreso ON ID_ORIGEN = FK_INGRESO_ORIGEN_INGRESO 
        					   														   WHERE FK_INGRESO_ORIGEN_INGRESO= ?',
        																  'tipos'=>'i'],
        					   'buscarIngresoDuplicado'=>['consulta'=>'SELECT * FROM ingreso WHERE FK_INGRESO_ORIGEN_INGRESO = ? AND 
        					   																		  MES = ? AND 
        					   																		  AÑO = ?',
        													  'tipos'=>'iii'],
        					   'itemGuardarIngreso'=>['consulta'=>'INSERT INTO ingreso(IMPORTE, FK_INGRESO_ORIGEN_INGRESO, DIA, MES, AÑO) VALUES (?, ?, ?, ?, ? )',
        											  'tipos'=>'diiii']
    ];
	
	public function __construct(){}//fin constructor


	public function asignarConsultasPorSeccion(string $seccion): array {
    	return self::CONSULTAS[$seccion] ?? throw new Exception("Consulta no encontrada: $seccion");
	}//fin function asignarConsultasPorSeccion


}//fin class CRUD
?>