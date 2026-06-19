function almacenarDatosEnSessionStorage(llave, datos){
	sessionStorage.setItem(llave, datos);
}//fin function mostrarDatos


function mostrarCamposDeFormularioPorId(idDeLista){
	['cajaFecha', 'cajaOrigen', 'cajaCategoriaGasto', 'cajaDetalleDeGasto', 'cajaImporte']
	switch(idDeLista){

		case'itemGuardarIngreso':

		break;
		case'itemGuardarGasto':
			
		break;
		case'itemBuscarIngreso':
			
		break;
		case'itemBuscarGastos':
			
		break;

	}//fin switch

}//fin function mostrarCamposDeFormularioPorId


function detectarInteraccionConBarraDeInicio(){
	
	let elementosDeListaPrincipal = document.querySelectorAll('li');

	elementosDeListaPrincipal.forEach((element) => element.addEventListener('click', ()=>{
		mostrarCamposDeFormularioPorId(element.getAttribute('id'));
	}) );

}//fin function detectarInteraccionConBarraDeInicio


addEventListener("DOMContentLoaded", (event) => {

	let idDeCuerpoDePagina = document.querySelector('body').getAttribute('id');
	
	try	{

		let obtenerTodosLosOrigenesDeIngreso = {'seccion':'obtenerTodosLosOrigenesDeIngreso'}
		solicitarDatosConParametros(obtenerTodosLosOrigenesDeIngreso) 
		 .then(resultado =>(almacenarDatosEnSessionStorage('origenesDeIngreso', resultado)));

		let obtenerTodasLasCategoriasDeGastos = {'seccion':'obtenerTodasLasCategoriasDeGastos'}
		solicitarDatosConParametros(obtenerTodasLasCategoriasDeGastos) 
		 .then(resultado =>(almacenarDatosEnSessionStorage('categoriasDeGastos', resultado)));

		detectarInteraccionConBarraDeInicio();

	} catch(error) {
        console.error('Error en la solicitud:', error);
    }

});