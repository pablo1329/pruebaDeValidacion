function devolverFechaFormateada(solicitud, datosDeFormulario){

    //Almacenamos un objeto que contiene el primer y ultimo día de una fecha pasada como argumento.
    let fechaDescompuestaEnDiaMesAnio = devolverFechaEnMesDiaAnio(datosDeFormulario.inputFecha);

    //Eliminamos la fecha ingresada, por que no será necesaria para la consulte.
    delete datosDeFormulario.inputFecha;

    datosDeFormulario.mes = fechaDescompuestaEnDiaMesAnio.mes;

    datosDeFormulario.año = fechaDescompuestaEnDiaMesAnio.anio;

    //if(solicitud === 'itemGuardarIngreso' || solicitud === 'itemGuardarGasto'){
    datosDeFormulario.dia = fechaDescompuestaEnDiaMesAnio.dia;
    //}

    return datosDeFormulario;

}//fin function devolverFechaFormateada

function llenarSelect(selectId, valor, nombres) {
    const select = document.getElementById(selectId);
    
    // Limpiamos el select por si ya tenía opciones previas
    //select.innerHTML = '<option value="">Seleccione una opción</option>';

    // Recorremos los arrays
    for (let i = 0; i < valor.length; i++) {
        // Creamos un elemento option
        const option = document.createElement('option');
        
        // Asignamos el value y el texto
        option.value = valor[i];
        option.textContent = nombres[i];
        
        // Añadimos la opción al select
        select.appendChild(option);
    }
}

async function cargarSaldos(datos) {

    let idSaldo = [];
    let origenSaldo = [];

    // 2. Recorremos los datos obtenidos para llenar el select
    let cantidadDeDatos = datos.length;
    
    for (let i = 0; i < cantidadDeDatos; i++) {
        idSaldo.push(datos[i].datos.ID_SALDO[0]);
        origenSaldo.push(datos[i].datos.ORIGEN[0]);
    }
    console.log(idSaldo);
    console.log(origenSaldo);
    llenarSelect('inputSaldo', idSaldo, origenSaldo);

}//fin function cargarSaldos


async function almacenarDatos(){

    const obtenerTodosLosOrigenesDeIngreso = {'seccion':'obtenerTodosLosOrigenesDeIngreso'};
    let origenesDeIngreso = await solicitarDatosConParametros(obtenerTodosLosOrigenesDeIngreso);
    origenesDeIngreso = JSON.parse(origenesDeIngreso);
    llenarSelect('inputOrigenDeIngreso', origenesDeIngreso.datos.ID_ORIGEN, origenesDeIngreso.datos.ORIGEN);
    
    const obtenerTodasLasCategoriasDeGastos = {'seccion':'obtenerTodasLasCategoriasDeGastos'};
    let categoriasDeGastos = await solicitarDatosConParametros(obtenerTodasLasCategoriasDeGastos);
    categoriasDeGastos = JSON.parse(categoriasDeGastos);
    llenarSelect('inputCategoriaDeGasto', categoriasDeGastos.datos.ID_CATEGORIA_GASTO, categoriasDeGastos.datos.CATEGORIA);

    // 1. Esperamos a que la función termine y nos devuelva todos los datos
    datosDeSaldo = {id: [1, 2, 3],
                    saldo: ['Carol', 'Pablo', 'Alquiler'] }
    // 1. Creamos un array de promesas, una por cada origen
    const datosDeTodosLosSaldos = await obtenerDatosDeTodosLosSaldos(datosDeSaldo);
    cargarSaldos(datosDeTodosLosSaldos);
}//fin async function almacenarDatos


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

}//fin function crearElemento


function agregarOptionPorNombreDeBotonDeFormulario(nombreDeBoton){
    
    // Función auxiliar para manejar la creación o eliminación de forma limpia
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

    // 1. Gestionar 'optionCualquierOrigen' para 'buscarIngreso'
    gestionarOption(
        'optionCualquierOrigen',
        'inputOrigenDeIngreso',
        nombreDeBoton === 'buscarIngreso',
        () => crearElemento('option', 'optionCualquierOrigen', null, '0', 'Cualquier origen')
    );

    // 2. Gestionar 'optionTodosLosGastos' para 'buscarGastos'
    gestionarOption(
        'optionTodosLosGastos',
        'inputCategoriaDeGasto',
        nombreDeBoton === 'buscarGastos',
        () => crearElemento('option', 'optionTodosLosGastos', null, '0', 'Todos los gastos')
    );

}//fin function agregarOptionPorNombreDeBotonDeFormulario


function devolverFechaEnMesDiaAnio(fechaString) {
    
    const arrayFecha = fechaString.split('-').map(Number);

    const objetoFecha = {anio: arrayFecha[0],
                         mes: arrayFecha[1],
                         dia:  arrayFecha[2]
    };

    return objetoFecha;

}//fin function devolverFechaEnMesDiaAnio


function formatearNumero(numero) {
    // Aseguramos que sea un número flotante
    const num = parseFloat(numero);

    // Si no es un número válido, retornamos una cadena vacía o manejo de error
    if (isNaN(num)) return "0,00";

    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}//fin function formatearNumero


function sumarNumerosEnMatriz(matriz){

    let sumaTotal = matriz.reduce((acumulador, valorActual) => {
        return acumulador + parseFloat(valorActual);
    }, 0);

    return sumaTotal;

}//fin function sumarNumerosEnMatriz


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

}//fin function asignarSeccionPorDatos


function suprimirDatosInecesarios(solicitud, datosDeFormulario){

    if(solicitud === 'buscarGastos'){

        //let objeto = { edad: 25, deuda: 0, ahorros: 100, hijos: 0 };

        for (const [clave, valor] of Object.entries(datosDeFormulario)) {
            if (valor == 0) {
                console.log(`La clave '${clave}' tiene un valor de 0`);
                delete datosDeFormulario[clave];
            }
        }
        datosDeFormulario = asignarSeccionPorDatos(solicitud, datosDeFormulario);
    }

    return datosDeFormulario;

}//fin function suprimirDatosInecesarios


function devolverFechaCompleta(dia, mes, año) {

    // Formateamos día y mes para que tengan dos dígitos (ej. 3 -> 03)
    const diaFormateado = String(dia).padStart(2, '0');
    const mesFormateado = String(mes).padStart(2, '0');
    const fechaFormateada = `${diaFormateado}/${mesFormateado}/${año}`;

    return fechaFormateada;

}//fin function devolverFechaCompleta


function devolverFechaMasReciente(datos){
    
    let cantidadDeDatos = datos.AÑO.length;
    
    let matrizDeFechas = [];

    for (let i = 0; i < cantidadDeDatos; i++) {
        matrizDeFechas.push(new Date(`${datos.AÑO[i]}/${datos.MES[i]}/${datos.DIA[i]}`).getTime());
    }

    // Buscamos la fecha con el timestamp más alto
    let maxTimestamp = matrizDeFechas[0];
    let indiceDeFechaMasReciente = 0;
    for (let i = 1; i < matrizDeFechas.length; i++) {
        const timestampActual = matrizDeFechas[i];
        if (timestampActual > maxTimestamp) {
            maxTimestamp = timestampActual;
            indiceDeFechaMasReciente = i;
        }
    }

    let fechaMasReciente = {};
    
    fechaMasReciente.dia = datos.DIA[indiceDeFechaMasReciente];
    fechaMasReciente.mes = datos.MES[indiceDeFechaMasReciente];
    fechaMasReciente.año = datos.AÑO[indiceDeFechaMasReciente];

    return fechaMasReciente;

}//fin function devolverFechaMasReciente