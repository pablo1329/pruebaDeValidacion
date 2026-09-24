const CONFIGURACION_FORMULARIOS = {
    'buscarGastosPorAñoMesSaldo': ['inputFecha', 'inputSaldo'],
    'buscarGastosPorAñoMesSaldoCategoriaDeGasto': ['inputFecha', 'inputSaldo', 'inputCategoriaDeGasto'],
    'buscarIngresoPorMesAño': ['inputFecha'],
    'buscarIngresoPorMesAñoOrigenDeIngreso': ['inputFecha', 'inputOrigenDeIngreso'],
    'guardarIngreso': ['inputFecha', 'inputOrigenDeIngreso', 'inputImporte'],
    'guardarGasto': ['inputFecha', 'inputSaldo', 'inputCategoriaDeGasto', 'inputDetalleDelGasto', 'inputImporte'],
    'buscarGastos': ['inputFecha', 'inputSaldo', 'inputCategoriaDeGasto'],
    'buscarIngresoDuplicado': ['inputFecha', 'inputOrigenDeIngreso'],
    'buscarUltimoIngresoPorOrigenDeIngreso': ['inputOrigenDeIngreso']
};

const MENSAJES_DE_CONFIRMACION = { 
    '.botonEliminarGasto': '¿Está seguro de eliminar el gasto?',  
    '.botonEliminarIngreso': '¿Está seguro de eliminar el ingreso? ¡Se eliminará el saldo y los gastos relacionados al mismo!'
};

let solicitudActual = '';

function almacenarDatosPorId(idsDeInputsDeFormulario) {
    let datosDeFormulario = {};
    idsDeInputsDeFormulario.forEach((id) => {
        const inputElement = document.getElementById(id);
        datosDeFormulario[id] = inputElement ? inputElement.value : null;
    });
    return datosDeFormulario;
}

function obtenerIdsDeInputsDeFormularioPorSolicitud(solicitud) {
    return CONFIGURACION_FORMULARIOS[solicitud] || [];
}

function obtenerDatosDeFormularioPorSolicitud(solicitud) {
    let seccion = document.getElementById('botonForm').name;
    let idsDeInputsDeFormulario = obtenerIdsDeInputsDeFormularioPorSolicitud(seccion);
    let datosDeFormulario = almacenarDatosPorId(idsDeInputsDeFormulario);
    datosDeFormulario = validarDatos(datosDeFormulario);
    datosDeFormulario = devolverFechaFormateada(solicitud, datosDeFormulario);
    console.log(datosDeFormulario);
    return datosDeFormulario;  
}

async function eliminarIngreso(idIngreso) {

    reestablecerTabla();

    let datosDeSaldo = await buscarDatos({seccion: 'buscarSaldoPorFkSaldoIngreso', idIngreso: idIngreso });
    const idSaldo = datosDeSaldo.datos.ID_SALDO[0];

    let gastoEliminado = JSON.parse(await solicitarDatosConParametros({seccion: 'eliminarGastoPorId', idGasto: idSaldo }));
    let datosDeSaldoEliminado = JSON.parse(await solicitarDatosConParametros({seccion: 'eliminarSaldoPorId', idSaldo: idSaldo }));
    let respuestaIngresoEliminado = JSON.parse(await solicitarDatosConParametros({seccion: 'eliminarIngresoPorId', idIngreso: datosDeSaldo.datos.FK_SALDO_INGRESO[0]}));
    console.log(datosDeSaldo);
    console.log(gastoEliminado);
    console.log(respuestaIngresoEliminado);
    await imprimirTodosLosSaldos();
}

async function actualizarSaldo(idSaldo, gastoActual, saldoActual) {

    const nuevoImporte = saldoActual + gastoActual;
                        
    let datosDeSaldoAModificar = { 
        'seccion': 'modificarSaldoPorId',
        'inputImporte': nuevoImporte,
        'idSaldo': idSaldo 
    };

    let respuestaDatosModificados = await modificarDatos(datosDeSaldoAModificar);

    imprimerMensajeDeExito('El gasto fue eliminado. ' + respuestaDatosModificados);

}//fin function actualizarSaldo

