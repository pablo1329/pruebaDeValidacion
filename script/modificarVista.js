const DATOS_DE_TARJETAS_DE_INICIO = { 'Guzman Carol Isabel': { idEncabezadoDeTarjeta: 'encabezadoIngresoCarol',
															   idImporteIngreso: 'importeIngresoCarol',
															   idFechaIngreso: 'fechaIngresoCarol' },
									  'Britez Pablo Fernando': { idEncabezadoDeTarjeta: 'encabezadoIngresoPablo',
															   	 idImporteIngreso: 'importeIngresoPablo',
															     idFechaIngreso: 'fechaIngresoPablo' },
									  'Alquiler': { idEncabezadoDeTarjeta: 'encabezadoIngresoAlquiler',
													idImporteIngreso: 'importeIngresoAlquiler',
													idFechaIngreso: 'fechaIngresoAlquiler' },
									  'Ingreso total': { idEncabezadoDeTarjeta: 'encabezadoIngresoTotal',
													     idImporteIngreso: 'importeIngresoTotal',
													     idFechaIngreso: 'fechaIngresoTotal' }
    
};

const NOMBRE_DE_MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function llenarSelect(selectId, ids, nombres) {
    const select = document.getElementById(selectId);
    
    // Limpiamos el select por si ya tenía opciones previas
    select.innerHTML = '<option value="">Seleccione una opción</option>';

    // Recorremos los arrays
    for (let i = 0; i < ids.length; i++) {
        // Creamos un elemento option
        const option = document.createElement('option');
        
        // Asignamos el value y el texto
        option.value = ids[i];
        option.textContent = nombres[i];
        
        // Añadimos la opción al select
        select.appendChild(option);
    }
}


function almacenarDatosEnSelect(){

	datosDeSessionStorage = JSON.parse(sessionStorage.getItem('origenesDeIngreso'));
	llenarSelect('inputOrigenDeIngreso', datosDeSessionStorage.datos.ID_ORIGEN, datosDeSessionStorage.datos.ORIGEN);

	datosDeSessionStorage = JSON.parse(sessionStorage.getItem('categoriasDeGastos'));
	llenarSelect('inputCategoriaDeGasto', datosDeSessionStorage.datos.ID_CATEGORIA_GASTO, datosDeSessionStorage.datos.CATEGORIA);
		
}//fin function almacenarDatosEnSelect


function obtenerConfiguracionDeFormulario(idDeLista){

	let configuracion = {	cajasAMostrar:[],
							legendForm: '',
							nameBotonForm: '',
						    contenidoDeTextoDeBotonForm: '',
							iconoBotonForm: ''};

	switch(idDeLista){

		case'itemGuardarIngreso':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaImporte', 'cajaOrigen'];
			configuracion.legendForm = 'Guardar Ingreso';
			configuracion.nameBotonForm = 'guardarIngreso';
			configuracion.contenidoDeTextoDeBotonForm = 'Guardar';
			configuracion.iconoBotonForm = 'iconoGuardar';
		break;
		case'itemGuardarGasto':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaCategoriaGasto', 'cajaOrigen', 'cajaImporte', 'cajaDetalleDeGasto'];
			configuracion.legendForm = 'Guardar Gasto';
			configuracion.nameBotonForm = 'guardarGasto';
			configuracion.contenidoDeTextoDeBotonForm = 'Guardar';
			configuracion.iconoBotonForm = 'iconoGuardar';
		break;
		case'itemBuscarIngreso':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaOrigen'];
			configuracion.legendForm = 'Buscar Ingreso';
			configuracion.nameBotonForm = 'buscarIngreso';
			configuracion.contenidoDeTextoDeBotonForm = 'Buscar';
			configuracion.iconoBotonForm = 'iconoBuscar';
		break;
		case'itemBuscarGastos':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaCategoriaGasto', 'cajaOrigen', 'cajaImporte', 'cajaDetalleDeGasto'];
			configuracion.legendForm = 'Buscar Gastos';
			configuracion.nameBotonForm = 'buscarGastos';
			configuracion.contenidoDeTextoDeBotonForm = 'Buscar';
			configuracion.iconoBotonForm = 'iconoBuscar';
		break;

	}//fin switch

	return configuracion;

}//fin function obtenerConfiguracionDeFormulario


