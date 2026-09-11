const DATOS_DE_TARJETAS_DE_INICIO = { 
    'ingreso': {
        'Carol': { idEncabezadoDeTarjeta: 'encabezadoIngresoCarol', idImporteIngresoSinFormatear: 'importeIngresoSinFormatearCarol', idImporteIngreso: 'importeIngresoCarol', idFechaIngreso: 'fechaIngresoCarol' },
        'Pablo': { idEncabezadoDeTarjeta: 'encabezadoIngresoPablo', idImporteIngresoSinFormatear: 'importeIngresoSinFormatearPablo', idImporteIngreso: 'importeIngresoPablo', idFechaIngreso: 'fechaIngresoPablo' },
        'Alquiler': { idEncabezadoDeTarjeta: 'encabezadoIngresoAlquiler', idImporteIngresoSinFormatear: 'importeIngresoSinFormatearAlquiler', idImporteIngreso: 'importeIngresoAlquiler', idFechaIngreso: 'fechaIngresoAlquiler' },
        'Total': { idEncabezadoDeTarjeta: 'encabezadoIngresoTotal', idImporteIngreso: 'importeIngresoTotal', idFechaIngreso: 'fechaIngresoTotal' } 
    },
    'saldo': {
        'Carol': { idEncabezadoDeTarjeta: 'encabezadoSaldoCarol', idImporteIngreso: 'importeSaldoCarol', idFechaIngreso: 'fechaSaldoCarol', idImagen: 'imagenSaldoCarol' },
        'Pablo': { idEncabezadoDeTarjeta: 'encabezadoSaldoPablo', idImporteIngreso: 'importeSaldoPablo', idFechaIngreso: 'fechaSaldoPablo', idImagen: 'imagenSaldoPablo' },
        'Alquiler': { idEncabezadoDeTarjeta: 'encabezadoSaldoAlquiler', idImporteIngreso: 'importeSaldoAlquiler', idFechaIngreso: 'fechaSaldoAlquiler', idImagen: 'imagenSaldoAlquiler' },
        'Total': { idEncabezadoDeTarjeta: 'encabezadoSaldoTotal', idImporteIngreso: 'importeSaldoTotal', idFechaIngreso: 'fechaSaldoTotal', idImagen: 'imagenSaldoTotal' } 
    }
};

const NOMBRE_DE_MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

async function imprimirImagenes(origen, ingresoActual, saldoActual) {
    let imagenActual = document.getElementById(DATOS_DE_TARJETAS_DE_INICIO['saldo'][origen]?.idImagen);
    if (!imagenActual) return;

    let porcentaje = (saldoActual * 100) / ingresoActual;
    let src = 'imagenes/';

    if (porcentaje > 50) {
        src += 'numero 100.png';
    } else if (porcentaje > 30) {
        src += 'porcentaje 50.webp';
    } else {
        src += 'numero 30.png';
    }

    imagenActual.setAttribute('src', src);
}

async function imprimirTodasLasImagensPorSaldo() {
    const origenesDeIngresos = await buscarDatos({ seccion: 'buscarTodosLosOrigenesDeIngreso' });
    const cantidadDeResultados = origenesDeIngresos.cantidadDeResultados;

    const promesas = Array.from({ length: cantidadDeResultados }, async (_, i) => {
        const idOrigen = origenesDeIngresos.datos.ID_ORIGEN[i];
        const [datosDeIngresos, datosDeSaldo] = await Promise.all([
            buscarDatos({ seccion: 'buscarUltimoIngresoPorOrigenDeIngreso', inputOrigenDeIngreso: idOrigen }),
            buscarDatos({ seccion: 'buscarUltimoSaldoPorOrigenDeIngreso', inputOrigenDeIngreso: idOrigen })
        ]);

        imprimirImagenes(datosDeIngresos.datos.ORIGEN[0], datosDeIngresos.datos.IMPORTE[0], datosDeSaldo.datos.IMPORTE[0]);

        return {
            ingreso: parseFloat(datosDeIngresos.datos.IMPORTE[0]),
            saldo: parseFloat(datosDeSaldo.datos.IMPORTE[0])
        };
    });

    const resultados = await Promise.all(promesas);

    const importeTotal = resultados.reduce((acc, curr) => ({
        ingresoTotal: acc.ingresoTotal + curr.ingreso,
        saldoTotal: acc.saldoTotal + curr.saldo
    }), { ingresoTotal: 0, saldoTotal: 0 });

    imprimirImagenes('Total', importeTotal.ingresoTotal, importeTotal.saldoTotal);
}

