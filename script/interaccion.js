const CONFIGURACION_FORMULARIOS = {'buscarGastosPorAñoMesSaldo':['inputFecha', 'inputSaldo'],
								   'buscarGastosPorAñoMesSaldoCategoriaDeGasto':['inputFecha', 'inputSaldo', 'inputCategoriaDeGasto'],
								   'buscarIngresoPorMesAño':['inputFecha'],
								   'buscarIngresoPorMesAñoOrigenDeIngreso':['inputFecha', 'inputOrigenDeIngreso'],
								   'guardarIngreso': ['inputFecha', 'inputOrigenDeIngreso', 'inputImporte'],
    							   'guardarGasto': ['inputFecha', 'inputSaldo', 'inputCategoriaDeGasto', 'inputDetalleDelGasto', 'inputImporte'],
    							   'buscarGastos': ['inputFecha', 'inputSaldo', 'inputCategoriaDeGasto'],
    							   'buscarIngresoDuplicado': ['inputFecha', 'inputOrigenDeIngreso'],
    							   'buscarUltimoIngresoPorOrigenDeIngreso': ['inputOrigenDeIngreso']
};

const MENSAJES_DE_CONFIRMACION = { '.botonEliminarGasto': '¿Está seguro de eliminar el gasto?', 
								   '.botonEliminarIngreso': '¿Está seguro de eliminar el ingreso? ¡Se eliminará el saldo y los gastos relacionados al mismo!'
};

let solicitudActual = '';

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


function obtenerDatosDeFormularioPorSolicitud(solicitud){
	
	let seccion = document.getElementById('botonForm').name;

	let idsDeInputsDeFormulario = obtenerIdsDeInputsDeFormularioPorSolicitud(seccion);

	let datosDeFormulario = almacenarDatosPorId(idsDeInputsDeFormulario);

	datosDeFormulario = validarDatos(datosDeFormulario);
	
	datosDeFormulario = devolverFechaFormateada(solicitud, datosDeFormulario);

	return datosDeFormulario; 

}//fin function obtenerDatosPorNombreDeBotonDeFormulario


async function eliminarIngreso(idIngreso){

	reestablecerTabla();

	let buscarDatosDeSaldo = {'seccion':'buscarSaldoPorFkSaldoIngreso',
							  'idIngreso':idIngreso}	

	let datosDeSaldo = await buscarDatos(buscarDatosDeSaldo);

	const idSaldo = datosDeSaldo.datos.ID_SALDO[0];

	let eliminarGasto = {'seccion':'eliminarGastoPorId', 
						 'idGasto':idSaldo }

	let gastoEliminado = await solicitarDatosConParametros(eliminarGasto);
	gastoEliminado = JSON.parse(gastoEliminado);

	let eliminarSaldo = {'seccion':'eliminarSaldoPorId',
						 'idSaldo':idSaldo }

	let datosDeSaldoEliminado =	await solicitarDatosConParametros(eliminarSaldo);

	datosDeSaldoEliminado = JSON.parse(datosDeSaldoEliminado);

	imprimirTodosLosSaldos();
                      												 
}//fin function eliminarIngreso


async function actualizarSaldo(idSaldo, datosDeGasto){

	let solicitarDatosDeSaldo = {'seccion': 'buscarSaldoPorId',
								 'inputSaldo': idSaldo}

	let datosDeSaldo = await buscarDatos(solicitarDatosDeSaldo);

	const gastoActual = parseFloat(datosDeGasto.datos.IMPORTE[0]);

	const saldoActual = parseFloat(datosDeSaldo.datos.IMPORTE[0]);

	const nuevoImporte = saldoActual + gastoActual;
                      					
    let datosDeSaldoAModificar = {'seccion': 'modificarSaldoPorId',
                				  'inputImporte': nuevoImporte,
                				  'idSaldo': idSaldo}

    let respuestaDatosModificados = await modificarDatos(datosDeSaldoAModificar);

    imprimerMensajeDeExito('El gasto fué eliminado. ' + respuestaDatosModificados);

    imprimirTodosLosSaldos();

    reestablecerFormulario();

    reestablecerTabla();

    destruirGrafico(document.getElementById('grafico'));

}//fin function actualizarSaldo


