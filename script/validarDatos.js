const RESTRICCIONES = {	inputFecha:{obligatorio: true,
						           							longitudMinima: 8,
						           							longitudMaxima: 15,
						           							caracteresPermitidos: '/^[0-9-]+$/',
						           							tipoDeDatoAValidar: 'date',
						          							valorAbsolutoMinimo: 0,
						         								valorAbsolutoMaximo: 0},

												inputImporte:{obligatorio: true,
						           	  						longitudMinima: 1,
						           	  						longitudMaxima: 15,
						           	  						caracteresPermitidos: '/^\d+(\.\d+)?$/',
						           	  						tipoDeDatoAValidar: 'float',
						          	  						valorAbsolutoMinimo: 0.00,
						         	  							valorAbsolutoMaximo: 999999999.99},

												inputOrigenDeIngreso:{obligatorio: true,
						           	 		  								longitudMinima: 1,
						           	 		  								longitudMaxima: 11,
						           	 		  								caracteresPermitidos: '/^[0-9]+$/',
						           	 		  								tipoDeDatoAValidar: 'int',
						          			  								valorAbsolutoMinimo: 1,
						         		 	  									valorAbsolutoMaximo: 9}

}//FIN RESTRICCIONES


const PARRAFOS_POR_INPUTS = {'inputFecha': 'mensajeInputFecha',
							 							 'inputOrigenDeIngreso': 'mensajeInputOrigenDeIngreso',
							 							 'inputCategoriaDeGasto': 'mensajeInputCategoriaDeGasto',
							 							 'inputDetalleDelGasto': 'mensajeInputDetalleDelGasto',
							 							 'inputImporte': 'mensajeInputImporte'};


function validarValoresVacios(valor) {

	let disparador = false;

  	if (valor === null || 
  		valor === undefined || 
  		valor === "" || 
  		valor === " " || 
  		Number.isNaN(valor) ) {

   		disparador = true;
	}

  return disparador;

}//fin function validarValoresVacios


function validarLongitudDeCadena(campo, cadena, longitudMinima, longitudMaxima) {

	if(cadena.length < longitudMinima || 
  	 cadena.length > longitudMaxima) {
  	//Si la cantidad de caracteres de la cadena es superior al minimo o superior al maximo pre-establecido, se lanza un error.
    throw new ValidacionError(`El campo "${campo}" debe tener entre ${min} y ${max} caracteres.`, campo);
  }

}//fin function validarLongitudDeCadena


function validarCaracteresPermitidosEnCadena(campo, cadena){

	if(!RESTRICCIONES[campo].caracteresPermitidos.test(cadena)) {
  	//Si la cadena contiene caracteres no permitidos, se lanza una excepción.
    throw new ValidacionError(`El campo "${campo}" contiene caracteres no permitidos.`, campo);
  }

}//fin function validarCaracteresPermitidosEnCadena


function validarString(valor, campo) {

	//Almacenamos la cadena recibída, eliminando los espacios en blanco al principio de la cadena.
  const cadenaSinEspacios = valor.trim();

  //Verificamos si la cantidad de caracteres de la cadena, no excede los limites minimos y maximos.
  validarLongitudDeCadena(campo, cadenaSinEspacios, RESTRICCIONES[campo].longitudMinima, RESTRICCIONES[campo].longitudMaxima);

  //Se verifica si la cadena recibída, contiene caracteres no permitidos para lamisma.
  validarCaracteresPermitidosEnCadena(campo, cadenaSinEspacios);

  return cadenaSinEspacios;

}//fin function validarString


function validarLimitesAbsolutosDeNumero(campo, numero, limiteMinimo, limiteMaximo){

	if(numero < limiteMinimo || 
  	 numero > limiteMaximo) {
    throw new ValidacionError(`El campo "${campo}" debe estar entre ${min} y ${max}.`, campo);
  }

}//fin function validarLimitesAbsolutosDeNumero


function validarNumeroEntero(valor, campo) {

  const numero = Number(valor);

  if (!Number.isInteger(numero)) {
    throw new ValidacionError(`El campo "${campo}" debe ser un número entero.`, campo);
  }

  validarLimitesAbsolutosDeNumero(campo, numero, RESTRICCIONES[campo].valorAbsolutoMinimo, RESTRICCIONES[campo].valorAbsolutoMaximo);

  return valor;

}//fin function validarEntero


function validarDatos(datosDeFormulario) {
	
	let almacenarError = {	propiedades:[],
													codigosDeError:[] };

	for (const [propiedad, valor] of Object.entries(datosDeFormulario)) {
    
    restriccionPorInput = RESTRICCIONES[`${propiedad}`];
    
    verificarValorVacio = validarValoresVacios(`${valor}`);
    
    if (verificarValorVacio) {
        // Asumiendo que verificarValorVacio es el objeto de restricción o tiene esa propiedad
        if (restriccionPorInput.obligatorio) {
        	almacenarError.propiedades.push(`${propiedad}`);
        	almacenarError.codigosDeError.push('propiedadObligatoriaVacia');
        } else {
          continue; // Ahora sí funcionará perfectamente
        }
    }
	}

	if(almacenarError.propiedades.length > 0){
		throw new ValidacionError('inputFormulario', almacenarError);
	}
  
	return datosDeFormulario;

}//fin function validarDatos

function validarDatosDuplicados(respuesta){
	
	if (respuesta.cantidadDeResultados > 0) {
    // Al lanzar el error, el flujo se interrumpe y salta directamente al .catch
    throw new ValidacionError('servidor', { codigosDeError: 'datosDuplicados' });
  }
}//fin function validarDatosDuplicados