function obtenerConfiguracionDeFormulario(idDeLista) {
    let configuracion = { cajasAMostrar: [], legendForm: '', nameBotonForm: '', contenidoDeTextoDeBotonForm: '', iconoBotonForm: '' };

    switch (idDeLista) {
        case 'guardarIngreso':
            configuracion.cajasAMostrar = ['cajaFecha', 'cajaImporte', 'cajaOrigen'];
            configuracion.legendForm = 'Guardar Ingreso';
            configuracion.nameBotonForm = 'guardarIngreso';
            configuracion.contenidoDeTextoDeBotonForm = 'Guardar';
            configuracion.iconoBotonForm = 'iconoGuardar';
            break;
        case 'guardarGasto':
            configuracion.cajasAMostrar = ['cajaFecha', 'cajaCategoriaGasto', 'cajaSaldo', 'cajaImporte', 'cajaDetalleDeGasto'];
            configuracion.legendForm = 'Guardar Gasto';
            configuracion.nameBotonForm = 'guardarGasto';
            configuracion.contenidoDeTextoDeBotonForm = 'Guardar';
            configuracion.iconoBotonForm = 'iconoGuardar';
            break;
        case 'buscarIngresoPorMesAñoOrigenDeIngreso':
            configuracion.cajasAMostrar = ['cajaFecha', 'cajaOrigen'];
            configuracion.legendForm = 'Buscar Ingreso';
            configuracion.nameBotonForm = 'buscarIngresoPorMesAñoOrigenDeIngreso';
            configuracion.contenidoDeTextoDeBotonForm = 'Buscar';
            configuracion.iconoBotonForm = 'iconoBuscar';
            break;
        case 'buscarGastosPorAñoMesSaldoCategoriaDeGasto':
            configuracion.cajasAMostrar = ['cajaFecha', 'cajaCategoriaGasto', 'cajaSaldo'];
            configuracion.legendForm = 'Buscar Gastos';
            configuracion.nameBotonForm = 'buscarGastosPorAñoMesSaldoCategoriaDeGasto';
            configuracion.contenidoDeTextoDeBotonForm = 'Buscar';
            configuracion.iconoBotonForm = 'iconoBuscar';
            break;
    }

    return configuracion;
}

function mostrarCamposDeFormulario(configuracion) {
    const todosLosCamposDeFormulario = ['cajaFecha', 'cajaOrigen', 'cajaSaldo', 'cajaCategoriaGasto', 'cajaDetalleDeGasto', 'cajaImporte'];

    todosLosCamposDeFormulario.forEach((element) => {
        const incluido = configuracion.cajasAMostrar.includes(element);
        document.getElementById(element)?.classList.toggle('d-none', !incluido);
    });

    agregarOptionPorNombreDeBotonDeFormulario(configuracion.nameBotonForm);
}

function mostrarIconoDeBotonDeFormulario(configuracion) {
    const todosLosIconosDeBotonDeFormulario = ['iconoGuardar', 'iconoBuscar', 'iconoModificar'];

    todosLosIconosDeBotonDeFormulario.forEach((element) => {
        document.getElementById(element)?.classList.toggle('d-none', element !== configuracion.iconoBotonForm);
    });
}

function actualizarNombreBotonFormulario(nombre) {
    document.getElementById('botonForm').setAttribute('name', nombre);
}