async function eliminarGasto(idGasto){

	let buscarDatosDeGasto = {'seccion': 'buscarGastoPorId',
				              'idGasto': idGasto};

	let datosDeGasto = await buscarDatos(buscarDatosDeGasto);

	let datosAEliminar = {'seccion': 'eliminarGastoPorId',
						  'idGasto': idGasto}

	let respuestaDatosEliminados = await eliminarDatos(datosAEliminar);

	actualizarSaldo(datosDeGasto.datos.FK_GASTO_SALDO[0], datosDeGasto);

}//fin function eliminarGasto


function detectarInteraccionConBotonEliminar(claseDelBotonEliminar){
	
	let iconosBotonEliminar = document.querySelectorAll(claseDelBotonEliminar);

	const cantidadDeIconosBotonEliminar = iconosBotonEliminar.length;

	let mensajeDeConfirmacion = MENSAJES_DE_CONFIRMACION[claseDelBotonEliminar];

	for (let i = 0; i < cantidadDeIconosBotonEliminar; i++) {
		iconosBotonEliminar[i].addEventListener('click', ()=>{
			let confirmar = confirm(mensajeDeConfirmacion);
			if(confirmar){
				const valorEnIconoEliminar = iconosBotonEliminar[i].getAttribute('value');
				if(claseDelBotonEliminar === '.botonEliminarGasto'){
					eliminarGasto(valorEnIconoEliminar);
				}else{
					eliminarIngreso(valorEnIconoEliminar);
				}
			}
		});
	}//fin bucle for

}//fin function detectarInteraccionConBotonEliminarGasto


async function buscarDatosDeSaldoPorIngreso(datosDeIngreso){

	let datosDeSaldo = [];

	for (let i = 0; i < datosDeIngreso.cantidadDeResultados; i++) {

		//Se crea el objeto para solicitar los datos del saldo.
  		let buscarSaldoPorId = {'seccion': 'buscarSaldoPorFkSaldoIngreso',
  								'idIngreso': datosDeIngreso.datos.ID_INGRESO[i] }

  		datosDeSaldo.push(await buscarDatos(buscarSaldoPorId));

	}//fin bucle for

	return datosDeSaldo;

}//fin function buscarDatosDeSaldoPorIngreso


function almacenarDatosDeIngresosYSaldos(cantidadDeDatos, origenIngreso, ingresos, saldo) {

	let datos = {origenDeIngresos: [],
				 ingresosActuales: [],
				 saldosActuales: []};

	//Se utiliza un bucle for para buscar los datos del saldo relacionado a cada importe.
  	for (let i = 0; i < cantidadDeDatos; i++) {

        datos.origenDeIngresos.push(origenIngreso[i]);

        datos.ingresosActuales.push(ingresos[i]);

        //Se almacena cada saldo en la matriz saldos actuales.
        datos.saldosActuales.push(saldo[i].datos.IMPORTE[0]);
            	
  	}

  	return datos;

}//fin function almacenarDatosDeIngresosYSaldos


async function devolverGastoTotal(datosDelServidor){

	//Se almacenan datos para buscar el gasto total por año, mes, idSaldo, InputCategoriaDeGasto
	let idSaldo = datosDelServidor.FK_GASTO_SALDO[0];

	let mesActual = datosDelServidor.MES[0];

	let añoActual = datosDelServidor.AÑO[0];

	let datosDeGastoTotal = {};

	let datosAGraficar = {categoria: [],
						  importeTotal: [],
						  idCategoria: [] };

	//Obtener todas las categorías.
	/*datosDeCategoriasDeGastos = await solicitarDatosConParametros({'seccion':'obtenerTodasLasCategoriasDeGastos'});

    datosDeCategoriasDeGastos = JSON.parse(datosDeCategoriasDeGastos);
   	console.log(datosDeCategoriasDeGastos);*/
	let cantidadDeDatos = document.getElementById('inputCategoriaDeGasto').querySelectorAll('option').length;

    for (let i = 1; i < cantidadDeDatos; i++) {

		let buscarGastoTotal = {'seccion': 'buscarGastoTotalPorAñoMesInputSaldoInputCategoriaDeGasto', 
    		                    'inputSaldo': idSaldo, 
    		                    'inputCategoriaDeGasto': i, 
    		                    'mes': mesActual, 
    		                    'año': añoActual }

    	datosDeGastoTotal = await buscarDatos(buscarGastoTotal); 

    	if(datosDeGastoTotal.datos.IMPORTE_TOTAL[0] != null){

    		datosAGraficar.idCategoria.push(i);

    		datosAGraficar.categoria.push(datosDeGastoTotal.datos.CATEGORIA[0]);

    		datosAGraficar.importeTotal.push(datosDeGastoTotal.datos.IMPORTE_TOTAL[0]);

    	}

    }//fin bucle for

    return datosAGraficar;

}//fin function devolverGastoTotal


