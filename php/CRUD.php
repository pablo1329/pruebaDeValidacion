<?php 
class CRUD {
	
	private const CONSULTAS = ['buscarDatosPorNombreDeCivilizacion'=>['consulta'=>'SELECT * FROM unidad WHERE RELA_CIVILIZACION = ?',
        															  'tipos'=>'i']
    ];
	
	public function __construct(){}//fin constructor


	public function asignarConsultasPorSeccion(string $seccion): array {
    	return self::CONSULTAS[$seccion] ?? throw new Exception("Consulta no encontrada: $seccion");
	}//fin function asignarConsultasPorSeccion


}//fin class CRUD
?>