function configurarCambioDinamicoBoton(inputId, nombreBase, nombreConFiltro) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    inputElement.addEventListener('change', () => {
        const valor = parseInt(inputElement.value, 10);
        const nuevoNombre = valor === 0 ? nombreConFiltro : nombreBase;
        actualizarNombreBotonFormulario(nuevoNombre);
    });
}

function configurarDinamicaSegunLista(idDeLista) {
    const configuraciones = {
        'buscarIngresoPorMesAñoOrigenDeIngreso': { inputId: 'inputOrigenDeIngreso', nombreBase: 'buscarIngresoPorMesAñoOrigenDeIngreso', nombreConFiltro: 'buscarIngresoPorMesAño' },
        'buscarGastosPorAñoMesSaldoCategoriaDeGasto': { inputId: 'inputCategoriaDeGasto', nombreBase: 'buscarGastosPorAñoMesSaldoCategoriaDeGasto', nombreConFiltro: 'buscarGastosPorAñoMesSaldo' }
    };

    const config = configuraciones[idDeLista];
    if (config) {
        configurarCambioDinamicoBoton(config.inputId, config.nombreBase, config.nombreConFiltro);
    }
}

function administrarVistaDeFormularioPorId(idDeLista) {
    let configuracion = obtenerConfiguracionDeFormulario(idDeLista);
    
    mostrarCamposDeFormulario(configuracion);

    document.getElementById('legendForm').textContent = configuracion.legendForm;
    document.getElementById('botonForm').setAttribute('name', configuracion.nameBotonForm);
    document.getElementById('nombreDeBoton').textContent = configuracion.contenidoDeTextoDeBotonForm;

    mostrarIconoDeBotonDeFormulario(configuracion);
    configurarDinamicaSegunLista(idDeLista);
}

function imprimirErroresEnFormulario(idsDeParrafosRelacionadosAInputs, erroresPorCodigoDeError) {
    idsDeParrafosRelacionadosAInputs.forEach((id, i) => {
        let parrafo = document.getElementById(id);
        if (parrafo) {
            parrafo.classList.add('mensajeDeError');
            parrafo.textContent = erroresPorCodigoDeError[i];
        }
    });
}

function imprimirMensajeDeErrorDelServidor(objetoError, mensajeDeError) {
    let cajaDeMensajeDelServidor = document.getElementById('cajaMensajeDelServidor');
    let parrafo = cajaDeMensajeDelServidor.querySelector('p');

    cajaDeMensajeDelServidor.classList.remove('d-none', 'cajaDeMensajeDeExito');
    cajaDeMensajeDelServidor.classList.add('cajaDeMensajeDeError');
    parrafo.textContent = mensajeDeError;
}

function imprimerMensajeDeExito(mensajeDeExito) {
    let cajaDeMensajeDelServidor = document.getElementById('cajaMensajeDelServidor');
    let parrafo = cajaDeMensajeDelServidor.querySelector('p');

    cajaDeMensajeDelServidor.classList.remove('d-none', 'cajaDeMensajeDeError');
    cajaDeMensajeDelServidor.classList.add('cajaDeMensajeDeExito');
    parrafo.textContent = mensajeDeExito;
}

function obtenerDatosDeTarjeta(origenDeIngreso) {
    return DATOS_DE_TARJETAS_DE_INICIO['ingreso'][origenDeIngreso] || DATOS_DE_TARJETAS_DE_INICIO['ingreso']['Total'];
}

function obtenerDatosDeTarjetasDeSaldo(origenDeIngreso) {
    return DATOS_DE_TARJETAS_DE_INICIO['saldo'][origenDeIngreso] || DATOS_DE_TARJETAS_DE_INICIO['saldo']['Total'];
}