async function gestionarDatos(accion, datosDelServidor){
	console.log(datosDelServidor);
	if(accion === 'buscarIngreso') {

		//Se buscan los datos de saldo en base a los datos de ingreso.
		let datosDeSaldo = await buscarDatosDeSaldoPorIngreso(datosDelServidor);

		let datos = almacenarDatosDeIngresosYSaldos(datosDelServidor.cantidadDeResultados, datosDelServidor.datos.ORIGEN, datosDelServidor.datos.IMPORTE, datosDeSaldo);
		
  		let datosAGraficar = almacenarDatosDeIngresoParaGraficar(datosDelServidor, datos.origenDeIngresos, datos.ingresosActuales, datos.saldosActuales);

  		crearGrafico('grafico', 'bar', 'Ingresos', datosAGraficar.origen, datosAGraficar.datosNumericos, datosAGraficar.colorDeBarra, datosAGraficar.colorDeBordeDeBarra, datosAGraficar.colorTextoDeBarra, datosAGraficar.colorDatosEjeX);

  		imprimirDatosEnTabla('ingresos', datosDelServidor);

 		detectarInteraccionConBotonEliminar('.botonEliminarIngreso');

	} else if(accion === 'buscarGasto') {

		let datosDeGastoTotal = {};

		datosDelServidor.datos.ORIGEN = document.getElementById('inputSaldo').querySelector('select option:checked').textContent;

		imprimirDatosEnTabla('gastos', datosDelServidor);

    	datosDeGastoTotal = await devolverGastoTotal(datosDelServidor.datos);

		let datosDeGastoAGraficar = almacenarDatosDeGastoParaGraficar(datosDeGastoTotal.idCategoria, datosDeGastoTotal.categoria, datosDeGastoTotal.importeTotal);
    	
		crearGrafico('grafico', 'bar', 'Gastos por categoría', datosDeGastoAGraficar.categoriaDeGasto, datosDeGastoAGraficar.importeTotal, datosDeGastoAGraficar.colores, datosDeGastoAGraficar.coloresDeBorde, '#66ff66', '#66ff66');

		detectarInteraccionConBotonEliminar('.botonEliminarGasto');
	}
	

}//fin function gestionarDatos


async function actualizarIngreso(datosDeFormulario){

	datosDeFormulario.seccion = 'buscarUltimoIngresoPorOrigenDeIngreso';
	let ultimoIngreso = await buscarDatos(datosDeFormulario);
	console.log(ultimoIngreso);
	imprimirDatosDeIngresoPorOrigen(ultimoIngreso.datos.ORIGEN[0], ultimoIngreso.datos.AÑO[0], ultimoIngreso.datos.MES[0], ultimoIngreso.datos.IMPORTE[0]);
	return ultimoIngreso;

}//fin function actualizarIngreso


async function guardarSaldo(datosDeFormulario, datosDeIngreso){

	//IMPORTE, FK_SALDO_INGRESO, FK_SALDO_ORIGEN_INGRESO, DIA, MES, AÑO
	let datosDeSaldo = { seccion: 'guardarSaldo',
					     inputImporte: datosDeFormulario.inputImporte,
					     idIngreso: datosDeIngreso.datos.ID_INGRESO[0], 
					     inputOrigenDeIngreso: datosDeFormulario.inputOrigenDeIngreso, 
					     dia: datosDeFormulario.dia,
					     mes: datosDeFormulario.mes, 
					     año: datosDeFormulario.año };

	let saldo = await guardarDatos(datosDeSaldo);
	saldo = JSON.parse(saldo);
	/*GUARDAR SALDO*/

	/*IMPRIMIR SALDO*/
	imprimirDatosDeSaldoPorOrigen(datosDeIngreso.datos.ORIGEN[0], datosDeFormulario.dia, datosDeFormulario.mes, datosDeFormulario.año, datosDeFormulario.inputImporte);
	/*IMPRIMIR SALDO*/

}//fin function guardarSaldo


async function buscarSaldoPorId(idSaldo){

	const buscarSaldoPorId = { seccion:'buscarSaldoPorId',
							   inputSaldo: idSaldo};
    const datosDeSaldo = await buscarDatos(buscarSaldoPorId);
    return datosDeSaldo;

}//fin function buscarSaldoPorId


