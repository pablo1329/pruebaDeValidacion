addEventListener("DOMContentLoaded", (event) => {
	
	try	{
		almacenarDatos();
		imprimirTodosLosIngresos();
		imprimirTodosLosSaldos();
		almacenarFechaActualEnFormulario();
		detectarInteraccionConBarraDeInicio();
		inicializarEventosFormulario();

		/*console.log(formatearNumero('2,04'));
		console.log(parseFloat('2,07'));*/

	} catch(error) {
    	console.error('Error en la solicitud:', error);
    }

});