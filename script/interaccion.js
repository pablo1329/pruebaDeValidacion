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


async function gestionarDatos(solicitud, accion, datosDelServidor) {
    
    let ingresoPromedio = 0;
    let saldoPromedio = 0;
    let gastoPromedio = 0;
    let promedioAImprimir = '';

    if (accion === 'buscarIngreso') {
        let datosDeSaldo = await buscarDatosDeSaldoPorIngreso(datosDelServidor);
        let datos = almacenarDatosDeIngresosYSaldos(datosDelServidor.cantidadDeResultados, datosDelServidor.datos.ORIGEN, datosDelServidor.datos.IMPORTE, datosDeSaldo);
        let datosAGraficar = almacenarDatosDeIngresoParaGraficar(datosDelServidor, datos.origenDeIngresos, datos.ingresosActuales, datos.saldosActuales);
        crearGrafico('grafico', 'bar', 'Ingresos', datosAGraficar.origen, datosAGraficar.datosNumericos, datosAGraficar.colorDeBarra, datosAGraficar.colorDeBordeDeBarra, datosAGraficar.colorTextoDeBarra, datosAGraficar.colorDatosEjeX);
        imprimirDatosEnTabla('ingresos', datosDelServidor);
        detectarInteraccionConBotonEliminar('.botonEliminarIngreso');
        
        if(solicitud === 'buscarIngresoPorMesAño'){
            ingresoPromedio = devolverPromedioDeMatriz(datos.ingresosActuales);
            ingresoPromedio = formatearNumero(ingresoPromedio);
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

}//fin function gestionarDatos

function inicializarEventosFormulario() {
    let botonDeFormulario = document.getElementById('botonForm');
    botonDeFormulario.addEventListener('click', (event) => {
        event.preventDefault();
        if (botonDeFormulario.name) {
            reestablecerVistaPrincipal();
            procesarSolicitudAlServidor(botonDeFormulario.name);
        }
    });

}//fin function inicializarEventosFormulario()

function detectarInteraccionConBarraDeInicio() {
    let elementosDeListaPrincipal = document.querySelectorAll('li');
    let solicitudActual = '';
    elementosDeListaPrincipal.forEach((element) => {
        element.addEventListener('click', () => {
            const id = element.getAttribute('id');
            administrarVistaDeFormularioPorId(id);
            reestablecerVistaPrincipal();
            solicitudActual = id;
        });
    });

}//fin function detectarInteraccionConBarraDeInicio()