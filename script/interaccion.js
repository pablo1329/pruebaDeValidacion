const CONFIGURACION_FORMULARIOS = {'buscarGastosPorAñoMesSaldo':['inputFecha', 'inputOrigenDeIngreso'],
								   'buscarGastosPorAñoMesSaldoCategoriaDeGasto':['inputFecha', 'inputOrigenDeIngreso', 'inputCategoriaDeGasto'],
								   'buscarIngreso':['inputFecha', 'inputOrigenDeIngreso'],
								   'guardarIngreso': ['inputFecha', 'inputOrigenDeIngreso', 'inputImporte'],
    							   'guardarGasto': ['inputFecha', 'inputSaldo', 'inputCategoriaDeGasto', 'inputDetalleDelGasto', 'inputImporte'],
    							   'buscarGastos': ['inputFecha', 'inputSaldo', 'inputCategoriaDeGasto'],
    							   'buscarIngresoDuplicado': ['inputFecha', 'inputOrigenDeIngreso'],
    							   'obtenerUltimoIngresoPorOrigenDeIngreso': ['inputOrigenDeIngreso']
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

	let idsDeInputsDeFormulario = obtenerIdsDeInputsDeFormularioPorSolicitud(solicitud);

	let datosDeFormulario = almacenarDatosPorId(idsDeInputsDeFormulario);

	datosDeFormulario = validarDatos(datosDeFormulario);
	
	datosDeFormulario = devolverFechaFormateada(solicitud, datosDeFormulario);
	console.log(datosDeFormulario);
	return datosDeFormulario; 

}//fin function obtenerDatosPorNombreDeBotonDeFormulario


async function eliminarIngreso(idIngreso){

	reestablecerTabla();

	console.log(idIngreso);

	let buscarDatosDeSaldo = {'seccion':'buscarSaldoPorFkSaldoIngreso',
							  'idIngreso':idIngreso}	

	let datosDeSaldo = await solicitarDatosConParametros(buscarDatosDeSaldo);

	datosDeSaldo = JSON.parse(datosDeSaldo);
	console.log(datosDeSaldo);
	const idSaldo = datosDeSaldo.datos.ID_SALDO[0];

	let eliminarGasto = {'seccion':'eliminarGastoPorId', 
						 'idGasto':idSaldo }

	let gastoEliminado = await solicitarDatosConParametros(eliminarGasto);
	gastoEliminado = JSON.parse(gastoEliminado);

	let eliminarSaldo = {'seccion':'eliminarSaldoPorId',
						 'idSaldo':idSaldo }

	let datosDeSaldoEliminado =	await solicitarDatosConParametros(eliminarSaldo);

	datosDeSaldoEliminado = JSON.parse(datosDeSaldoEliminado);
	console.log(datosDeSaldoEliminado);

	procesarSolicitudAlServidor('obtenerDatosDeSaldoPorIngreso');
                      												 
}//fin function eliminarIngreso


async function eliminarGasto(idGasto){

	let buscarDatosDeGasto = {'seccion': 'buscarGastoPorId',
				              'idGasto': idGasto};

	let datosDeGasto = await solicitarDatosConParametros(buscarDatosDeGasto);
	datosDeGasto = JSON.parse(datosDeGasto);

	let datosAEliminar = {'seccion': 'eliminarGastoPorId',
						  'idGasto': idGasto}

	let respuestaDatosEliminados = await eliminarDatos(datosAEliminar);

	const idSaldo = datosDeGasto.datos.FK_GASTO_SALDO[0];

	let solicitarDatosDeSaldo = {'seccion': 'buscarSaldoPorId',
								 'inputSaldo': idSaldo}

	let datosDeSaldo = await solicitarDatosConParametros(solicitarDatosDeSaldo);
	datosDeSaldo =  JSON.parse(datosDeSaldo);
	const gastoActual = parseFloat(datosDeGasto.datos.IMPORTE[0]);

	const saldoActual = parseFloat(datosDeSaldo.datos.IMPORTE[0]);

	const nuevoImporte = saldoActual + gastoActual;
                      					
    let datosDeSaldoAModificar = {'seccion': 'modificarSaldoPorId',
                				  'inputImporte': nuevoImporte,
                				  'idSaldo': idSaldo}

    let respuestaDatosModificados = await modificarDatos(datosDeSaldoAModificar);

    imprimerMensajeDeExito('El gasto fué eliminado. ' + respuestaDatosModificados);

    procesarSolicitudAlServidor('obtenerDatosDeSaldoPorIngreso');

    reestablecerTabla();

}//fin function eliminarGasto


