addEventListener("DOMContentLoaded", (event) => {
	
	try	{
		almacenarDatos();
		imprimirTodosLosIngresos();
		imprimirTodosLosSaldos();
		imprimirTodasLasImagensPorSaldo();
		detectarInteraccionConBarraDeInicio();
		inicializarEventosFormulario();
	} catch(error) {
    	console.error('Error en la solicitud:', error);
    }

});