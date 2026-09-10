const url = 'php/index.php';

function devolverConfiguracionDeEnvio(metodo, datosDeFormulario = '') {
    let headers = { 'Accept': 'application/json' };
    
    let configuracion = {
        method: metodo,
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers
    };

    if (metodo !== 'GET') {
        headers['Content-Type'] = 'application/json';
        configuracion.body = JSON.stringify(datosDeFormulario);
        configuracion.redirect = 'follow';
        configuracion.referrerPolicy = 'no-referrer';
    }

    return configuracion;
}

function devolverURLConParametros(datos) {
    const parametros = new URLSearchParams(datos);
    return `${url}?${parametros.toString()}`;
}

async function enviarDatos(url = '', configuracion) {
    const respuesta = await fetch(url, configuracion);
    
    if (!respuesta.ok) {
        const mensajeError = await respuesta.text();
        console.error("Detalle del error del servidor:", mensajeError);
        throw new Error(mensajeError);
    }

    return await respuesta.text();
}

function solicitarDatosSinParametros() {
    let configuracion = devolverConfiguracionDeEnvio('GET');
    return enviarDatos(url, configuracion);
}

function solicitarDatosConParametros(datos) {
    let configuracion = devolverConfiguracionDeEnvio('GET');
    const nuevaURL = devolverURLConParametros(datos);
    return enviarDatos(nuevaURL, configuracion);
}

async function guardarDatos(datosDeFormulario) {
    let configuracion = devolverConfiguracionDeEnvio('POST', datosDeFormulario);
    return await enviarDatos(url, configuracion);
}

async function buscarDatosDeTodosLosSaldos() {
    const todosLosOrigenesDeIngreso = { 'seccion': 'buscarTodosLosOrigenesDeIngreso' };
    const datosDeTodosLosOrigenesDeIngreso = await buscarDatos(todosLosOrigenesDeIngreso);

    const promesas = datosDeTodosLosOrigenesDeIngreso.datos.ID_ORIGEN.map(idOrigen =>
        buscarDatos({
            seccion: 'buscarUltimoSaldoPorOrigenDeIngreso',
            inputOrigenDeIngreso: idOrigen
        })
    );

    return await Promise.all(promesas);
}

async function modificarDatos(datos) {
    let configuracion = devolverConfiguracionDeEnvio('PATCH', datos);
    return await enviarDatos(url, configuracion);
}

async function eliminarDatos(datos) {
    let configuracion = devolverConfiguracionDeEnvio('DELETE', datos);
    return await enviarDatos(url, configuracion);
}

async function buscarDatos(datos) {
    let json = await solicitarDatosConParametros(datos);
    return JSON.parse(json);
}