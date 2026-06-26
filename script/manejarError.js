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
    							fechaInvalida: 'La fecha es inválida'
  	};

	constructor(idInputFormularion, codigoDeError) {

  		let parrafoDeError = document.getElementById('cajaMensaje');

    	let mensajeDeError = ValidacionError.MENSAJE_DE_ERROR[codigoDeError] || "Error desconocido";

    	super(mensaje);

    	this.name = "ValidacionError";

    	this.campo = campo;

  	}

}//fin class ValidacionError