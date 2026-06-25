function almacenarDatosEnSessionStorage(llave, datos){
	sessionStorage.setItem(llave, datos);
}//fin function mostrarDatos


async function almacenarDatos(){
	const obtenerTodosLosOrigenesDeIngreso = {'seccion':'obtenerTodosLosOrigenesDeIngreso'};
	const obtenerTodasLasCategoriasDeGastos = {'seccion':'obtenerTodasLasCategoriasDeGastos'};
	let origenesDeIngreso = await solicitarDatosConParametros(obtenerTodosLosOrigenesDeIngreso);
	almacenarDatosEnSessionStorage('origenesDeIngreso', origenesDeIngreso);
	let categoriasDeGastos = await solicitarDatosConParametros(obtenerTodasLasCategoriasDeGastos);
	almacenarDatosEnSessionStorage('categoriasDeGastos', categoriasDeGastos);
	almacenarDatosEnSelect();
}//fin async function almacenarDatos


addEventListener("DOMContentLoaded", (event) => {
	
	try	{

		/*let obtenerTodosLosOrigenesDeIngreso = {'seccion':'obtenerTodosLosOrigenesDeIngreso'}
		solicitarDatosConParametros(obtenerTodosLosOrigenesDeIngreso) 
		 .then(resultado =>(almacenarDatosEnSessionStorage('origenesDeIngreso', resultado)));

		let obtenerTodasLasCategoriasDeGastos = {'seccion':'obtenerTodasLasCategoriasDeGastos'}
		solicitarDatosConParametros(obtenerTodasLasCategoriasDeGastos) 
		 .then(resultado =>(almacenarDatosEnSessionStorage('categoriasDeGastos', resultado)));

		almacenarDatosEnSelect();*/
		almacenarDatos();

		detectarInteraccionConBarraDeInicio();

	} catch(error) {
        console.error('Error en la solicitud:', error);
    }

});