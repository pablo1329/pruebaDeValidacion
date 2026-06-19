const url = 'php/index.php';

function devolverConfiguracionDeEnvio(metodo) {

  let configuracion = {};

  if(metodo === 'GET'){
    configuracion = { method: metodo, // *GET, POST, PUT, DELETE, etc.
                      mode: 'cors', // no-cors, *cors, same-origin
                      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                      credentials: 'same-origin', // include, *same-origin, omit
                      headers: { 'Accept': 'application/json'}
    };
  } else {
    configuracion = { method: metodo, // *POST, PUT, DELETE, etc.
                      mode: 'cors', // no-cors, *cors, same-origin
                      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                      credentials: 'same-origin', // include, *same-origin, omit
                      headers: { 'Content-Type': 'application/json', /* 'Content-Type': 'application/x-www-form-urlencoded',*/
                                 'Accept': 'application/json'
                      },
                      redirect: 'follow', /* manual, *follow, error*/
                      referrerPolicy: 'no-referrer', /* no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url*/
                      body: '' /* body data type must match "Content-Type" header */
    }
  }

  return configuracion;
  
}//fin function devolverConfiguracionDeEnvio

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
    console.error("Detalle del error del servidor:", mensajeError); // Verás el error real aquí
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





