const DATOS_DE_TARJETAS_DE_INICIO = { 'ingreso':{'Carol': { idEncabezadoDeTarjeta: 'encabezadoIngresoCarol',
												 			idImporteIngresoSinFormatear: 'importeIngresoSinFormatearCarol',
												 			idImporteIngreso: 'importeIngresoCarol',
												 			idFechaIngreso: 'fechaIngresoCarol' },
									  			 'Pablo': { idEncabezadoDeTarjeta: 'encabezadoIngresoPablo',
									  			 			 idImporteIngresoSinFormatear: 'importeIngresoSinFormatearPablo',
												 			 idImporteIngreso: 'importeIngresoPablo',
												 			 idFechaIngreso: 'fechaIngresoPablo' },
									  			 'Alquiler': { idEncabezadoDeTarjeta: 'encabezadoIngresoAlquiler',
									  			    		   idImporteIngresoSinFormatear: 'importeIngresoSinFormatearAlquiler',
															   idImporteIngreso: 'importeIngresoAlquiler',
															   idFechaIngreso: 'fechaIngresoAlquiler' },
									  			 'Total': { idEncabezadoDeTarjeta: 'encabezadoIngresoTotal',
												 			idImporteIngreso: 'importeIngresoTotal',
												 			idFechaIngreso: 'fechaIngresoTotal' } 
									  },
									  'saldo':{'Carol': { idEncabezadoDeTarjeta: 'encabezadoSaldoCarol',
												 		  idImporteIngreso: 'importeSaldoCarol',
												 		  idFechaIngreso: 'fechaSaldoCarol' },
									  		   'Pablo': { idEncabezadoDeTarjeta: 'encabezadoSaldoPablo',
												 		  idImporteIngreso: 'importeSaldoPablo',
												 		  idFechaIngreso: 'fechaSaldoPablo' },
									  		   'Alquiler': { idEncabezadoDeTarjeta: 'encabezadoSaldoAlquiler',
															 idImporteIngreso: 'importeSaldoAlquiler',
															 idFechaIngreso: 'fechaSaldoAlquiler' },
									  		   'Total': { idEncabezadoDeTarjeta: 'encabezadoSaldoTotal',
												 		  idImporteIngreso: 'importeSaldoTotal',
												 		  idFechaIngreso: 'fechaSaldoTotal' } 
									 }
    
};


const NOMBRE_DE_MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];




function obtenerConfiguracionDeFormulario(idDeLista){

	let configuracion = {	cajasAMostrar:[],
							legendForm: '',
							nameBotonForm: '',
						    contenidoDeTextoDeBotonForm: '',
							iconoBotonForm: ''};

	switch(idDeLista){

		case'guardarIngreso':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaImporte', 'cajaOrigen'];
			configuracion.legendForm = 'Guardar Ingreso';
			configuracion.nameBotonForm = 'guardarIngreso';
			configuracion.contenidoDeTextoDeBotonForm = 'Guardar';
			configuracion.iconoBotonForm = 'iconoGuardar';
		break;
		case'guardarGasto':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaCategoriaGasto', 'cajaSaldo', 'cajaImporte', 'cajaDetalleDeGasto'];
			configuracion.legendForm = 'Guardar Gasto';
			configuracion.nameBotonForm = 'guardarGasto';
			configuracion.contenidoDeTextoDeBotonForm = 'Guardar';
			configuracion.iconoBotonForm = 'iconoGuardar';
		break;
		case'buscarIngreso':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaOrigen'];
			configuracion.legendForm = 'Buscar Ingreso';
			configuracion.nameBotonForm = 'buscarIngreso';
			configuracion.contenidoDeTextoDeBotonForm = 'Buscar';
			configuracion.iconoBotonForm = 'iconoBuscar';
		break;
		case'buscarGastos':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaCategoriaGasto', 'cajaSaldo'];
			configuracion.legendForm = 'Buscar Gastos';
			configuracion.nameBotonForm = 'buscarGastos';
			configuracion.contenidoDeTextoDeBotonForm = 'Buscar';
			configuracion.iconoBotonForm = 'iconoBuscar';
		break;

	}//fin switch

	return configuracion;

}//fin function obtenerConfiguracionDeFormulario


