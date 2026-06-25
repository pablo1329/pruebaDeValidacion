const CONFIGURACION_FORMULARIOS = {
    'itemGuardarIngreso': ['inputFecha', 'inputOrigenDeIngreso', 'inputImporte'],
    'itemGuardarGasto': ['inputFecha', 'inputOrigenDeIngreso', 'inputCategoriaDeGasto', 'inputDetalleDelGasto', 'inputImporte']
};


function almacenarDatosPorId(idsDeInputsDeFormulario){

	let datosDeFormulario = {};

    idsDeInputsDeFormulario.forEach((id) => {
        // Usamos [id] para que la clave sea, por ejemplo, "inputFecha" 
        // y no la palabra literal "element"
        const inputElement = document.getElementById(id);
        
        // Es buena práctica verificar si el elemento existe antes de acceder a .value
        datosDeFormulario[id] = inputElement ? inputElement.value : null;
    });

    return datosDeFormulario;

}//fin function almacenarDatosPorId


function obtenerIdsDeInputsDeFormularioPorSolicitud(solicitud){

	return CONFIGURACION_FORMULARIOS[solicitud] || [];

}//fin function obtenerIdsDeInputsDeFormularioPorSolicitud


function obtenerDatosDeFormularioPorSolicitud(solicitud){

	let idsDeInputsDeFormulario = obtenerIdsDeInputsDeFormularioPorSolicitud(solicitud);

	let datosDeFormulario = almacenarDatosPorId(idsDeInputsDeFormulario);

	datosDeFormulario.seccion = solicitud;

	console.log(datosDeFormulario);
	return datosDeFormulario; 

}//fin function obtenerDatosPorNombreDeBotonDeFormulario


function procesarSolicitudAlServidor(solicitud){

	switch(solicitud){
		case'itemGuardarIngreso':
			guardarDatos(solicitud).then(resultado=>console.log(resultado));	
		break;
		case'itemGuardarGasto':
			
		break;
		case'itemBuscarIngreso':
			
		break;
		case'itemBuscarGastos':
		break;
	}

}//fin function procesarSolicitudAlServidor


function detectarEnvioDeFormulario(solicitud){

	let botonDeFormulario = document.getElementById('botonForm');

	let datosDeFormulario = {};

	botonDeFormulario.addEventListener('click', (event)=>{
		event.preventDefault();
		//datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);
		procesarSolicitudAlServidor(solicitud);
	});

}//fin function detectarEnvioDeFormulario


function detectarInteraccionConBarraDeInicio(){
	
	let elementosDeListaPrincipal = document.querySelectorAll('li');

	elementosDeListaPrincipal.forEach((element) => element.addEventListener('click', ()=>{
		administrarVistaDeFormularioPorId(element.getAttribute('id'));
		detectarEnvioDeFormulario(element.getAttribute('id'));
	}) );

}//fin function detectarInteraccionConBarraDeInicio