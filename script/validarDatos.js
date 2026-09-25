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

function validarNumeroDecimal(valor, restriccion) {
    // Si no hay restricciones definidas para este campo, lo damos por válido
    if (!restriccion || !restriccion.caracteresPermitidos) {
        return null;
    }
    
    if (!restriccion.caracteresPermitidos.test(valor)) {
        return 'valorNumericoDecimalInvalido';
    }

    const numero = parseFloat(valor);

    if (numero < restriccion.valorAbsolutoMinimo) {
        return 'valorAbsolutoInferior';
    }
    if (numero > restriccion.valorAbsolutoMaximo) {
        return 'valorAbsolutoSuperior';
    }

    return null;
}

function validarDatos(datosDeFormulario) {
    let almacenarError = { propiedades: [], codigosDeError: [] };

    for (const [propiedad, valorCrudo] of Object.entries(datosDeFormulario)) {
        const restriccionPorInput = RESTRICCIONES[propiedad];

        if (!restriccionPorInput) continue;

        // 1. Limpieza de espacios
        let valor = typeof valorCrudo === 'string' ? valorCrudo.trim() : String(valorCrudo);
        
        // 2. NORMALIZACIÓN INMEDIATA: Reemplazar la coma por punto si es float
        if (restriccionPorInput.tipoDeDatoAValidar === 'float') {
            valor = valor.replace(',', '.');
        }

        // Guardamos el valor ya normalizado en el formulario
        datosDeFormulario[propiedad] = valor;

        // 3. Validar si está vacío
        const verificarValorVacio = validarValoresVacios(valor);
        if (verificarValorVacio) {
            if (restriccionPorInput.obligatorio) {
                almacenarError.propiedades.push(propiedad);
                almacenarError.codigosDeError.push('propiedadObligatoriaVacia');
            }
            continue; 
        }

        if (restriccionPorInput.tipoDeDatoAValidar === 'int') {
            codigoErrorEspecifico = validarNumeroEntero(valor, propiedad);
        } else if (restriccionPorInput.tipoDeDatoAValidar === 'float') {
            codigoErrorEspecifico = validarNumeroDecimal(valor, restriccionPorInput);
        }

       
            //almacenarError.propiedades.push(propiedad);
            //almacenarError.codigosDeError.push(codigoErrorEspecifico);
        
    }
    
    if (almacenarError.propiedades.length > 0) {
        throw new ValidacionError('inputFormulario', almacenarError);
    }
  
    return datosDeFormulario;
}

async function validarIngresoDuplicado(datosDeIngreso) {
    
    if (datosDeIngreso.cantidadDeResultados > 0) {
        throw new ValidacionError('servidor', { codigosDeError: 'datosDuplicados' });
    }

}//fin function validarIngresoDuplicado

function validarCantidadDeResultadosObtenidos(cantidadDeResultados) {
    if (cantidadDeResultados === 0) {
        throw new ValidacionError('servidor', { codigosDeError: 'sinResultados' });
    }
}

function validarImporteRespectoAlSaldo(importe, datosDeSaldo) {

    let gastoConvertido = parseFloat(importe);
    let saldoConvertido = parseFloat(datosDeSaldo.datos.IMPORTE[0]);
    
    if (gastoConvertido > saldoConvertido) {
        throw new ValidacionError('servidor', { codigosDeError: 'gastoSuperiorAlSueldo' });
    }
}