async function eliminarGasto(idGasto) {
    let buscarDatosDeGasto = { seccion: 'buscarGastoPorId', idGasto: idGasto };
    let datosDeGasto = await buscarDatos(buscarDatosDeGasto);
    let datosDeSaldo = await buscarDatos({seccion: 'buscarSaldoPorId', inputSaldo: datosDeGasto.datos.FK_GASTO_SALDO[0]});

    await eliminarDatos({ 'seccion': 'eliminarGastoPorId', 'idGasto': idGasto });

    actualizarSaldo(datosDeGasto.datos.FK_GASTO_SALDO[0], parseFloat(datosDeGasto.datos.IMPORTE[0]), parseFloat(datosDeSaldo.datos.IMPORTE[0]));

    imprimirTodosLosSaldos(); 
    reestablecerFormulario();
    reestablecerTabla();
    destruirGrafico(document.getElementById('grafico'));

    
}//fin function eliminarGasto

function detectarInteraccionConBotonEliminar(claseDelBotonEliminar) {
    let iconosBotonEliminar = document.querySelectorAll(claseDelBotonEliminar);
    let mensajeDeConfirmacion = MENSAJES_DE_CONFIRMACION[claseDelBotonEliminar];

    iconosBotonEliminar.forEach((icono) => {
        icono.addEventListener('click', () => {
            if (confirm(mensajeDeConfirmacion)) {
                const valorEnIconoEliminar = icono.getAttribute('value');
                if (claseDelBotonEliminar === '.botonEliminarGasto') {
                    eliminarGasto(valorEnIconoEliminar);
                } else {
                    eliminarIngreso(valorEnIconoEliminar);
                }
            }
        });
    });
}//fin function detectarInteraccionConBotonEliminar

async function buscarDatosDeSaldoPorIngreso(datosDeIngreso) {
    const promesas = datosDeIngreso.datos.ID_INGRESO.map(id => 
        buscarDatos({ 'seccion': 'buscarSaldoPorFkSaldoIngreso', 'idIngreso': id })
    );
    
    return await Promise.all(promesas);
}

function almacenarDatosDeIngresosYSaldos(cantidadDeDatos, origenIngreso, ingresos, saldo) {
    let datos = { origenDeIngresos: [], ingresosActuales: [], saldosActuales: [] };
    for (let i = 0; i < cantidadDeDatos; i++) {
        console.log(saldo[i].datos.IMPORTE[0]);
        datos.origenDeIngresos.push(origenIngreso[i]);
        datos.ingresosActuales.push(ingresos[i]);
        if(saldo[i].cantidadDeResultados > 0){
            datos.saldosActuales.push(saldo[i].datos.IMPORTE[0]);
        } else {
            datos.saldosActuales.push(0.00);
        }

        
    }

    return datos;
}

async function devolverGastoTotal(datosDelServidor) {
    let idSaldo = datosDelServidor.FK_GASTO_SALDO[0];
    let mesActual = datosDelServidor.MES[0];
    let añoActual = datosDelServidor.AÑO[0];

    let datosAGraficar = { categoria: [], importeTotal: [], idCategoria: [] };
    let cantidadDeDatos = document.getElementById('inputCategoriaDeGasto').querySelectorAll('option').length;

    for (let i = 1; i < cantidadDeDatos; i++) {
        let buscarGastoTotal = {
            'seccion': 'buscarGastoTotalPorAñoMesInputSaldoInputCategoriaDeGasto', 
            'inputSaldo': idSaldo, 
            'inputCategoriaDeGasto': i, 
            'mes': mesActual, 
            'año': añoActual 
        };

        let datosDeGastoTotal = await buscarDatos(buscarGastoTotal); 

        if (datosDeGastoTotal.datos.IMPORTE_TOTAL[0] != null) {
            datosAGraficar.idCategoria.push(i);
            datosAGraficar.categoria.push(datosDeGastoTotal.datos.CATEGORIA[0]);
            datosAGraficar.importeTotal.push(datosDeGastoTotal.datos.IMPORTE_TOTAL[0]);
        }
    }

    return datosAGraficar;
}

