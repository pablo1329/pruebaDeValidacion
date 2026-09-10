addEventListener("DOMContentLoaded", (event) => {
	
	try	{
		almacenarDatos();
		imprimirTodosLosIngresos();
		imprimirTodosLosSaldos();
		imprimirTodasLasImagensPorSaldo();
		detectarInteraccionConBarraDeInicio();
		inicializarEventosFormulario();

		function imprimirNombre(nombre){
			console.log(nombre);
		}

		callback(imprimirNombre);

	} catch(error) {
    	console.error('Error en la solicitud:', error);
    }

});