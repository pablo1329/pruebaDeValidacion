const CONFIGURACION_FORMULARIOS = {'itemGuardarIngreso': ['inputFecha', 'inputOrigenDeIngreso', 'inputImporte'],
    							   'itemGuardarGasto': ['inputFecha', 'inputOrigenDeIngreso', 'inputCategoriaDeGasto', 'inputDetalleDelGasto', 'inputImporte'],
    							   'buscarIngresoDuplicado': ['inputFecha', 'inputOrigenDeIngreso']
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

function devolverFechaFormateada(solicitud, datosDeFormulario){

	if(solicitud === 'buscarIngresoDuplicado'){
		//Almacenamos un objeto que contiene el primer y ultimo día de una fecha pasada como argumento.
  		let fechaDescompuestaEnDiaMesAnio = devolverFechaEnMesDiaAnio(datosDeFormulario.inputFecha);
  
  		//Eliminamos la fecha ingresada, por que no será necesaria para la consulte.
  		delete datosDeFormulario.inputFecha;

  		datosDeFormulario.mes = fechaDescompuestaEnDiaMesAnio.mes;

  		datosDeFormulario.año = fechaDescompuestaEnDiaMesAnio.anio;
	} else if(solicitud === 'itemGuardarIngreso'){

		//Almacenamos un objeto que contiene el primer y ultimo día de una fecha pasada como argumento.
  		let fechaDescompuestaEnDiaMesAnio = devolverFechaEnMesDiaAnio(datosDeFormulario.inputFecha);
  
  		//Eliminamos la fecha ingresada, por que no será necesaria para la consulte.
  		delete datosDeFormulario.inputFecha;

  		datosDeFormulario.mes = fechaDescompuestaEnDiaMesAnio.mes;

  		datosDeFormulario.año = fechaDescompuestaEnDiaMesAnio.anio;

  		datosDeFormulario.dia = fechaDescompuestaEnDiaMesAnio.dia;
	}

	return datosDeFormulario;

}//fin function devolverFechaFormateada

function obtenerDatosDeFormularioPorSolicitud(solicitud){

	let idsDeInputsDeFormulario = obtenerIdsDeInputsDeFormularioPorSolicitud(solicitud);

	let datosDeFormulario = almacenarDatosPorId(idsDeInputsDeFormulario);

	datosDeFormulario = validarDatos(datosDeFormulario);
	
	datosDeFormulario = devolverFechaFormateada(solicitud, datosDeFormulario);

	return datosDeFormulario; 

}//fin function obtenerDatosPorNombreDeBotonDeFormulario


function procesarSolicitudAlServidor(solicitud){

	switch(solicitud){
		case'itemGuardarIngreso':
			buscarIngresoDuplicado()
				.then(resultadoString => {
        			const respuesta = JSON.parse(resultadoString);					
        			validarDatosDuplicados(respuesta);
        			// IMPORTANTE: Retornamos la promesa para encadenarla
        			return guardarDatos('itemGuardarIngreso');
    			})
    			.then(resultado => {
        			// Este bloque solo se ejecuta si no hubo duplicados y guardarDatos tuvo éxito
        			imprimerMensajeDeExito('Los datos se guardaron con éxito');
        			console.log("Guardado con éxito:", resultado);
    			})
    			.catch(error => {
        			// Si lanzaste el ValidacionError o si hubo un error de red en guardarDatos,
        			// caerá aquí.
        			console.log(error);
        			/*if (error instanceof ValidacionError) {
            			// Si es un error de validación, ya se gestionó solo con el constructor
            			console.warn("Error validado:", error.message);
        			} else {
            			console.error("Error inesperado:", error );
        			}*/
    			});
				
		break;
		case'itemGuardarGasto':
			
		break;
		case'itemBuscarIngreso':
			
		break;
		case'itemBuscarGastos':
		break;
		case 'obtenerDatosPorIngreso':
			solicitarDatosConParametros({'seccion':'obtenerUltimoIngresoPorOrigenDeIngreso', 'inputOrigenDeIngreso':1})
				.then(resultado => { almacenarDatosEnSessionStorage('origenIngresoDeCarol', resultado);
									 return resultado;})
				.then(datos=>{ imprimirDatosDeIngresoPorOrigen('origenIngresoDeCarol', JSON.parse(datos))})
				.catch(error => {console.log(error);});

			solicitarDatosConParametros({'seccion':'obtenerUltimoIngresoPorOrigenDeIngreso', 'inputOrigenDeIngreso':2})
				.then(resultado => { almacenarDatosEnSessionStorage('origenIngresoDePablo', resultado); return resultado;})
				.then(datos=>{ imprimirDatosDeIngresoPorOrigen('origenIngresoDePablo', JSON.parse(datos))})
				.catch(error => {console.log(error);});

			solicitarDatosConParametros({'seccion':'obtenerUltimoIngresoPorOrigenDeIngreso', 'inputOrigenDeIngreso':3})
				.then(resultado => { almacenarDatosEnSessionStorage('origenIngresoDeAlquiler', resultado); return resultado;})
				.then(datos=>{ imprimirDatosDeIngresoPorOrigen('origenIngresoDeAlquiler', JSON.parse(datos))})
				.catch(error => {console.log(error);});


		break;
	}

}//fin function procesarSolicitudAlServidor


function detectarEnvioDeFormulario(solicitud){

	let botonDeFormulario = document.getElementById('botonForm');

	let datosDeFormulario = {};

	botonDeFormulario.addEventListener('click', (event)=>{
		event.preventDefault();
		reestablecerFormulario();
		reestablecerCajaDeMensaje();
		procesarSolicitudAlServidor(solicitud);
	});

}//fin function detectarEnvioDeFormulario


function detectarInteraccionConBarraDeInicio(){
	
	let elementosDeListaPrincipal = document.querySelectorAll('li');

	elementosDeListaPrincipal.forEach((element) => element.addEventListener('click', ()=>{
		administrarVistaDeFormularioPorId(element.getAttribute('id'));
		reestablecerFormulario();
		reestablecerCajaDeMensaje();
		detectarEnvioDeFormulario(element.getAttribute('id'));
	}) );

}//fin function detectarInteraccionConBarraDeInicio