async function gestionarDatos(solicitud, accion, datosDelServidor) {
    
    let ingresoPromedio = 0;
    let saldoPromedio = 0;
    let gastoPromedio = 0;
    let promedioAImprimir = '';

    if (accion === 'buscarIngreso') {
        let datosDeSaldo = await buscarDatosDeSaldoPorIngreso(datosDelServidor);
        let datos = almacenarDatosDeIngresosYSaldos(datosDelServidor.cantidadDeResultados, datosDelServidor.datos.ORIGEN, datosDelServidor.datos.IMPORTE, datosDeSaldo);
        let datosAGraficar = almacenarDatosDeIngresoParaGraficar(datosDelServidor, datos.origenDeIngresos, datos.ingresosActuales, datos.saldosActuales);
        /*console.log(datos);
        console.log(datosDeSaldo);*/
        crearGrafico('grafico', 'bar', 'Ingresos', datosAGraficar.origen, datosAGraficar.datosNumericos, datosAGraficar.colorDeBarra, datosAGraficar.colorDeBordeDeBarra, datosAGraficar.colorTextoDeBarra, datosAGraficar.colorDatosEjeX);
        imprimirDatosEnTabla('ingresos', datosDelServidor);
        detectarInteraccionConBotonEliminar('.botonEliminarIngreso');
        
        if(solicitud === 'buscarIngresoPorMesAño'){
            ingresoPromedio = devolverPromedioDeMatriz(datos.ingresosActuales);
            ingresoPromedio = formatearNumero(ingresoPromedio);
            console.log(ingresoPromedio);
            saldoPromedio = devolverPromedioDeMatriz(datos.saldosActuales);
            saldoPromedio = formatearNumero(saldoPromedio);
            promedioAImprimir = 'Ingreso promedio: $' + ingresoPromedio + ' - Saldo actual promedio: $' + saldoPromedio;
            imprimirPromedio(promedioAImprimir);
        }
        

    } else if (accion === 'buscarGasto') {
        datosDelServidor.datos.ORIGEN = document.getElementById('inputSaldo').querySelector('select option:checked').textContent;
        gastoPromedio = devolverPromedioDeMatriz(datosDelServidor.datos.IMPORTE);
        gastoPromedio = formatearNumero(gastoPromedio);
        promedioAImprimir = 'Gasto Promedio: $' + gastoPromedio;
        imprimirPromedio(promedioAImprimir);
        imprimirDatosEnTabla('gastos', datosDelServidor);

        let datosDeGastoTotal = await devolverGastoTotal(datosDelServidor.datos);
        let datosDeGastoAGraficar = almacenarDatosDeGastoParaGraficar(datosDeGastoTotal.idCategoria, datosDeGastoTotal.categoria, datosDeGastoTotal.importeTotal);
        
        crearGrafico('grafico', 'bar', 'Gastos por categoría', datosDeGastoAGraficar.categoriaDeGasto, datosDeGastoAGraficar.importeTotal, datosDeGastoAGraficar.colores, datosDeGastoAGraficar.coloresDeBorde, '#66ff66', '#66ff66');
        detectarInteraccionConBotonEliminar('.botonEliminarGasto');
    }
}

async function guardarSaldo(datosDeFormulario) {

    //Se buscan los datos de un ingreso específico.
    datosDeFormulario.seccion = 'buscarIngresoPorMesAñoOrigenDeIngreso';
    const datosDeIngreso = await buscarDatos(datosDeFormulario);

    let datosDeSaldo = { 
        seccion: 'guardarSaldo',
        inputImporte: datosDeFormulario.inputImporte,
        idIngreso: datosDeIngreso.datos.ID_INGRESO[0], 
        inputOrigenDeIngreso: datosDeFormulario.inputOrigenDeIngreso, 
        dia: datosDeFormulario.dia,
        mes: datosDeFormulario.mes, 
        año: datosDeFormulario.año 
    };
    //Se guarda los datos de saldo.
    let saldo = JSON.parse(await guardarDatos(datosDeSaldo));
}//fin function guardarSaldo

async function modificarSaldo(datosDeFormulario, datosDeSaldo) {
    const saldoActual = parseFloat(datosDeSaldo.datos.IMPORTE[0]);
    const gastoActual = parseFloat(datosDeFormulario.inputImporte);
    let nuevoSaldo = saldoActual - gastoActual;

    let datosDeSaldoAModificar = {
        'seccion': 'modificarSaldoPorOrigen',
        'inputImporte': nuevoSaldo,
        'dia': datosDeFormulario.dia,
        'mes': datosDeFormulario.mes,
        'año': datosDeFormulario.año,
        'idSaldo': datosDeFormulario.inputSaldo 
    };

    let respuestaDatosModificados = JSON.parse(await modificarDatos(datosDeSaldoAModificar));
    imprimerMensajeDeExito('Los datos se guardaron con éxito ' + respuestaDatosModificados);
}

