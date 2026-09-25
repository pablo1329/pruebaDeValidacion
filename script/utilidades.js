function almacenarFechaActualEnFormulario(){

            const inputFecha = document.getElementById('inputFecha');
            // 1. Obtenemos la fecha actual del sistema
            const fechaActual = new Date();
            // 2. Extraemos año, mes y día asegurando el formato correcto (YYYY-MM-DD)
            const anio = fechaActual.getFullYear();
            // getMonth() devuelve de 0 a 11, por lo que sumamos 1 y rellenamos con '0' a la izquierda si es necesario
            const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
            const dia = String(fechaActual.getDate()).padStart(2, '0');
            // 3. Unimos los valores en el formato requerido por el input type="date"
            const fechaFormateada = `${anio}-${mes}-${dia}`;
            inputFecha.value = fechaFormateada;

}//fin function almacenarFechaActualEnFormulario


function devolverFechaFormateada(solicitud, datosDeFormulario){
    let fechaDescompuestaEnDiaMesAnio = devolverFechaEnMesDiaAnio(datosDeFormulario.inputFecha);

    delete datosDeFormulario.inputFecha;

    datosDeFormulario.mes = fechaDescompuestaEnDiaMesAnio.mes;
    datosDeFormulario.año = fechaDescompuestaEnDiaMesAnio.anio;
    datosDeFormulario.dia = fechaDescompuestaEnDiaMesAnio.dia;

    return datosDeFormulario;
}

function devolverFechaEnMesDiaAnio(fechaString) {
    const arrayFecha = fechaString.split('-').map(Number);

    return {
        anio: arrayFecha[0],
        mes: arrayFecha[1],
        dia: arrayFecha[2]
    };
}


function devolverFechaCompleta(dia, mes, año) {
    const diaFormateado = String(dia).padStart(2, '0');
    const mesFormateado = String(mes).padStart(2, '0');
    return `${diaFormateado}/${mesFormateado}/${año}`;
}

function devolverFechaMasReciente(datos){
    let cantidadDeDatos = datos.AÑO.length;
    let matrizDeFechas = [];

    for (let i = 0; i < cantidadDeDatos; i++) {
        matrizDeFechas.push(new Date(`${datos.AÑO[i]}/${datos.MES[i]}/${datos.DIA[i]}`).getTime());
    }

    let maxTimestamp = matrizDeFechas[0];
    let indiceDeFechaMasReciente = 0;
    cantidadDeDatos =  matrizDeFechas.length;
    for (let i = 1; i < cantidadDeDatos; i++) {
        const timestampActual = matrizDeFechas[i];
        if (timestampActual > maxTimestamp) {
            maxTimestamp = timestampActual;
            indiceDeFechaMasReciente = i;
        }
    }

    return {
        dia: datos.DIA[indiceDeFechaMasReciente],
        mes: datos.MES[indiceDeFechaMasReciente],
        año: datos.AÑO[indiceDeFechaMasReciente]
    };
}


function llenarSelect(selectId, valor, nombres) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Vaciamos el select antes de insertar los nuevos options para evitar duplicados
    select.innerHTML = '';
    
    for (let i = 0; i < valor.length; i++) {
        const option = document.createElement('option');
        option.value = valor[i];
        option.textContent = nombres[i];
        select.appendChild(option);
    }
}

function cargarSaldos(datos) {
    let idSaldo = [];
    let origenSaldo = [];
    let cantidadDeDatos = datos.length;
    for (let i = 0; i < cantidadDeDatos; i++) {

        if(datos[i].cantidadDeResultados > 0){
            idSaldo.push(datos[i].datos.ID_SALDO[0]);
            origenSaldo.push(datos[i].datos.ORIGEN[0]); 
        } else {
            continue;
        }
        
    }
 
    llenarSelect('inputSaldo', idSaldo, origenSaldo);
    
}//fin function cargarSaldos

async function almacenarDatos(){
    const obtenerTodosLosOrigenesDeIngreso = {'seccion': 'buscarTodosLosOrigenesDeIngreso'};
    let origenesDeIngreso = await solicitarDatosConParametros(obtenerTodosLosOrigenesDeIngreso);
    origenesDeIngreso = JSON.parse(origenesDeIngreso);
    llenarSelect('inputOrigenDeIngreso', origenesDeIngreso.datos.ID_ORIGEN, origenesDeIngreso.datos.ORIGEN);
    
    const obtenerTodasLasCategoriasDeGastos = {'seccion': 'buscarTodasLasCategoriasDeGastos'};
    let categoriasDeGastos = await solicitarDatosConParametros(obtenerTodasLasCategoriasDeGastos);
    categoriasDeGastos = JSON.parse(categoriasDeGastos);
    llenarSelect('inputCategoriaDeGasto', categoriasDeGastos.datos.ID_CATEGORIA_GASTO, categoriasDeGastos.datos.CATEGORIA);

    const datosDeTodosLosSaldos = await buscarDatosDeTodosLosSaldos();
    cargarSaldos(datosDeTodosLosSaldos);
}

