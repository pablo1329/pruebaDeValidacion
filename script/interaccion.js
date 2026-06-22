function detectarEnvioDeFormulario(){

	let botonDeFormulario = document.getElementById('botonForm');

	botonDeFormulario.addEventListener('click', ()=>{
		
	});

}//fin function detectarEnvioDeFormulario


function detectarInteraccionConBarraDeInicio(){
	
	let elementosDeListaPrincipal = document.querySelectorAll('li');

	elementosDeListaPrincipal.forEach((element) => element.addEventListener('click', ()=>{
		administrarVistaDeFormularioPorId(element.getAttribute('id'));
		detectarEnvioDeFormulario();
	}) );

}//fin function detectarInteraccionConBarraDeInicio