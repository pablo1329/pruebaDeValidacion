function almacenarDatosPorId(idsDeInputsDeFormulario){

	let datosDeFormulario = {};

	idsDeInputsDeFormulario.forEach((element) => {
		datosDeFormulario.element = document.getElementById(element).value;
	});

	return datosDeFormulario;

}//fin function almacenarDatosPorId


function obtenerIdsDeInputsDeFormularioPorSolicitud(solicitud){

	let idsDeInputs = [];

	switch(solicitud){

		case'itemGuardarIngreso':
			idsDeInputs = ['inputFecha', 'inputOrigenDeIngreso', 'inputImporte'];
		break;
		case'itemGuardarGasto':
			idsDeInputs = ['inputFecha', 'inputOrigenDeIngreso', 'inputCategoriaDeGasto', 'inputDetalleDelGasto', 'inputImporte'];
		break;
		case'itemBuscarIngreso':
			idsDeInputs = ['inputFecha', 'inputOrigenDeIngreso'];
		break;
		case'itemBuscarGastos':
			idsDeInputs = ['inputFecha', 'inputOrigenDeIngreso', 'inputCategoriaDeGasto', 'inputDetalleDelGasto', 'inputImporte'];
		break;

	}//fin switch

	return idsDeInputs;

}//fin function obtenerIdsDeInputsDeFormularioPorSolicitud


function obtenerDatosDeFormularioPorSolicitud(solicitud){

	let idsDeInputsDeFormulario = obtenerIdsDeInputsDeFormularioPorSolicitud(solicitud);

	let datosDeFormulario = almacenarDatosPorId(idsDeInputsDeFormulario);

	console.log(datosDeFormulario);

}//fin function obtenerDatosPorNombreDeBotonDeFormulario


function detectarEnvioDeFormulario(solicitud){

	let botonDeFormulario = document.getElementById('botonForm');

	botonDeFormulario.addEventListener('click', ()=>{
		obtenerDatosDeFormularioPorSolicitud(solicitud);
	});

}//fin function detectarEnvioDeFormulario


function detectarInteraccionConBarraDeInicio(){
	
	let elementosDeListaPrincipal = document.querySelectorAll('li');

	elementosDeListaPrincipal.forEach((element) => element.addEventListener('click', ()=>{
		administrarVistaDeFormularioPorId(element.getAttribute('id'));
		detectarEnvioDeFormulario(element.getAttribute('id'));
	}) );

}//fin function detectarInteraccionConBarraDeInicio