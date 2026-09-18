addEventListener("DOMContentLoaded", (event) => {
	
	try	{
		almacenarDatos();
		imprimirTodosLosIngresos();
		imprimirTodosLosSaldos();
		almacenarFechaActualEnFormulario();
		detectarInteraccionConBarraDeInicio();
		inicializarEventosFormulario();
	} catch(error) {
    	console.error('Error en la solicitud:', error);
    }

});