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
	//{inputFecha: '2026-06-01', inputOrigenDeIngreso: '3', inputImporte: '500', seccion: 'verificarIngresoDuplicado', fechaDelMesSiguiente: '2026-07-01'}
	//devolverFechaEnMesDiaAnio('2026-07-01');
	try	{
		almacenarDatos();
		procesarSolicitudAlServidor('obtenerDatosPorIngreso');
	} catch(error) {
    	console.error('Error en la solicitud:', error);
    }

});