function imprimirDatosDeIngresoPorOrigen(origenDeIngreso, año, mes, importe) {
    let datosDeTarjeta = obtenerDatosDeTarjeta(origenDeIngreso);
    let importeFormateado = formatearNumero(importe);
    
    document.getElementById(datosDeTarjeta.idEncabezadoDeTarjeta).textContent = 'Ingreso ' + origenDeIngreso;
    document.getElementById(datosDeTarjeta.idImporteIngreso).textContent = '$' + importeFormateado;
    document.getElementById(datosDeTarjeta.idFechaIngreso).textContent = NOMBRE_DE_MESES[mes] + ' ' + año;
}

function imprimirDatosDeSaldoPorOrigen(origenDeIngreso, dia, mes, año, importe) {
    let datosDeTarjeta = obtenerDatosDeTarjetasDeSaldo(origenDeIngreso);
    let importeFormateado = typeof importe === 'number' ? formatearNumero(importe) : importe;
    
    document.getElementById(datosDeTarjeta.idEncabezadoDeTarjeta).textContent = 'Saldo ' + origenDeIngreso;
    document.getElementById(datosDeTarjeta.idImporteIngreso).textContent = typeof importe === 'number' ? '$' + importeFormateado : importeFormateado;
    document.getElementById(datosDeTarjeta.idFechaIngreso).textContent = dia ? `${dia}/${mes}/${año}` : ''; 
}

async function imprimirTodosLosIngresos() {
    const datosDeUltimoIngreso = await buscarUltimosIngresos();
    let importes = [];
    let mes = 0, año = 0;

    datosDeUltimoIngreso.forEach((ingreso) => {
        imprimirDatosDeIngresoPorOrigen(ingreso.datos.ORIGEN[0], ingreso.datos.AÑO[0], ingreso.datos.MES[0], ingreso.datos.IMPORTE[0]);
        mes = ingreso.datos.MES[0];
        año = ingreso.datos.AÑO[0];
        importes.push(ingreso.datos.IMPORTE[0]);
    });

    let totalDeIngresos = sumarNumerosEnMatriz(importes);
    imprimirDatosDeIngresoPorOrigen('Total', año, mes, totalDeIngresos);
}

async function imprimirTodosLosSaldos() {
    const datosDeSaldo = await buscarDatosDeTodosLosSaldos();
    let datosLocales = { AÑO: [], MES: [], DIA: [], IMPORTE: [] };

    datosDeSaldo.forEach((saldo) => {
        const origen = saldo.datos?.ORIGEN?.[0] || 'Desconocido';
        if (saldo.cantidadDeResultados > 0) {
            imprimirDatosDeSaldoPorOrigen(origen, saldo.datos.DIA[0], saldo.datos.MES[0], saldo.datos.AÑO[0], saldo.datos.IMPORTE[0]);
            datosLocales.DIA.push(saldo.datos.DIA[0]);
            datosLocales.MES.push(saldo.datos.MES[0]);
            datosLocales.AÑO.push(saldo.datos.AÑO[0]);
            datosLocales.IMPORTE.push(saldo.datos.IMPORTE[0]);
        } else {
            imprimirDatosDeSaldoPorOrigen(origen, 0, 0, 0, 'SALDO NO ENCONTRADO');
            datosLocales.DIA.push(1);
            datosLocales.MES.push(1);
            datosLocales.AÑO.push(1995);
            datosLocales.IMPORTE.push(0);
        }
    });

    let totalDeIngresos = sumarNumerosEnMatriz(datosLocales.IMPORTE);
    let fechaMasReciente = devolverFechaMasReciente(datosLocales);
    imprimirDatosDeSaldoPorOrigen('Total', fechaMasReciente.dia, fechaMasReciente.mes, fechaMasReciente.año, totalDeIngresos);
}

function mostrarEncabezadoDeTabla(seccion) {
    document.getElementById('encabezadoIngreso').classList.toggle('d-none', seccion !== 'ingresos');
    document.getElementById('encabezadoGastos').classList.toggle('d-none', seccion === 'ingresos');
}