function mostrarCamposDeFormulario(configuracion){
	//guardarIngreso, guardarGasto, buscarGastos
	const todosLosCamposDeFormulario = ['cajaFecha', 'cajaOrigen', 'cajaSaldo', 'cajaCategoriaGasto', 'cajaDetalleDeGasto', 'cajaImporte'];

	let campoDeFormularioIncluido = false;

	todosLosCamposDeFormulario.forEach((element) => {

		campoDeFormularioIncluido = configuracion.cajasAMostrar.includes(element);

		if(campoDeFormularioIncluido){
			document.getElementById(element).classList.remove('d-none');
		} else {
			document.getElementById(element).classList.add('d-none');
		}

	});

	agregarOptionPorNombreDeBotonDeFormulario(configuracion.nameBotonForm);
	
}//fin function mostrarCamposDeFormulario


function mostrarIconoDeBotonDeFormulario(configuracion){

	const todosLosIconosDeBotonDeFormulario = ['iconoGuardar', 'iconoBuscar', 'iconoModificar'];

	todosLosIconosDeBotonDeFormulario.forEach((element) => {
		
		if(element === configuracion.iconoBotonForm){
			document.getElementById(element).classList.remove('d-none');
		} else {
			document.getElementById(element).classList.add('d-none');
		}
		
	});

}//fin function mostrarIconoDeBotonDeFormulario


function administrarVistaDeFormularioPorId(idDeLista){
	
	let configuracion = obtenerConfiguracionDeFormulario(idDeLista);

	mostrarCamposDeFormulario(configuracion);

	document.getElementById('legendForm').textContent = configuracion.legendForm;
	document.getElementById('botonForm').setAttribute('name', configuracion.nameBotonForm);
	document.getElementById('nombreDeBoton').textContent = configuracion.contenidoDeTextoDeBotonForm;

	mostrarIconoDeBotonDeFormulario(configuracion);

}//fin function mostrarCamposDeFormularioPorId

function imprimirErroresEnFormulario(idsDeParrafosRelacionadosAInputs, erroresPorCodigoDeError){

	let cantidadDeElementos = idsDeParrafosRelacionadosAInputs.length;

	let parrafosDeError = '';

	for (let i = 0; i < cantidadDeElementos; i++) {

		parrafosDeError = document.getElementById(idsDeParrafosRelacionadosAInputs[i]);

		parrafosDeError.classList.add('mensajeDeError');

		parrafosDeError.textContent = erroresPorCodigoDeError[i];

	}

}//FIN function imprimirErroresEnFormulario




function imprimirMensajeDeErrorDelServidor(objetoError, mensajeDeError) {

	let cajaDeMensajeDelServidor = document.getElementById('cajaMensajeDelServidor');
	let parrafoDeCajaDeMensajeDelServidor = cajaDeMensajeDelServidor.querySelector('p');
    

    cajaDeMensajeDelServidor.classList.remove('d-none');
    cajaDeMensajeDelServidor.classList.remove('cajaDeMensajeDeExito');
    cajaDeMensajeDelServidor.classList.add('cajaDeMensajeDeError');
    
    // Accedemos correctamente a los datos:
    parrafoDeCajaDeMensajeDelServidor.textContent = mensajeDeError;

}

function imprimerMensajeDeExito(mensajeDeExito){

	let cajaDeMensajeDelServidor = document.getElementById('cajaMensajeDelServidor');
	let parrafoDeCajaDeMensajeDelServidor = cajaDeMensajeDelServidor.querySelector('p');
    
    cajaDeMensajeDelServidor.classList.remove('d-none');
    cajaDeMensajeDelServidor.classList.remove('cajaDeMensajeDeError');
    cajaDeMensajeDelServidor.classList.add('cajaDeMensajeDeExito');

    parrafoDeCajaDeMensajeDelServidor.textContent = mensajeDeExito;

}//fin function imprimerMensajeDeExito


function obtenerDatosDeTarjeta(origenDeIngreso){

	if(origenDeIngreso === 'Carol'){
		return DATOS_DE_TARJETAS_DE_INICIO['ingreso']['Carol'];
	} else if(origenDeIngreso === 'Pablo'){
		return DATOS_DE_TARJETAS_DE_INICIO['ingreso']['Pablo'];
	} else if(origenDeIngreso === 'Alquiler'){
		return DATOS_DE_TARJETAS_DE_INICIO['ingreso']['Alquiler'];
	} else {
		return DATOS_DE_TARJETAS_DE_INICIO['ingreso']['Total'];
	}

}//fin function obtenerDatosDeTarjeta


