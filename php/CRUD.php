<?php 
class CRUD {
	
	private const CONSULTAS = ['obtenerTodosLosOrigenesDeIngreso'=>['consulta'=>'SELECT * FROM origen_ingreso',
        															'tipos'=>''],
        					   'obtenerTodasLasCategoriasDeGastos'=>['consulta'=>'SELECT * FROM categoria_gasto',
        															 'tipos'=>''],
        					   'obtenerUltimoIngresoPorOrigenDeIngreso'=>['consulta'=>'SELECT ID_INGRESO, FK_INGRESO_ORIGEN_INGRESO, DIA, MES, AÑO, ORIGEN, IMPORTE FROM ingreso
																					   JOIN origen_ingreso ON ID_ORIGEN = FK_INGRESO_ORIGEN_INGRESO 
																					   WHERE FK_INGRESO_ORIGEN_INGRESO = ?
																					   ORDER BY AÑO DESC, MES DESC
																					   LIMIT 1',
        																  'tipos'=>'i'],
        					   'obtenerUltimoSaldoPorOrigenDeIngreso'=>['consulta'=>'SELECT ID_SALDO, FK_SALDO_ORIGEN_INGRESO, DIA, MES, AÑO, ORIGEN, IMPORTE FROM saldo
																					 JOIN origen_ingreso ON ID_ORIGEN = FK_SALDO_ORIGEN_INGRESO 
																					 WHERE FK_SALDO_ORIGEN_INGRESO = ?
																					 ORDER BY AÑO DESC, MES DESC
																					 LIMIT 1',
        																  'tipos'=>'i'],
        					   'buscarIngresoDuplicado'=>['consulta'=>'SELECT * FROM ingreso WHERE FK_INGRESO_ORIGEN_INGRESO = ? AND 
        					   																		  MES = ? AND 
        					   																		  AÑO = ?',
        													  'tipos'=>'iii'],
        					   'buscarIngresoPorMesAño'=>['consulta'=>'SELECT ID_INGRESO, AÑO, MES, DIA, ORIGEN, IMPORTE FROM ingreso 
																	   JOIN origen_ingreso ON ID_ORIGEN = FK_INGRESO_ORIGEN_INGRESO 
																	   WHERE AÑO = ? AND 
        					   												 MES = ?',
        											      'tipos'=>'ii'],
        					   'buscarIngresoPorMesAñoOrigenDeIngreso'=>['consulta'=>'SELECT ID_INGRESO, AÑO, MES, DIA, ORIGEN, IMPORTE FROM ingreso 
																					  JOIN origen_ingreso ON ID_ORIGEN = FK_INGRESO_ORIGEN_INGRESO 
 																					  WHERE FK_INGRESO_ORIGEN_INGRESO = ?  AND 
        					   																AÑO = ? AND 
        					   																MES = ?',
        											      				 'tipos'=>'iii'],
        					   'buscarGastosPorAñoMesSaldo'=>['consulta'=>'SELECT ID_GASTO, DIA, MES, AÑO, CATEGORIA, FK_GASTO_SALDO, IMPORTE, DETALLE 													FROM gasto
																		   JOIN categoria_gasto ON ID_CATEGORIA_GASTO = FK_GASTO_CATEGORIA_GASTO
																		   WHERE FK_GASTO_SALDO = ? AND
																		   MES = ? AND
																		   AÑO = ?
																		   ORDER BY DIA DESC, MES, AÑO',
        											      	  'tipos'=>'iii'],
        					   'buscarGastosPorAñoMesSaldoCategoriaDeGasto'=>['consulta'=>'SELECT ID_GASTO, DIA, MES, AÑO, CATEGORIA, FK_GASTO_SALDO, IMPORTE, 															DETALLE FROM gasto
																						   JOIN categoria_gasto ON ID_CATEGORIA_GASTO = FK_GASTO_CATEGORIA_GASTO
																						   WHERE FK_GASTO_SALDO = ? AND 	                    
																						   FK_GASTO_CATEGORIA_GASTO = ? AND
																						   MES = ? AND
																						   AÑO = ?
																						   ORDER BY DIA DESC, MES, AÑO',
        											      			  		  'tipos'=>'iiii'],
        					   'buscarGastoPorId'=>['consulta'=>'SELECT ID_GASTO, DIA, MES, AÑO, CATEGORIA, FK_GASTO_SALDO, IMPORTE, 															DETALLE FROM gasto
																 JOIN categoria_gasto ON ID_CATEGORIA_GASTO = FK_GASTO_CATEGORIA_GASTO
																 WHERE ID_GASTO = ?
																 ORDER BY DIA, MES, AÑO',
        											      	     'tipos'=>'i'],
        			           'buscarGastoTotalPorAñoMesInputSaldoInputCategoriaDeGasto'=>['consulta'=>'SELECT CATEGORIA, (SUM(IMPORTE)) AS IMPORTE_TOTAL FROM gasto
																										 JOIN categoria_gasto ON ID_CATEGORIA_GASTO = FK_GASTO_CATEGORIA_GASTO
																										 WHERE FK_GASTO_SALDO = ? AND 	                    
																										 FK_GASTO_CATEGORIA_GASTO = ? AND
																										 MES = ? AND
																										 AÑO = ?',
        											      	     							'tipos'=>'iiii'],
        					   'buscarSaldoPorId'=>['consulta'=>'SELECT ORIGEN, IMPORTE, DIA, MES, AÑO FROM saldo 
																 JOIN origen_ingreso ON ID_ORIGEN = FK_SALDO_ORIGEN_INGRESO
																 WHERE ID_SALDO = ?',
        											'tipos'=>'i'],
        						'buscarSaldoPorFkSaldoIngreso'=>['consulta'=>'SELECT * FROM saldo 
        						                                              WHERE  FK_SALDO_INGRESO = ?',
        													     'tipos'=>'i'],
        					   'guardarIngreso'=>['consulta'=>'INSERT INTO ingreso(IMPORTE, FK_INGRESO_ORIGEN_INGRESO, DIA, MES, AÑO) VALUES (?, ?, ?, ?, ? )',
        											  'tipos'=>'diiii'],
        					   'guardarGasto'=>['consulta'=>'INSERT INTO gasto(FK_GASTO_SALDO, FK_GASTO_CATEGORIA_GASTO, DETALLE, IMPORTE, DIA, MES, AÑO) VALUES (?,?,?,?,?,?,?)',
        											  'tipos'=>'iisdiii'],
        					   'guardarSaldo'=>['consulta'=>'INSERT INTO saldo(IMPORTE, FK_SALDO_INGRESO, FK_SALDO_ORIGEN_INGRESO, DIA, MES, AÑO) VALUES (?,?,?,?,?,?)',
        										'tipos'=>'diiiii'],
        					   'modificarSaldoPorOrigen'=>['consulta'=>'UPDATE saldo SET IMPORTE = ?, DIA = ?, MES = ?, AÑO = ? WHERE ID_SALDO = ?',
        												   'tipos'=>'diiii'],
        					   'modificarSaldoPorId'=>['consulta'=>'UPDATE saldo SET IMPORTE = ? 
        					   										WHERE ID_SALDO = ?',
        											   'tipos'=>'di'],
        					   'eliminarGastoPorId'=>['consulta'=>'DELETE FROM gasto WHERE ID_GASTO =  ?',
        											  'tipos'=>'i'],
        					   'eliminarSaldoPorId'=>['consulta'=>'DELETE FROM saldo WHERE ID_SALDO = ?',
        											  'tipos'=>'i'],
        					   'eliminarIngresoPorId'=>['consulta'=>'DELETE FROM ingreso WHERE ID_INGRESO = ?',
        											    'tipos'=>'i']
        												   
    ];
	
	public function __construct(){}//fin constructor


	public function asignarConsultasPorSeccion(string $seccion): array {
    	return self::CONSULTAS[$seccion] ?? throw new Exception("Consulta no encontrada: $seccion");
	}//fin function asignarConsultasPorSeccion


}//fin class CRUD
?>