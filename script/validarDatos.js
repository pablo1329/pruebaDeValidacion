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
        valorAbsolutoMinimo: 0.00,
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
    inputDetalleDelGasto: {}
};

const PARRAFOS_POR_INPUTS = {
    'inputFecha': 'mensajeInputFecha',
    'inputOrigenDeIngreso': 'mensajeInputOrigenDeIngreso',
    'inputSaldo': 'mensajeInputSaldo',
    'inputCategoriaDeGasto': 'mensajeInputCategoriaDeGasto',
    'inputDetalleDelGasto': 'mensajeInputDetalleDelGasto',
    'inputImporte': 'mensajeInputImporte'
};

function validarValoresVacios(valor) {
    return valor === null || 
           valor === undefined || 
           valor === "" || 
           valor === " " || 
           Number.isNaN(valor);
}

function validarLongitudDeCadena(campo, cadena, longitudMinima, longitudMaxima) {
    if (cadena.length < longitudMinima || cadena.length > longitudMaxima) {
        throw new ValidacionError(`El campo "${campo}" debe tener entre ${longitudMinima} y ${longitudMaxima} caracteres.`, campo);
    }
}

function validarCaracteresPermitidosEnCadena(campo, cadena) {
    const regex = RESTRICCIONES[campo].caracteresPermitidos;
    if (regex && !regex.test(cadena)) {
        throw new ValidacionError(`El campo "${campo}" contiene caracteres no permitidos.`, campo);
    }
}

function validarString(valor, campo) {
    const cadenaSinEspacios = String(valor).trim();
    validarLongitudDeCadena(campo, cadenaSinEspacios, RESTRICCIONES[campo].longitudMinima, RESTRICCIONES[campo].longitudMaxima);
    validarCaracteresPermitidosEnCadena(campo, cadenaSinEspacios);
    return cadenaSinEspacios;
}

function validarLimitesAbsolutosDeNumero(campo, numero, limiteMinimo, limiteMaximo) {
    if (numero < limiteMinimo || numero > limiteMaximo) {
        throw new ValidacionError(`El campo "${campo}" debe estar entre ${limiteMinimo} y ${limiteMaximo}.`, campo);
    }
}

function validarNumeroEntero(valor, campo) {
    const numero = Number(valor);

    if (!Number.isInteger(numero)) {
        throw new ValidacionError(`El campo "${campo}" debe ser un número entero.`, campo);
    }

    validarLimitesAbsolutosDeNumero(campo, numero, RESTRICCIONES[campo].valorAbsolutoMinimo, RESTRICCIONES[campo].valorAbsolutoMaximo);
    return valor;
}

function validarDatos(datosDeFormulario) {
    let almacenarError = { propiedades: [], codigosDeError: [] };

    for (const [propiedad, valor] of Object.entries(datosDeFormulario)) {
        const restriccionPorInput = RESTRICCIONES[propiedad];
        
        if (!restriccionPorInput) continue;

        const verificarValorVacio = validarValoresVacios(valor);
        
        if (verificarValorVacio) {
            if (restriccionPorInput.obligatorio) {
                almacenarError.propiedades.push(propiedad);
                almacenarError.codigosDeError.push('propiedadObligatoriaVacia');
            }
        }
    }

    if (almacenarError.propiedades.length > 0) {
        throw new ValidacionError('inputFormulario', almacenarError);
    }
  
    return datosDeFormulario;
}

async function validarIngresoDuplicado(datosDeFormulario) {
    datosDeFormulario.seccion = 'buscarIngresoPorMesAñoOrigenDeIngreso';
    let datosDeIngreso = await buscarDatos(datosDeFormulario);   
    
    if (datosDeIngreso.cantidadDeResultados > 0) {
        throw new ValidacionError('servidor', { codigosDeError: 'datosDuplicados' });
    }
}

function validarCantidadDeResultadosObtenidos(cantidadDeResultados) {
    if (cantidadDeResultados === 0) {
        throw new ValidacionError('servidor', { codigosDeError: 'sinResultados' });
    }
}

async function validarImporteRespectoAlSaldo(datosDeFormulario, datosDeSaldo) {
    let gastoConvertido = parseFloat(datosDeFormulario.inputImporte);
    let saldoConvertido = parseFloat(datosDeSaldo.datos.IMPORTE[0]);
    
    if (gastoConvertido > saldoConvertido) {
        throw new ValidacionError('servidor', { codigosDeError: 'gastoSuperiorAlSueldo' });
    }
}