function obtenerDatosDeTarjetasDeSaldo(origenDeIngreso){
	
	if(origenDeIngreso === 'Carol'){
		return DATOS_DE_TARJETAS_DE_INICIO['saldo']['Carol'];
	} else if(origenDeIngreso === 'Pablo'){
		return DATOS_DE_TARJETAS_DE_INICIO['saldo']['Pablo'];
	} else if(origenDeIngreso === 'Alquiler'){
		return DATOS_DE_TARJETAS_DE_INICIO['saldo']['Alquiler'];
	} else {
		return DATOS_DE_TARJETAS_DE_INICIO['saldo']['Total'];
	}

}//fin function obtenerDatosDeTarjetasDeSaldo


function imprimirDatosDeIngresoPorOrigen(origenDeIngreso, año, mes, importe){
	
	let datosDeTarjeta = obtenerDatosDeTarjeta(origenDeIngreso);
	let importeFormateado = formatearNumero(importe);
	
	document.getElementById(datosDeTarjeta.idEncabezadoDeTarjeta).textContent = 'Ingreso ' + origenDeIngreso;
	document.getElementById(datosDeTarjeta.idImporteIngreso).textContent = '$'+ importeFormateado;
	document.getElementById(datosDeTarjeta.idFechaIngreso).textContent = NOMBRE_DE_MESES[mes] + ' ' + año;

}//fin function imprimirDatosDeIngresoPorOrigen


function imprimirDatosDeSaldoPorOrigen(origenDeIngreso, dia, mes, año, importe){
	
	let datosDeTarjeta = obtenerDatosDeTarjetasDeSaldo(origenDeIngreso);
	let importeFormateado = formatearNumero(importe);
	
	document.getElementById(datosDeTarjeta.idEncabezadoDeTarjeta).textContent = 'Saldo ' + origenDeIngreso;
	document.getElementById(datosDeTarjeta.idImporteIngreso).textContent = '$'+ importeFormateado;
	document.getElementById(datosDeTarjeta.idFechaIngreso).textContent = dia + '/' + mes + '/' + año;	
	
}//fin function imprimirDatosDeIngresoPorOrigen


function imprimirTodosLosIngresos(datos){

	let datosDeIngreso = {	AÑO: 0,
						 	MES: 0,
						 	IMPORTE: [] };

	datos.forEach((element) => {			
		imprimirDatosDeIngresoPorOrigen(element.ORIGEN[0], element.AÑO[0], element.MES[0], element.IMPORTE[0]);
			datosDeIngreso.MES = element.MES[0];
			datosDeIngreso.AÑO = element.AÑO[0];
			datosDeIngreso.IMPORTE.push(element.IMPORTE[0]);	
		});//fin bucle for

    let totalDeIngresos = sumarNumerosEnMatriz(datosDeIngreso.IMPORTE);
        			
    imprimirDatosDeIngresoPorOrigen('Total', datosDeIngreso.AÑO, datosDeIngreso.MES, totalDeIngresos);

}//fin function imprimirTodosLosIngresos


function imprimirTodosLosSaldos(datosDeSaldo, datosDelServidor){

	let datosLocales = {	AÑO: [],
						 	MES: [],
						 	DIA: [],
						 	IMPORTE: [] };

	let cantidadDeDatos = datosDelServidor.length
	for (let i = 0; i < cantidadDeDatos; i++) {

		if(datosDelServidor[i].cantidadDeResultados > 0) {

			imprimirDatosDeSaldoPorOrigen(datosDeSaldo.saldo[i], datosDelServidor[i].datos.DIA[0], datosDelServidor[i].datos.MES[0], datosDelServidor[i].datos.AÑO[0], datosDelServidor[i].datos.IMPORTE[0]);
			datosLocales.DIA.push(datosDelServidor[i].datos.DIA[0]);
			datosLocales.MES.push(datosDelServidor[i].datos.MES[0]);
			datosLocales.AÑO.push(datosDelServidor[i].datos.AÑO[0]);
			datosLocales.IMPORTE.push(datosDelServidor[i].datos.IMPORTE[0]);
		} else {
			console.log(datosDelServidor);
			imprimirDatosDeSaldoPorOrigen(datosDeSaldo.saldo[i], 0, 0, 0, 'SALDO NO ENCONTRADO');
			datosLocales.DIA.push(1);
			datosLocales.MES.push(1);
			datosLocales.AÑO.push(1995);
			datosLocales.IMPORTE.push(0);
		}
		
	}
	let totalDeIngresos = sumarNumerosEnMatriz(datosLocales.IMPORTE);
    let fechaMasReciente = devolverFechaMasReciente(datosLocales);
	imprimirDatosDeSaldoPorOrigen('Total', fechaMasReciente.dia, fechaMasReciente.mes, fechaMasReciente.año, totalDeIngresos);

}