function imprimirDatosDeIngreso(origen, fechaFormateada, importeFormateado, idIngreso) {
    return `<tr>
        <td>${origen}</td>
        <td>${fechaFormateada}</td>
        <td>$${importeFormateado}</td>
        <td><svg xmlns="http://www.w3.org/2000/svg" class="bi bi-trash mx-2 botonEliminarIngreso" viewBox="0 0 16 16" value="${idIngreso}">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
            </svg></td>
    </tr>`;
}

function imprimirDatosDeGasto(origen, fechaFormateada, categoriaDeGasto, importeFormateado, detalle, idGasto) {
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
}

function imprimirDatosEnCuerpoDeTabla(accion, cantidadDeDatos, datos) {
    const cuerpoTabla = document.getElementById('cuerpoDeTabla');
    let htmlFilas = '';
    
    for (let i = 0; i < cantidadDeDatos; i++) {
        const fechaFormateada = devolverFechaCompleta(datos.DIA[i], datos.MES[i], datos.AÑO[i]);
        const importeFormateado = formatearNumero(datos.IMPORTE[i]);

        if (accion === 'imprimirDatosDeIngreso') {
            htmlFilas += imprimirDatosDeIngreso(datos.ORIGEN[i], fechaFormateada, importeFormateado, datos.ID_INGRESO[i]);
        } else if (accion === 'imprimirDatosDeGasto') {
            htmlFilas += imprimirDatosDeGasto(datos.ORIGEN, fechaFormateada, datos.CATEGORIA[i], importeFormateado, datos.DETALLE[i], datos.ID_GASTO[i]);
        }
    }

    cuerpoTabla.innerHTML = htmlFilas;
}

function imprimirDatosEnTabla(idEncabezadoDeTabla, datosDelServidor) {
    if (idEncabezadoDeTabla === 'ingresos') {
        mostrarEncabezadoDeTabla('ingresos');
        imprimirDatosEnCuerpoDeTabla('imprimirDatosDeIngreso', datosDelServidor.cantidadDeResultados, datosDelServidor.datos);
    } else if (idEncabezadoDeTabla === 'gastos') {
        mostrarEncabezadoDeTabla('gastos');
        imprimirDatosEnCuerpoDeTabla('imprimirDatosDeGasto', datosDelServidor.cantidadDeResultados, datosDelServidor.datos);
    }
}

function reestablecerCajaDeMensaje() {
    let cajaDeMensajeDelServidor = document.getElementById('cajaMensajeDelServidor');
    let parrafo = cajaDeMensajeDelServidor.querySelector('p');
    cajaDeMensajeDelServidor.classList.remove('cajaDeMensajeDeError', 'cajaDeMensajeDeExito');
    cajaDeMensajeDelServidor.classList.add('d-none');
    parrafo.textContent = '';
}

function reestablecerTabla() {
    document.getElementById('encabezadoGastos').classList.add('d-none');
    document.getElementById('encabezadoIngreso').classList.add('d-none');
    document.getElementById('cuerpoDeTabla').innerHTML = '';
}

function reestablecerFormulario() {
    let parrafosDeFormulario = document.getElementById('formGestionDeDatos').querySelectorAll('p');
    parrafosDeFormulario.forEach(elemento => {
        elemento.classList.remove('mensajeDeError');
        elemento.textContent = '';
    });
}

function reestablecerVistaPrincipal() {
    destruirGrafico(document.getElementById('grafico'));
    reestablecerFormulario();
    reestablecerCajaDeMensaje();
    reestablecerTabla();
}

function imprimirPromedio(datos){

            const cajaMensajeDelServidor = document.getElementById('cajaMensajeDelServidor');
            cajaMensajeDelServidor.classList.remove('d-none');
            cajaMensajeDelServidor.classList.add('cajaDeMensajeDeExito');
            cajaMensajeDelServidor.querySelector('p').textContent = datos;

}//fin function imprimirPromedio