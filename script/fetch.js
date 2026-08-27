const url = 'php/index.php';


function devolverConfiguracionDeEnvio(metodo, datosDeFormulario='') {
    let headers = { 'Accept': 'application/json' };
    
    let configuracion = {
        method: metodo,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: headers
    };

    if (metodo !== 'GET') {
      headers['Content-Type'] = 'application/json';
      configuracion.body = JSON.stringify(datosDeFormulario);
      configuracion.redirect = 'follow';
      configuracion.referrerPolicy = 'no-referrer';
    }

    return configuracion;
}


function devolverURLConParametros(datos){

  const parametros = new URLSearchParams(datos);

  return `${url}?${parametros.toString()}`;

}//fin function devolverURLConParametros


// Ejemplo implementando el metodo POST:
async function enviarDatos(url = '', configuracion) {
  // Opciones por defecto estan marcadas con un *
  const respuesta = await fetch(url, configuracion);
  //console.log(respuesta);
  if(!respuesta.ok){
    // Aquí es donde está el cambio: debes esperar al texto
    const mensajeError = await respuesta.text();
    console.error("Detalle del error del servidor:", mensajeError);
    throw new Error(mensajeError);
  }

  const resultado = await respuesta.text();

  return resultado

}//fin async function enviarDatos


function solicitarDatosSinParametros(){

  let configuracion = devolverConfiguracionDeEnvio('GET');

  return enviarDatos(url, configuracion);
  
}


function solicitarDatosConParametros(datos){

  let configuracion = devolverConfiguracionDeEnvio('GET');

  const nuevaURL = devolverURLConParametros(datos);
 
  return enviarDatos(nuevaURL, configuracion);
  
}//fin function solicitarDatosConParametros


async function buscarIngresoDuplicado(datosDeFormulario){

  //Almacenamos la seccion.
  datosDeFormulario.seccion = 'buscarIngresoDuplicado';

  const resultado = await solicitarDatosConParametros(datosDeFormulario);

  return resultado;

}//fin function buscarIngresoDuplicado


function actualizarInformacionDeIngresoPorOrigen(){

  //Almacenamos los datos del formulario (inputFecha, inputImporte).
  let datosDeFormulario = obtenerDatosDeFormularioPorSolicitud('obtenerUltimoIngresoPorOrigenDeIngreso');

  //Almacenamos la seccion.
  datosDeFormulario.seccion = 'obtenerUltimoIngresoPorOrigenDeIngreso';

  return solicitarDatosConParametros(datosDeFormulario);
}


async function guardarDatos(datosDeFormulario) {
  //Pasamos los datos directamente aquí
  let configuracion = devolverConfiguracionDeEnvio('POST', datosDeFormulario);
  const respuesta = await enviarDatos(url, configuracion);
  return respuesta;
}


async function obtenerDatosDeTodosLosIngresos(){

  const origenIngreso = [
    { id: 1, origen: 'origenIngresoDeCarol' },
    { id: 2, origen: 'origenIngresoDePablo' },
    { id: 3, origen: 'origenIngresoDeAlquiler' }
  ];

  // Creamos un arreglo de promesas mapeando cada elemento
  const promesas = origenIngreso.map(async (origen) => {
    // 1. Solicitamos los datos esperando la respuesta
    const resultado = await solicitarDatosConParametros({
      'seccion': 'obtenerUltimoIngresoPorOrigenDeIngreso',
      'inputOrigenDeIngreso': origen.id
    });

    // 2. Parseamos el resultado JSON
    let objetoDeDatos = JSON.parse(resultado);

    // 3. Retornamos el dato que necesitamos
    return objetoDeDatos.datos;
  });

  // Esperamos a que todas las peticiones en paralelo terminen
  return await Promise.all(promesas);

}//fin function obtenerDatosDeTodosLosIngresos


async function obtenerDatosDeTodosLosSaldos(datosDeSaldo){
    
  // Creamos un arreglo de promesas mapeando cada elemento
  const promesas = datosDeSaldo.id.map(async (idSaldo) => {
    // 1. Solicitamos los datos esperando la respuesta
    const resultado = await solicitarDatosConParametros({ 'seccion': 'obtenerUltimoSaldoPorOrigenDeIngreso',
                                                          'inputOrigenDeIngreso': idSaldo });

    // 2. Parseamos el resultado JSON
    let objetoDeDatos = JSON.parse(resultado);

    // 3. Retornamos el dato que necesitamos
    return objetoDeDatos;
  });

  // Esperamos a que todas las peticiones en paralelo terminen
  return await Promise.all(promesas);

}//fin function obtenerDatosDeTodosLosSaldos


async function modificarDatos(datos){
  let configuracion = devolverConfiguracionDeEnvio('PATCH', datos);
  const respuesta = await enviarDatos(url, configuracion);
  return respuesta;
}//fin function modificarDatos


async function eliminarDatos(datos){
  let configuracion = devolverConfiguracionDeEnvio('DELETE', datos);
  const respuesta = await enviarDatos(url, configuracion);
  return respuesta;
}//fin async function eliminarDatos


async function buscarDatos(datos){

  let json =  await solicitarDatosConParametros(datos);

  return JSON.parse(json);

}//fin function buscarDatos