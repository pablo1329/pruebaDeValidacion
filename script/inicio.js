function almacenarDatosEnSessionStorage(llave, datos){
	sessionStorage.setItem(llave, datos);
}//fin function mostrarDatos


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