function mostrarEncabezadoDeTabla(seccion){

	if(seccion === 'ingresos'){
		document.getElementById('encabezadoIngreso').classList.remove('d-none');
	} else {
		document.getElementById('encabezadoGastos').classList.remove('d-none');
	}

}//fin function mostrarEncabezadoDeTabla


function imprimirDatosDeIngreso(origen, fechaFormateada, importeFormateado, idIngreso){

	return `<tr>
    	<td>${origen}</td>
    	<td>${fechaFormateada}</td>
    	<td>$${importeFormateado}</td>
    	<td><svg xmlns="http://www.w3.org/2000/svg" class="bi bi-trash mx-2 botonEliminarIngreso" viewBox="0 0 16 16" value="${idIngreso}">
  				<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
  				<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
			</svg></td>
    </tr>`;

}//fin function imprimirDatosDeIngreso


function imprimirDatosDeGasto(origen, fechaFormateada, categoriaDeGasto, importeFormateado, detalle, idGasto){

	return `<tr>
    	<td>${origen}</td>
    	<td>${fechaFormateada}</td>
		<td>${categoriaDeGasto}</td>
    	<td>$${importeFormateado}</td>
		<td>${detalle}</td>
    	<td><svg xmlns="http://www.w3.org/2000/svg" class="bi bi-trash mx-2 botonEliminarGasto" viewBox="0 0 16 16" value="${idGasto}">
  				<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
  				<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
			</svg></td>
    </tr>`;

}//fin function imprimirDatosDeGasto


function imprimirDatosEnCuerpoDeTabla(accion, cantidadDeDatos, datos) {
	
	const cuerpoTabla = document.getElementById('cuerpoDeTabla');

	let htmlFilas = '';
	
  	// Recorremos los elementos usando la longitud de cualquier array (por ejemplo, ORIGEN)
  	for (let i = 0; i < cantidadDeDatos; i++) {
    
    	// Formateamos día y mes para que tengan dos dígitos (ej. 3 -> 03)
    	const fechaFormateada = devolverFechaCompleta(datos.DIA[i], datos.MES[i], datos.AÑO[i]);

    	// Formateamos el importe con puntos como separador de miles
    	const importeFormateado = formatearNumero(datos.IMPORTE[i]);

    	if(accion === 'imprimirDatosDeIngreso'){
    		const origen = datos.ORIGEN[i];
    		// Construimos la estructura de la fila respetando el resultado esperado
    		htmlFilas += imprimirDatosDeIngreso(origen, fechaFormateada, importeFormateado, datos.ID_INGRESO[i]);
    	} else if(accion === 'imprimirDatosDeGasto'){
    		htmlFilas += imprimirDatosDeGasto(datos.ORIGEN, fechaFormateada, datos.CATEGORIA[i], importeFormateado, datos.DETALLE[i], datos.ID_GASTO[i]);
    	}

  	}//fin bucle for

  	// Insertamos todo el contenido generado dentro del tbody
  	cuerpoTabla.innerHTML = htmlFilas;

}//fin function imprimirDatosEnCuerpoDeTabla

function reestablecerCajaDeMensaje() {
	
	let cajaDeMensajeDelServidor = document.getElementById('cajaMensajeDelServidor');
    let parrafoDeCajaDeMensajeDelServidor = cajaDeMensajeDelServidor.querySelector('p');
    cajaDeMensajeDelServidor.classList.remove('cajaDeMensajeDeError');
    cajaDeMensajeDelServidor.classList.add('d-none');
    parrafoDeCajaDeMensajeDelServidor.textContent = '';

}//fin function reestablecerCajaDeMensaje

function reestablecerTabla(){

	//Se ocultan los encabezados de la tabla
	document.getElementById('encabezadoGastos').classList.add('d-none');
	document.getElementById('encabezadoIngreso').classList.add('d-none');

	//Se limpia el cuerpo de la tabla
	document.getElementById('cuerpoDeTabla').innerHTML = '';

}//fin reestablecerTabla

function reestablecerFormulario(){

	let parrafosDeFormulario = document.getElementById('formGestionDeDatos').querySelectorAll('p');

	parrafosDeFormulario.forEach(elemento => {elemento.classList.remove('mensajeDeError');
											  elemento.textContent = '';});

}//FIN function reestablecerFormulacio

function reestablecerVistaPrincipal(){

	reestablecerFormulario();
	reestablecerCajaDeMensaje();
	reestablecerTabla();

}//fin function reestablecerVistaPrincipal