async function modificarSaldo(datosDeFormulario, datosDeSaldo){

	const saldoActual = parseFloat(datosDeSaldo.datos.IMPORTE[0]);
	const gastoActual = parseFloat(datosDeFormulario.inputImporte);
	let nuevoSaldo = saldoActual - gastoActual;
	let datosDeSaldoAModificar = {'seccion': 'modificarSaldoPorOrigen',
								  'inputImporte': nuevoSaldo,
								  'dia': datosDeFormulario.dia,
                                  'mes': datosDeFormulario.mes,
                                  'año': datosDeFormulario.año,
                                  'idSaldo': datosDeFormulario.inputSaldo };
    let respuestaDatosModificados = await modificarDatos(datosDeSaldoAModificar);
	respuestaDatosModificados = JSON.parse(respuestaDatosModificados);
	imprimerMensajeDeExito('Los datos se guardaron con éxito ' + respuestaDatosModificados);

}//fin function modificarSaldo


async function guardarGasto(datosDeFormulario){

	datosDeFormulario.seccion = 'guardarGasto';
	let datosDeGasto = await guardarDatos(datosDeFormulario);
	datosDeGasto = JSON.parse(datosDeGasto);
	imprimerMensajeDeExito('Los datos se guardaron con éxito ' + datosDeGasto);

}//fin function guardarGasto


async function buscarUltimoIngresoPorOrigen(datosDeTodosLosOrigenesDeIngreso) {


	//Se declara el objeto para buscar los ultimos ingresos por origen.
	let buscarUltimoIngreso = {seccion: 'buscarUltimoIngresoPorOrigenDeIngreso',
	                           inputOrigenDeIngreso: '' };

	let datosDeUltimosIngresosPorOrigen = [];

	let datosActuales = [];

	//Recorremos todos los origenes de ingreso.
	for(let i = 0; i < datosDeTodosLosOrigenesDeIngreso.cantidadDeResultados; i++) {
		
		//Se almacena el id de origen de ingreso, en el objeto para obtener los ultimos ingresos.
		buscarUltimoIngreso.inputOrigenDeIngreso = datosDeTodosLosOrigenesDeIngreso.datos.ID_ORIGEN[i];

		//Se almacenan los resultados obtenidos.
		datosActuales = await buscarDatos(buscarUltimoIngreso);

		datosDeUltimosIngresosPorOrigen.push(datosActuales);

	}//fin bucle for

	return datosDeUltimosIngresosPorOrigen;

}//fin function buscarUltimoIngresoPorOrigen


async function buscarUltimosIngresos(){

	//Se declara el objeto para buscar todos los origenes de ingresos.
	const todosLosOrigenesDeIngreso = {'seccion':'buscarTodosLosOrigenesDeIngreso'};

	//Se almacenan los datos de los origenesw de ingreso.
	const datosDeTodosLosOrigenesDeIngreso = await buscarDatos(todosLosOrigenesDeIngreso);

	let datosDeUltimosIngresos = await buscarUltimoIngresoPorOrigen(datosDeTodosLosOrigenesDeIngreso);

	return datosDeUltimosIngresos;

}//fin buscarUltimoIngresos


async function buscarDatosParaCalcularPorcentajeDeSaldoActual(idSaldo){

	const datosDeSaldo = await buscarDatos({ seccion: 'buscarSaldoPorId', inputSaldo: idSaldo});

	const datosDeIngresos = await buscarDatos({ seccion: 'buscarIngresoPorId', idIngreso: datosDeSaldo.datos.FK_SALDO_INGRESO[0]});

	console.log(datosDeSaldo);
	console.log(datosDeIngresos);

	imprimirImagenes(datosDeSaldo.datos.ORIGEN[0], parseFloat(datosDeIngresos.datos.IMPORTE[0]), parseFloat(datosDeSaldo.datos.IMPORTE[0]));

}//fin function buscarDatosParaCalcularPorcentajeDeSaldoActual


