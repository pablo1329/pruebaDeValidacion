const url = 'php/index.php';

function devolverConfiguracionDeEnvio(metodo, solicitud='') {
    let headers = { 'Accept': 'application/json' };
    
    if (metodo !== 'GET') {
        headers['Content-Type'] = 'application/json';
    }

    let configuracion = {
        method: metodo,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: headers
    };

    if (solicitud) {
        configuracion.body = JSON.stringify(obtenerDatosDeFormularioPorSolicitud(solicitud));
        configuracion.redirect = 'follow';
        configuracion.referrerPolicy = 'no-referrer';
    }
    //console.log(configuracion);
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
    //console.error("Detalle del error del servidor:", mensajeError); // Verás el error real aquí
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


function guardarDatos(solicitud) {
  // Pasamos los datos directamente aquí
  let configuracion = devolverConfiguracionDeEnvio('POST', solicitud);
  return enviarDatos(url, configuracion);
}





