const url = 'php/index.php';

function devolverConfiguracionDeEnvio(metodo, datosDeFormulario = '') {
    let headers = { 'Accept': 'application/json' };
    
    let configuracion = {
        method: metodo,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers
    };

    if (metodo !== 'GET') {
        headers['Content-Type'] = 'application/json';
        configuracion.body = JSON.stringify(datosDeFormulario);
        configuracion.redirect = 'follow';
        configuracion.referrerPolicy = 'no-referrer';
    }

    return configuracion;
}

function devolverURLConParametros(datos) {
    const parametros = new URLSearchParams(datos);
    return `${url}?${parametros.toString()}`;
}

async function enviarDatos(url = '', configuracion) {
    const respuesta = await fetch(url, configuracion);
    
    if (!respuesta.ok) {
        const mensajeError = await respuesta.text();
        console.error("Detalle del error del servidor:", mensajeError);
        throw new Error(mensajeError);
    }

    return await respuesta.text();
}

function solicitarDatosSinParametros() {
    let configuracion = devolverConfiguracionDeEnvio('GET');
    return enviarDatos(url, configuracion);
}

function solicitarDatosConParametros(datos) {
    let configuracion = devolverConfiguracionDeEnvio('GET');
    const nuevaURL = devolverURLConParametros(datos);
    return enviarDatos(nuevaURL, configuracion);
}

async function guardarDatos(datosDeFormulario) {
    let configuracion = devolverConfiguracionDeEnvio('POST', datosDeFormulario);
    return await enviarDatos(url, configuracion);
}

async function buscarDatosDeTodosLosSaldos() {
    const todosLosOrigenesDeIngreso = { 'seccion': 'buscarTodosLosOrigenesDeIngreso' };
    const datosDeTodosLosOrigenesDeIngreso = await buscarDatos(todosLosOrigenesDeIngreso);

    const promesas = datosDeTodosLosOrigenesDeIngreso.datos.ID_ORIGEN.map(idOrigen =>
        buscarDatos({
            seccion: 'buscarUltimoSaldoPorOrigenDeIngreso',
            inputOrigenDeIngreso: idOrigen
        })
    );

    return await Promise.all(promesas);
}

async function modificarDatos(datos) {
    let configuracion = devolverConfiguracionDeEnvio('PATCH', datos);
    return await enviarDatos(url, configuracion);
}

async function eliminarDatos(datos) {
    let configuracion = devolverConfiguracionDeEnvio('DELETE', datos);
    return await enviarDatos(url, configuracion);
}

async function buscarDatos(datos) {
    let json = await solicitarDatosConParametros(datos);
    return JSON.parse(json);
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

async function guardarGasto(datosDeFormulario) {
    datosDeFormulario.seccion = 'guardarGasto';
    let datosDeGasto = JSON.parse(await guardarDatos(datosDeFormulario));
    imprimerMensajeDeExito('Los datos se guardaron con éxito ' + datosDeGasto);
}


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

async function buscarDatosDeSaldoPorIngreso(datosDeIngreso) {
    const promesas = datosDeIngreso.datos.ID_INGRESO.map(id => 
        buscarDatos({ 'seccion': 'buscarSaldoPorFkSaldoIngreso', 'idIngreso': id })
    );
    
    return await Promise.all(promesas);
}

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

async function eliminarIngreso(idIngreso) {

    reestablecerTabla();

    let datosDeSaldo = await buscarDatos({seccion: 'buscarSaldoPorFkSaldoIngreso', idIngreso: idIngreso });
    const idSaldo = datosDeSaldo.datos.ID_SALDO[0];

    let gastoEliminado = JSON.parse(await solicitarDatosConParametros({seccion: 'eliminarGastoPorId', idGasto: idSaldo }));
    let datosDeSaldoEliminado = JSON.parse(await solicitarDatosConParametros({seccion: 'eliminarSaldoPorId', idSaldo: idSaldo }));
    let respuestaIngresoEliminado = JSON.parse(await solicitarDatosConParametros({seccion: 'eliminarIngresoPorId', idIngreso: datosDeSaldo.datos.FK_SALDO_INGRESO[0]}));
    await imprimirTodosLosSaldos();
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
            validarCantidadDeResultadosObtenidos(datosDeGastos.cantidadDeResultados);
            gestionarDatos(solicitud, 'buscarGasto', datosDeGastos);
        break;
    }
    
}//fin function procesarSolicitudAlServidor