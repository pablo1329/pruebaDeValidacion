class ValidacionError extends Error {

	static MENSAJE_DE_ERROR = {	propiedadObligatoriaVacia: 'el valor de la propiedad está vacío',
    							caracteresInvalidos: 'contiene caractéres invalidos',
    							valorNumericoEnteroInvalido: 'El valor almacenado en la propiedad no es un valor numérico entero valido',
    							valorNumericoDecimalInvalido: 'El valor almacenado en la propiedad no es un valor numérico decimal valido',
    							valorBooleanoInvalido: 'debe ser un valor booleano (true/false o 1/0)',
    							longitudMinima: 'tiene una cantidad de caractéres inferior a la permitida',
    							longitudMaxima: 'tiene una cantidad de caractéres superior a la permitida',
    							valorAbsolutoInferior: 'tiene un valor absoluto inferior al permitido',
    							valorAbsolutoSuperior: 'tiene un valor absoluto superior al permitido',
    							errorAlIniciarSesion: 'El usuario y/o la clave son incorrectos',
    							fechaInvalida: 'La fecha es inválida',
                                datosDuplicados: 'Los datos que se intentan guardar, ya estan almacenados en la base de datos'
  	};

  	static IDS_DE_PARRAFOS_RELACIONADOS_A_INPUTS = { inputFecha: 'mensajeInputFecha',
  													 inputOrigenDeIngreso: 'mensajeInputOrigenDeIngreso',
  													 inputCategoriaDeGasto: 'mensajeInputCategoriaDeGasto',
  													 inputDetalleDelGasto: 'mensajeInputDetalleDelGasto',
  													 inputImporte: 'mensajeInputImporte'};

	constructor(tipoDeError, objetoError) {
		//objetoError{	propiedades:[],
		//	codigosDeError:[] }
		super(tipoDeError);
		this.tipoDeError = tipoDeError;
		this.objetoError = objetoError;
		this.idsDeParrafosRelacionadosAInputs = [];
		this.erroresPorCodigoDeError = [];
    	//let mensajeDeError = ValidacionError.MENSAJE_DE_ERROR[codigoDeError] || "Error desconocido";
    	//super(mensajeDeError);
    	this.gestionar();

  	}


  	// Método que gestiona el comportamiento según el origen
    gestionar() {
        if (this.tipoDeError === 'inputFormulario') {
        	this.devolverIdsDeParrafosRelacionadosAInputs();
        	this.almacenarErroresPorCodigoDeError();
            imprimirErroresEnFormulario(this.idsDeParrafosRelacionadosAInputs, this.erroresPorCodigoDeError);
        } else if (this.tipoDeError === 'servidor') {
            //let objetoError = { codigosDeError:'datosDuplicados' };
            imprimirMensajeDeErrorDelServidor(this.objetoError, ValidacionError.MENSAJE_DE_ERROR[this.objetoError.codigosDeError]);
        }
    }

    almacenarErroresPorCodigoDeError(){
    	this.objetoError.codigosDeError.forEach(elemento => this.erroresPorCodigoDeError.push(ValidacionError.MENSAJE_DE_ERROR[elemento]));
    }//FIN almacenarErroresPorCodigoDeError

    devolverIdsDeParrafosRelacionadosAInputs(){
    	this.objetoError.propiedades.forEach(elemento => this.idsDeParrafosRelacionadosAInputs.push(ValidacionError.IDS_DE_PARRAFOS_RELACIONADOS_A_INPUTS[elemento]));
    }//FIN devolverIdsDeParrafosRelacionadosAInputs

}//fin class ValidacionError