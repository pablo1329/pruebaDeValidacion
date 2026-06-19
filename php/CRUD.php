<?php 
class CRUD {
	
	private const CONSULTAS = ['buscarDatosPorNombreDeCivilizacion'=>['consulta'=>'SELECT * FROM unidad WHERE FK_ID_CIVILIZACION  = ?',
        															  'tipos'=>'i'],
        					   'obtenerTodosLosOrigenesDeIngreso'=>['consulta'=>'SELECT * FROM origen_ingreso',
        															'tipos'=>''],
        					   'obtenerTodasLasCategoriasDeGastos'=>['consulta'=>'SELECT * FROM categoria_gasto',
        															 'tipos'=>'']
    ];
	
	public function __construct(){}//fin constructor


	public function asignarConsultasPorSeccion(string $seccion): array {
    	return self::CONSULTAS[$seccion] ?? throw new Exception("Consulta no encontrada: $seccion");
	}//fin function asignarConsultasPorSeccion


}//fin class CRUD
?>