async function guardarGasto(datosDeFormulario) {
    datosDeFormulario.seccion = 'guardarGasto';
    let datosDeGasto = JSON.parse(await guardarDatos(datosDeFormulario));
    imprimerMensajeDeExito('Los datos se guardaron con éxito ' + datosDeGasto);
}

async function buscarUltimoIngresoPorOrigen(datosDeTodosLosOrigenesDeIngreso) {
    const promesas = datosDeTodosLosOrigenesDeIngreso.datos.ID_ORIGEN.map(idOrigen => 
        buscarDatos({ seccion: 'buscarUltimoIngresoPorOrigenDeIngreso', inputOrigenDeIngreso: idOrigen })
    );
    return await Promise.all(promesas);
}

async function buscarUltimosIngresos() {
    const todosLosOrigenesDeIngreso = { 'seccion': 'buscarTodosLosOrigenesDeIngreso' };
    const datosDeTodosLosOrigenesDeIngreso = await buscarDatos(todosLosOrigenesDeIngreso);
    return await buscarUltimoIngresoPorOrigen(datosDeTodosLosOrigenesDeIngreso);
}

async function procesarSolicitudAlServidor(solicitud) {
    let datosDeFormulario = {};
    let datosDeGastos = {};
    let datosDeSaldo = {};
    let datosDeIngreso = {};
    
    switch (solicitud) {

        case 'guardarIngreso':

            //Se obtienen los datos del formulario.
            datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);

            //Se buscan los datos de un ingreso específico.
            datosDeFormulario.seccion = 'buscarIngresoPorMesAñoOrigenDeIngreso';
            datosDeIngreso = await buscarDatos(datosDeFormulario);
            console.log(datosDeFormulario);
           //Se verifica que el ingreso que se intenta guardar, no esté almacenado previamente, evitando almacenar datos duplicados.
            validarIngresoDuplicado(datosDeIngreso);

            //Se almacena la seccion para guardar los datos.
            datosDeFormulario.seccion = solicitud;
            let datosGuardados = JSON.parse(await guardarDatos(datosDeFormulario));
            imprimerMensajeDeExito('Los datos se guardaron con éxito ' + datosGuardados);

            //Se guarda el saldo.
            guardarSaldo(datosDeFormulario);
            await imprimirTodosLosIngresos();
            await imprimirTodosLosSaldos();

            const datosDeTodosLosSaldos = await buscarDatosDeTodosLosSaldos();
            cargarSaldos(datosDeTodosLosSaldos);

            break;

        case 'guardarGasto':    
            datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);
            datosDeSaldo = await buscarDatos({ seccion: 'buscarSaldoPorId', inputSaldo: datosDeFormulario.inputSaldo });
            validarImporteRespectoAlSaldo(datosDeFormulario.inputImporte, datosDeSaldo);
            await modificarSaldo(datosDeFormulario, datosDeSaldo);
            await guardarGasto(datosDeFormulario);
            await imprimirTodosLosSaldos();
            break;

        case 'buscarIngresoPorMesAño':
        case 'buscarIngresoPorMesAñoOrigenDeIngreso':
            datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);
            datosDeFormulario.seccion = solicitud;
            
            datosDeIngreso = await buscarDatos(datosDeFormulario); 
            validarCantidadDeResultadosObtenidos(datosDeIngreso.cantidadDeResultados);
            gestionarDatos(solicitud, 'buscarIngreso', datosDeIngreso);
            break;

        case 'buscarGastosPorAñoMesSaldo':
        case 'buscarGastosPorAñoMesSaldoCategoriaDeGasto':
            datosDeFormulario = obtenerDatosDeFormularioPorSolicitud(solicitud);
            datosDeFormulario.seccion = solicitud;
            datosDeGastos = await buscarDatos(datosDeFormulario);
            console.log(datosDeGastos);
            validarCantidadDeResultadosObtenidos(datosDeGastos.cantidadDeResultados);
            gestionarDatos(solicitud, 'buscarGasto', datosDeGastos);
            break;
    }
}

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
            solicitudActual = id;
        });
    });
}