function detectarInteraccionConBotonEliminar(claseDelBotonEliminar){
	
	let iconosBotonEliminar = document.querySelectorAll(claseDelBotonEliminar);

	const cantidadDeIconosBotonEliminar = iconosBotonEliminar.length;

	let mensajeDeConfirmacion = '';

	if(claseDelBotonEliminar === '.botonEliminarGasto'){
		mensajeDeConfirmacion = '¿Está seguro de eliminar el gasto?';
	}else{
		mensajeDeConfirmacion = '¿Está seguro de eliminar el ingreso? ¡Se eliminará el saldo y los gastos relacionados al mismo!';
	}

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


async function gestionarDatos(datosDelServidor){

	let datosDeSaldo = await buscarDatosDeSaldoPorIngreso(datosDelServidor);
	/*console.log(datosDeSaldo);
	console.log(datosDelServidor);*/

	let datos = almacenarDatosDeIngresosYSaldos(datosDelServidor.cantidadDeResultados, datosDelServidor.datos.ORIGEN, datosDelServidor.datos.IMPORTE, datosDeSaldo);

  	console.log(datos);

  	let datosAGraficar = almacenarDatosDeIngresoParaGraficar(datosDelServidor, datos.origenDeIngresos, datos.ingresosActuales, datos.saldosActuales);
  			
  	const canvas = document.getElementById('grafico');

  	crearGrafico(canvas, 'bar', 'Ingresos', datosAGraficar.origen, datosAGraficar.datosNumericos, datosAGraficar.colorDeBarra, datosAGraficar.colorDeBordeDeBarra, datosAGraficar.colorTextoDeBarra, datosAGraficar.colorDatosEjeX);

 	mostrarEncabezadoDeTabla('ingresos');

 	imprimirDatosEnCuerpoDeTabla('imprimirDatosDeIngreso', datosDelServidor.cantidadDeResultados, datosDelServidor.datos);

 	detectarInteraccionConBotonEliminar('.botonEliminarIngreso');

}//fin function gestionarDatos


async function procesarSolicitudAlServidor(solicitud){

	let datosDeFormulario = {};

	let datosDeSaldo = {};

	switch(solicitud){
		case'guardarIngreso':
			/*VALIDAR INGRESO DUPLICADO*/
			//Almacenamos los datos del formulario (inputFecha, inputImporte).
  			datosDeFormulario =	obtenerDatosDeFormularioPorSolicitud('buscarIngresoDuplicado');
			let datosDuplicados = await buscarIngresoDuplicado(datosDeFormulario);
			datosDuplicados = JSON.parse(datosDuplicados);
			validarDatosDuplicados(datosDuplicados);
			/*VALIDAR INGRESO DUPLICADO*/

			/*GUARDAR INGRESO*/
			datosDeFormulario = obtenerDatosDeFormularioPorSolicitud('guardarIngreso');
			datosDeFormulario.seccion = 'guardarIngreso';
			let datosGuardados = await guardarDatos(datosDeFormulario);
			datosGuardados = JSON.parse(datosGuardados);
			imprimerMensajeDeExito('Los datos se guardaron con éxito ' + datosGuardados);
			/*GUARDAR INGRESO*/

			/*IMPRIMIR INGRESO POR ORIGEN DE INGRESO*/
			datosDeFormulario.seccion = 'obtenerUltimoIngresoPorOrigenDeIngreso';
			let ultimoIngreso = await solicitarDatosConParametros(datosDeFormulario);
			ultimoIngreso = JSON.parse(ultimoIngreso);
			imprimirDatosDeIngresoPorOrigen(ultimoIngreso.datos.ORIGEN[0], ultimoIngreso.datos.AÑO[0], ultimoIngreso.datos.MES[0], ultimoIngreso.datos.IMPORTE[0]);
			/*IMPRIMIR INGRESO POR ORIGEN DE INGRESO*/

			/*GUARDAR SALDO*/
			//IMPORTE, FK_SALDO_INGRESO, FK_SALDO_ORIGEN_INGRESO, DIA, MES, AÑO
			datosDeSaldo = { seccion: 'guardarSaldo',
							 inputImporte: ultimoIngreso.datos.IMPORTE[0],
							 idIngreso: ultimoIngreso.datos.ID_INGRESO[0], 
							 inputOrigenDeIngreso: ultimoIngreso.datos.FK_INGRESO_ORIGEN_INGRESO[0], 
							 dia: ultimoIngreso.datos.DIA[0],
							 mes: ultimoIngreso.datos.MES[0], 
							 año: ultimoIngreso.datos.AÑO[0] };

			let saldo = await guardarDatos(datosDeSaldo);
			saldo = JSON.parse(saldo);
			/*GUARDAR SALDO*/

			/*IMPRIMIR SALDO*/
			imprimirDatosDeSaldoPorOrigen(ultimoIngreso.datos.ORIGEN[0], ultimoIngreso.datos.DIA[0], ultimoIngreso.datos.MES[0], ultimoIngreso.datos.AÑO[0], ultimoIngreso.datos.IMPORTE[0]);
			/*IMPRIMIR SALDO*/

			/*IMPRIMIR TODOS LOS INGRESOS*/
			procesarSolicitudAlServidor('obtenerDatosPorIngreso');
    		/*IMPRIMIR TODOS LOS INGRESOS*/

    		/*IMPRIMIR TODOS LOS SALDOS*/
    		procesarSolicitudAlServidor('obtenerDatosDeSaldoPorIngreso');
			/*IMPRIMIR TODOS LOS SALDOS*/
		break;
		case'guardarGasto':	
			datosDeFormulario = obtenerDatosDeFormularioPorSolicitud('guardarGasto'); 	
			datosDeFormulario.seccion = 'buscarSaldoPorId';

			datos = await solicitarDatosConParametros(datosDeFormulario);
			datos = JSON.parse(datos);
			let gastoActual = datosDeFormulario.inputImporte;
			let saldoActual = datos.datos.IMPORTE[0];
			validarImporteRespectoAlSaldo(gastoActual, saldoActual);
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

			datosDeFormulario.seccion = 'guardarGasto';
			let datosDeGasto = await guardarDatos(datosDeFormulario);
			datosDeGasto = JSON.parse(datosDeGasto);

			
			imprimerMensajeDeExito('Los datos se guardaron con éxito ' + datosDeGasto);
			procesarSolicitudAlServidor('obtenerDatosDeSaldoPorIngreso');
		break;
		case 'buscarIngreso':

			//Almacenamos los datos del formulario (inputFecha, inputImporte).
  			datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);
  			
  			let filtroDeBusqueda = 'buscarIngresoPorMesAño';

  			if(parseInt(datosDeFormulario.inputOrigenDeIngreso) > 0) {
  				filtroDeBusqueda = filtroDeBusqueda + 'OrigenDeIngreso';
  			}

  			//Almacenamos la seccion para buscar los datos.
  			datosDeFormulario.seccion = filtroDeBusqueda;
  			
  			//Almacenamos los datos obtenidos del servidor.
  			let datosDeIngreso = await buscarDatos(datosDeFormulario); 

  			gestionarDatos(datosDeIngreso);

  			/*
  			
  			let datosAGraficar = almacenarDatosDeIngresoParaGraficar(datosDeIngreso, matrizOrigenDeIngresos, ingresosActuales, matrizSaldosActuales);
  			
  			const canvas = document.getElementById('grafico');

  			crearGrafico(canvas, 'bar', 'Ingresos', datosAGraficar.origen, datosAGraficar.datosNumericos, datosAGraficar.colorDeBarra, datosAGraficar.colorDeBordeDeBarra, datosAGraficar.colorTextoDeBarra, datosAGraficar.colorDatosEjeX);

 			mostrarEncabezadoDeTabla('ingresos');

 			imprimirDatosEnCuerpoDeTabla('imprimirDatosDeIngreso', datosDeIngreso.cantidadDeResultados, datosDeIngreso.datos);

 			detectarInteraccionConBotonEliminar('.botonEliminarIngreso');*/

		break;
		case 'buscarGastos':

			//Almacenamos los datos del formulario (inputFecha, inputImporte).
  			datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);
  			console.log(datosDeFormulario);
  			if(datosDeFormulario.inputCategoriaDeGasto > 0){
  				datosDeFormulario.seccion = 'buscarGastosPorAñoMesSaldoCategoriaDeGasto';
  			}else{
				datosDeFormulario.seccion = 'buscarGastosPorAñoMesSaldo';
  			}

			let datosDeGastos = await solicitarDatosConParametros(datosDeFormulario);

			datosDeGastos = JSON.parse(datosDeGastos);
			console.log(datosDeGastos);

  			validarCantidadDeResultadosObtenidos(datosDeGastos.cantidadDeResultados);
			
			mostrarEncabezadoDeTabla('gastos');

			datosDeGastos.datos.ORIGEN = document.getElementById('inputSaldo').querySelector('option[value="' + datosDeFormulario.inputSaldo + '"]').textContent;
			
			imprimirDatosEnCuerpoDeTabla('imprimirDatosDeGasto', datosDeGastos.cantidadDeResultados, datosDeGastos.datos);

			const idSaldo = datosDeGastos.datos.FK_GASTO_SALDO[0];

			const mesActual = datosDeGastos.datos.MES[0];

			const añoActual = datosDeGastos.datos.AÑO[0];

			let datosDeCategoriasDeGastos = await solicitarDatosConParametros({'seccion':'obtenerTodasLasCategoriasDeGastos'});

    		datosDeCategoriasDeGastos = JSON.parse(datosDeCategoriasDeGastos);
    		
    		let datosDeGastoAGraficar = {categoriaDeGasto: [],
    									 importeTotal: [],
    									 colores: [],
    									 coloresDeBorde: [] };

    		const coloresDeCategoriasDeGasto = ['', '#66ff66', '#6699ff', '#b3ff66', '#c266ff', '#d9b38c', '#ff6666', '#ffa366', '#b3b3b3', '#66d9ff', '#b3b3b3'];

    		const coloresDeBordeDeCategoriasDeGasto = ['', '#ff6666', '#002266', '#336600', '#3d0066', '#4d3319', '#660000', '#662900', '#333333', '#004d66', '#333333'];
    		
    		let cantidadDeDatos = datosDeCategoriasDeGastos.cantidadDeResultados + 1;

			for (let i = 1; i < cantidadDeDatos; i++) {

				let buscarGastoTotal = {'seccion': 'buscarGastoTotalPorAñoMesInputSaldoInputCategoriaDeGasto', 
    		                            'inputSaldo': idSaldo, 
    		                            'inputCategoriaDeGasto': i, 
    		                            'mes': mesActual, 
    		                            'año': añoActual }

    		    let datosDeGastoTotal = await solicitarDatosConParametros(buscarGastoTotal);
    		    datosDeGastoTotal = JSON.parse(datosDeGastoTotal);
    		    console.log(datosDeGastoTotal);
    		    if(datosDeGastoTotal.datos.IMPORTE_TOTAL[0] != null){

    		    	datosDeGastoAGraficar.categoriaDeGasto.push(datosDeGastoTotal.datos.CATEGORIA[0]);
    		    	datosDeGastoAGraficar.importeTotal.push(datosDeGastoTotal.datos.IMPORTE_TOTAL[0]);
    		    	datosDeGastoAGraficar.colores.push(coloresDeCategoriasDeGasto[i]);
    		    	datosDeGastoAGraficar.coloresDeBorde.push(coloresDeBordeDeCategoriasDeGasto[i]);
    		    }

			}//fin bucle for

			let grafico = document.getElementById('grafico');

			crearGrafico(grafico, 'bar', 'Gastos por categoría', datosDeGastoAGraficar.categoriaDeGasto, datosDeGastoAGraficar.importeTotal, datosDeGastoAGraficar.colores, datosDeGastoAGraficar.coloresDeBorde, '#66ff66', '#66ff66');

			console.log(datosDeGastoAGraficar);

			detectarInteraccionConBotonEliminar('.botonEliminarGasto');
			

		break;
		case 'obtenerDatosPorIngreso':
			// 1. Creamos un array de promesas, una por cada origen
			const promesas = await obtenerDatosDeTodosLosIngresos();
			// 2. Promise.all espera a que todas las peticiones terminen
			Promise.all(promesas)
				.then(datos => {
					imprimirTodosLosIngresos(datos);
    			})
    			.catch(error => {
        			console.error("Error al obtener los datos:", error);
    			});
		break;
		case 'obtenerDatosDeSaldoPorIngreso':
  			datosDeSaldo = {id: [1, 2, 3],
                        	saldo: ['Carol', 'Pablo', 'Alquiler'] }
			// 1. Creamos un array de promesas, una por cada origen
			const saldos = await obtenerDatosDeTodosLosSaldos(datosDeSaldo);

			// 2. Promise.all espera a que todas las peticiones terminen
			Promise.all(saldos)
				.then(datosDelServidor => {
					imprimirTodosLosSaldos(datosDeSaldo, datosDelServidor);
    			})
    			.catch(error => {
        			console.error("Error al obtener los datos:", error);
    			});
		break;
	}

}//fin function procesarSolicitudAlServidor


function inicializarEventosFormulario() {

    let botonDeFormulario = document.getElementById('botonForm');

    botonDeFormulario.addEventListener('click', (event) => {
        event.preventDefault();
        if (solicitudActual) {
            reestablecerVistaPrincipal();
            procesarSolicitudAlServidor(solicitudActual);
        }
    });
}


function detectarInteraccionConBarraDeInicio(){
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