function mostrarCamposDeFormulario(configuracion){

	const todosLosCamposDeFormulario = ['cajaFecha', 'cajaOrigen', 'cajaCategoriaGasto', 'cajaDetalleDeGasto', 'cajaImporte'];

	let campoDeFormularioIncluido = false;

	todosLosCamposDeFormulario.forEach((element) => {

		campoDeFormularioIncluido = configuracion.cajasAMostrar.includes(element);

		if(campoDeFormularioIncluido){
			document.getElementById(element).classList.remove('d-none');
		} else {
			document.getElementById(element).classList.add('d-none');
		}

	});

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

function reestablecerFormulario(){

	let parrafosDeFormulario = document.getElementById('formGestionDeDatos').querySelectorAll('p');

	parrafosDeFormulario.forEach(elemento => {elemento.classList.remove('mensajeDeError');
											  elemento.textContent = '';});

}//FIN function reestablecerFormulacio

function imprimirErroresEnFormulario(idsDeParrafosRelacionadosAInputs, erroresPorCodigoDeError){

	let cantidadDeElementos = idsDeParrafosRelacionadosAInputs.length;

	let parrafosDeError = '';

	for (let i = 0; i < cantidadDeElementos; i++) {

		parrafosDeError = document.getElementById(idsDeParrafosRelacionadosAInputs[i]);

		parrafosDeError.classList.add('mensajeDeError');

		parrafosDeError.textContent = erroresPorCodigoDeError[i];

	}

}//FIN function imprimirErroresEnFormulario

function reestablecerCajaDeMensaje() {
	let cajaDeMensajeDelServidor = document.getElementById('cajaMensajeDelServidor');
    let parrafoDeCajaDeMensajeDelServidor = cajaDeMensajeDelServidor.querySelector('p');
    cajaDeMensajeDelServidor.classList.remove('cajaDeMensajeDeError');
    cajaDeMensajeDelServidor.classList.add('d-none');
    parrafoDeCajaDeMensajeDelServidor.textContent = '';
}//fin function reestablecerCajaDeMensaje

	// Comportamiento para formularios
function imprimirErroresEnFormulario(idInput, message) {
    const input = document.getElementById(idInput);
    if (input) {
        // Lógica para crear un span o párrafo debajo del input
        const errorLabel = document.createElement('span');
        errorLabel.className = 'error-message';
        errorLabel.textContent = message;
        input.parentNode.appendChild(errorLabel);
    }
}

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

	if(origenDeIngreso === 'origenIngresoDeCarol'){
		return DATOS_DE_TARJETAS_DE_INICIO['Guzman Carol Isabel'];
	} else if(origenDeIngreso === 'origenIngresoDePablo'){
		return DATOS_DE_TARJETAS_DE_INICIO['Britez Pablo Fernando'];
	} else if(origenDeIngreso === 'origenIngresoDeAlquiler'){
		return DATOS_DE_TARJETAS_DE_INICIO['Alquiler'];
	}

}//fin function obtenerDatosDeTarjeta


function imprimirDatosDeIngresoPorOrigen(origenDeIngreso, datosDelServidor){
	console.log(datosDelServidor.datos.MES[0]);
	let datosDeTarjeta = obtenerDatosDeTarjeta(origenDeIngreso);

	document.getElementById(datosDeTarjeta.idEncabezadoDeTarjeta).textContent = 'Ingreso ' + datosDelServidor.datos.ORIGEN[0];
	document.getElementById(datosDeTarjeta.idImporteIngreso).textContent = datosDelServidor.datos.IMPORTE[0];
	document.getElementById(datosDeTarjeta.idFechaIngreso).textContent = NOMBRE_DE_MESES[datosDelServidor.datos.MES[0]] + ' ' + datosDelServidor.datos.AÑO[0];

}//fin function imprimirDatosDeIngresoPorOrigen