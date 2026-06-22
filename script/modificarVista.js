function obtenerConfiguracionDeFormulario(idDeLista){

	let configuracion = {	cajasAMostrar:[],
							legendForm: '',
							nameBotonForm: '',
						    contenidoDeTextoDeBotonForm: '',
							iconoBotonForm: ''};

	switch(idDeLista){

		case'itemGuardarIngreso':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaImporte', 'cajaOrigen'];
			configuracion.legendForm = 'Guardar Ingreso';
			configuracion.nameBotonForm = 'guardarIngreso';
			configuracion.contenidoDeTextoDeBotonForm = 'Guardar';
			configuracion.iconoBotonForm = 'iconoGuardar';
		break;
		case'itemGuardarGasto':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaCategoriaGasto', 'cajaOrigen', 'cajaImporte', 'cajaDetalleDeGasto'];
			configuracion.legendForm = 'Guardar Gasto';
			configuracion.nameBotonForm = 'guardarGasto';
			configuracion.contenidoDeTextoDeBotonForm = 'Guardar';
			configuracion.iconoBotonForm = 'iconoGuardar';
		break;
		case'itemBuscarIngreso':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaOrigen'];
			configuracion.legendForm = 'Buscar Ingreso';
			configuracion.nameBotonForm = 'buscarIngreso';
			configuracion.contenidoDeTextoDeBotonForm = 'Buscar';
			configuracion.iconoBotonForm = 'iconoBuscar';
		break;
		case'itemBuscarGastos':
			configuracion.cajasAMostrar = ['cajaFecha', 'cajaCategoriaGasto', 'cajaOrigen', 'cajaImporte', 'cajaDetalleDeGasto'];
			configuracion.legendForm = 'Buscar Gastos';
			configuracion.nameBotonForm = 'buscarGastos';
			configuracion.contenidoDeTextoDeBotonForm = 'Buscar';
			configuracion.iconoBotonForm = 'iconoBuscar';
		break;

	}//fin switch

	return configuracion;

}//fin function obtenerConfiguracionDeFormulario


function mostrarCamposDeFormulario(configuracion){

	const todosLosCamposDeFormulario = ['cajaFecha', 'cajaOrigen', 'cajaCategoriaGasto', 'cajaDetalleDeGasto', 'cajaImporte'];

	let campoDeFormularioIncluido = false;

	todosLosCamposDeFormulario.forEach((element) => {

		campoDeFormularioIncluido = configuracion.cajasAMostrar.includes(element);

		if(campoDeFormularioIncluido){
			document.getElementById(element).classList.remove('d-none');
		} else {
			document.getElementById(element).classList.add('d-none');
		}

	});

}//fin function mostrarCamposDeFormulario


function mostrarIconoDeBotonDeFormulario(configuracion){

	const todosLosIconosDeBotonDeFormulario = ['iconoGuardar', 'iconoBuscar', 'iconoModificar'];

	todosLosIconosDeBotonDeFormulario.forEach((element) => {
		
		if(element === configuracion.iconoBotonForm){
			document.getElementById(element).classList.remove('d-none');
		} else {
			document.getElementById(element).classList.add('d-none');
		}
		
	});

}//fin function mostrarIconoDeBotonDeFormulario


function administrarVistaDeFormularioPorId(idDeLista){
	
	let configuracion = obtenerConfiguracionDeFormulario(idDeLista);

	mostrarCamposDeFormulario(configuracion);

	document.getElementById('legendForm').textContent = configuracion.legendForm;
	document.getElementById('botonForm').setAttribute('name', configuracion.nameBotonForm);
	document.getElementById('nombreDeBoton').textContent = configuracion.contenidoDeTextoDeBotonForm;

	mostrarIconoDeBotonDeFormulario(configuracion);

}//fin function mostrarCamposDeFormularioPorId