function crearElemento(nombreDeElemento, id = null, clases = null, valor = null, contenidoDeTexto = null){
    let elemento = document.createElement(nombreDeElemento);

    if(id != null){
        elemento.setAttribute('id', id);
    }

    if(clases != null){
       elemento.setAttribute('class', clases); 
    }

    if(valor != null){
        elemento.setAttribute('value', valor);
    }

    if(contenidoDeTexto != null){
        elemento.textContent = contenidoDeTexto;
    }

    return elemento;
}

function agregarOptionPorNombreDeBotonDeFormulario(nombreDeBoton){
    const gestionarOption = (idElemento, idSelect, debeExistir, crearOpciones) => {
        let elemento = document.getElementById(idElemento);

        if (debeExistir && !elemento) {
            let selectPadre = document.getElementById(idSelect);
            if (selectPadre) {
                elemento = crearOpciones();
                selectPadre.append(elemento);
            }
        } else if (!debeExistir && elemento) {
            elemento.remove();
        }
    };
    
    gestionarOption(
        'optionCualquierOrigen',
        'inputOrigenDeIngreso',
        nombreDeBoton === 'buscarIngresoPorMesAñoOrigenDeIngreso',
        () => crearElemento('option', 'optionCualquierOrigen', null, '0', 'Cualquier origen')
    );

    gestionarOption(
        'optionTodosLosGastos',
        'inputCategoriaDeGasto',
        nombreDeBoton === 'buscarGastosPorAñoMesSaldoCategoriaDeGasto',
        () => crearElemento('option', 'optionTodosLosGastos', null, '0', 'Todos los gastos')
    );
}


function formatearNumero(numero) {
    const num = parseFloat(numero);

    if (isNaN(num)) return "0,00";

    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

function sumarNumerosEnMatriz(matriz){
    return matriz.reduce((acumulador, valorActual) => {
        return acumulador + parseFloat(valorActual);
    }, 0);
}

function asignarSeccionPorDatos(solicitud, datosDeFormulario){
    if(solicitud === 'buscarGastos'){
        let seccionRedefinida = 'buscarGastoPorAñoMes';

        if(datosDeFormulario.inputOrigenDeIngreso !== undefined){
            seccionRedefinida = seccionRedefinida + 'OrigenDeIngreso';
        }

        if(datosDeFormulario.inputCategoriaDeGasto !== undefined) {
            seccionRedefinida = seccionRedefinida + 'Categoria'; 
        }

        datosDeFormulario.seccion = seccionRedefinida;
    }

    return datosDeFormulario;
}


function devolverPromedioDeMatriz(matrizDeDatos){
    const cantidadDeDatos = matrizDeDatos.length;
    const initialValue = 0;
    const sumaDeArray = matrizDeDatos.reduce(
        (accumulator, currentValue) => parseFloat(accumulator) + parseFloat(currentValue), initialValue,);

            let promedio = sumaDeArray/cantidadDeDatos;
            promedio = Number(promedio.toFixed(2));
            return promedio;

}//fin function devolverPromedio

function almacenarDatosDeIngresosYSaldos(cantidadDeDatos, origenIngreso, ingresos, saldo) {
    let datos = { origenDeIngresos: [], ingresosActuales: [], saldosActuales: [] };
    for (let i = 0; i < cantidadDeDatos; i++) {
        datos.origenDeIngresos.push(origenIngreso[i]);
        datos.ingresosActuales.push(ingresos[i]);
        if(saldo[i].cantidadDeResultados > 0){
            datos.saldosActuales.push(saldo[i].datos.IMPORTE[0]);
        } else {
            datos.saldosActuales.push(0.00);
        }

    }

    return datos;
    
}//fin function almacenarDatosDeIngresosYSaldos


function obtenerDatosDeFormularioPorSolicitud(solicitud) {
    let seccion = document.getElementById('botonForm').name;
    let idsDeInputsDeFormulario = obtenerIdsDeInputsDeFormularioPorSolicitud(seccion);
    let datosDeFormulario = almacenarDatosPorId(idsDeInputsDeFormulario);
    datosDeFormulario = validarDatos(datosDeFormulario);
    datosDeFormulario = devolverFechaFormateada(solicitud, datosDeFormulario);
    return datosDeFormulario;  
}


function almacenarDatosPorId(idsDeInputsDeFormulario) {
    let datosDeFormulario = {};
    idsDeInputsDeFormulario.forEach((id) => {
        const inputElement = document.getElementById(id);
        datosDeFormulario[id] = inputElement ? inputElement.value : null;
    });
    return datosDeFormulario;
}

function obtenerIdsDeInputsDeFormularioPorSolicitud(solicitud) {
    return CONFIGURACION_FORMULARIOS[solicitud] || [];
}