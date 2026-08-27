addEventListener("DOMContentLoaded", (event) => {
	
	try	{
		almacenarDatos();
		procesarSolicitudAlServidor('obtenerDatosPorIngreso');
		procesarSolicitudAlServidor('obtenerDatosDeSaldoPorIngreso');
		detectarInteraccionConBarraDeInicio();
		inicializarEventosFormulario();
	} catch(error) {
    	console.error('Error en la solicitud:', error);
    }

});