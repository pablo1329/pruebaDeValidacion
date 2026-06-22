function obtenerIdsDeInputsDeFormularioPorSolicitud(){}//fin function obtenerIdsDeInputsDeFormularioPorSolicitud


function obtenerDatosDeFormularioPorSolicitud(solicitud){

	let inputFormulario = ['inputFecha', 'inputOrigenDeIngreso', 'inputImporte'];

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