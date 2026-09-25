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

const RESTRICCIONES = {  
    inputFecha: {
        obligatorio: true,
        longitudMinima: 8,
        longitudMaxima: 15,
        caracteresPermitidos: /^[0-9-]+$/,
        tipoDeDatoAValidar: 'date',
        valorAbsolutoMinimo: 0,
        valorAbsolutoMaximo: 0
    },
    inputImporte: {
        obligatorio: true,
        longitudMinima: 1,
        longitudMaxima: 15,
        caracteresPermitidos: /^\d+(\.\d+)?$/,
        tipoDeDatoAValidar: 'float',
        valorAbsolutoMinimo: 1.00,
        valorAbsolutoMaximo: 999999999.99
    },
    inputOrigenDeIngreso: {
        obligatorio: true,
        longitudMinima: 1,
        longitudMaxima: 11,
        caracteresPermitidos: /^[0-9]+$/,
        tipoDeDatoAValidar: 'int',
        valorAbsolutoMinimo: 1,
        valorAbsolutoMaximo: 9
    },
    inputSaldo: {
        obligatorio: true,
        longitudMinima: 1,
        longitudMaxima: 11,
        caracteresPermitidos: /^[0-9]+$/,
        tipoDeDatoAValidar: 'int',
        valorAbsolutoMinimo: 1,
        valorAbsolutoMaximo: 99999999999
    },
    inputCategoriaDeGasto: {
        obligatorio: true,
        longitudMinima: 1,
        longitudMaxima: 2,
        caracteresPermitidos: /^[0-9]+$/,
        tipoDeDatoAValidar: 'int',
        valorAbsolutoMinimo: 1,
        valorAbsolutoMaximo: 99
    },
    inputDetalleDelGasto: {
        obligatorio: true,
        longitudMinima: 2,
        longitudMaxima: 150,
        caracteresPermitidos: /^[a-zA-ZÀ-ÿ0-9,.\s]+$/,
        tipoDeDatoAValidar: 'string',
        valorAbsolutoMinimo: 0,
        valorAbsolutoMaximo: 0
    }
};

const PARRAFOS_POR_INPUTS = {
    'inputFecha': 'mensajeInputFecha',
    'inputOrigenDeIngreso': 'mensajeInputOrigenDeIngreso',
    'inputSaldo': 'mensajeInputSaldo',
    'inputCategoriaDeGasto': 'mensajeInputCategoriaDeGasto',
    'inputDetalleDelGasto': 'mensajeInputDetalleDelGasto',
    'inputImporte': 'mensajeInputImporte'
};