async function procesarSolicitudAlServidor(solicitud){

	let datosDeFormulario = {};

	let datosDeGastos = {};

	let datosDeSaldo = {};

	switch(solicitud) {

		case'guardarIngreso':
			/*VALIDAR INGRESO DUPLICADO*/

			//Almacenamos los datos del formulario (inputFecha, inputImporte).
  			datosDeFormulario =	obtenerDatosDeFormularioPorSolicitud(solicitud);

			validarIngresoDuplicado(datosDeFormulario);
			/*VALIDAR INGRESO DUPLICADO*/

			/*GUARDAR INGRESO*/
			datosDeFormulario.seccion = solicitud;
			let datosGuardados = await guardarDatos(datosDeFormulario);
			datosGuardados = JSON.parse(datosGuardados);
			imprimerMensajeDeExito('Los datos se guardaron con éxito ' + datosGuardados);
			/*GUARDAR INGRESO*/

			/*IMPRIMIR INGRESO POR ORIGEN DE INGRESO*/
			datosDeIngreso = await actualizarIngreso(datosDeFormulario);
			/*GUARDAR SALDO*/
			guardarSaldo(datosDeFormulario, datosDeIngreso);

			imprimirTodosLosIngresos();

			imprimirTodosLosSaldos();

		break;
		case'guardarGasto':	

			datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);
			console.log(datosDeFormulario);
			datosDeSaldo =  await buscarSaldoPorId(datosDeFormulario.inputSaldo);
			console.log(datosDeSaldo);
			validarImporteRespectoAlSaldo(datosDeFormulario, datosDeSaldo);
			
			modificarSaldo(datosDeFormulario, datosDeSaldo);

			guardarGasto(datosDeFormulario);

			imprimirTodosLosSaldos();

			buscarDatosParaCalcularPorcentajeDeSaldoActual(datosDeFormulario.inputSaldo);

		break;
		case 'buscarIngresoPorMesAño':
			
			//Almacenamos los datos del formulario (inputFecha, inputImporte).
  			datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);

  			datosDeFormulario.seccion = solicitud;
  			
  			//Almacenamos los datos obtenidos del servidor.
  			datosDeIngreso = await buscarDatos(datosDeFormulario); 

  			validarCantidadDeResultadosObtenidos(datosDeIngreso.cantidadDeResultados);

  			gestionarDatos('buscarIngreso', datosDeIngreso);

		break;
		case 'buscarIngresoPorMesAñoOrigenDeIngreso':

			//Almacenamos los datos del formulario (inputFecha, inputImporte).
  			datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);
  			
  			datosDeFormulario.seccion = solicitud;
  			
  			//Almacenamos los datos obtenidos del servidor.
  			datosDeIngreso = await buscarDatos(datosDeFormulario);

  			validarCantidadDeResultadosObtenidos(datosDeIngreso.cantidadDeResultados);

  			gestionarDatos('buscarIngreso', datosDeIngreso);

		break;
		case 'buscarGastosPorAñoMesSaldo':

			//Almacenamos los datos del formulario (inputFecha, inputImporte).
  			datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);

  			datosDeFormulario.seccion = solicitud;

			datosDeGastos = await buscarDatos(datosDeFormulario);

  			validarCantidadDeResultadosObtenidos(datosDeGastos.cantidadDeResultados);
			
			gestionarDatos('buscarGasto', datosDeGastos);
			
		break;
		case 'buscarGastosPorAñoMesSaldoCategoriaDeGasto':

			//Almacenamos los datos del formulario (inputFecha, inputImporte).
  			datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);

  			datosDeFormulario.seccion = solicitud;

			datosDeGastos = await buscarDatos(datosDeFormulario);

  			validarCantidadDeResultadosObtenidos(datosDeGastos.cantidadDeResultados);
			
			gestionarDatos('buscarGasto', datosDeGastos);

		break;

	}//fin switch

}//fin function procesarSolicitudAlServidor


function inicializarEventosFormulario() {

    let botonDeFormulario = document.getElementById('botonForm');

    botonDeFormulario.addEventListener('click', (event) => { 
        event.preventDefault();
        if (botonDeFormulario.name) {
            reestablecerVistaPrincipal();
            procesarSolicitudAlServidor(botonDeFormulario.name);
        }
    });

}


function detectarInteraccionConBarraDeInicio() {

    let elementosDeListaPrincipal = document.querySelectorAll('li');

    elementosDeListaPrincipal.forEach((element) => {
        element.addEventListener('click', () => {
            const id = element.getAttribute('id');
            administrarVistaDeFormularioPorId(id);
            reestablecerVistaPrincipal();
            // Actualizamos la solicitud activa en lugar de reasignar el evento del botón
            solicitudActual = id;

        });
    });
}