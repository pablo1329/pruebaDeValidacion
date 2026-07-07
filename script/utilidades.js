function obtenerRangoMes(fechaString) {
    const [anio, mes, dia] = fechaString.split('-').map(Number);
    
    // Primer día del mes
    const fechaInicio = `${anio}-${String(mes).padStart(2, '0')}-01`;
    
    // Último día del mes (calculado sumando 1 mes y restando 1 día)
    const fecha = new Date(anio, mes - 1, 1);
    fecha.setMonth(fecha.getMonth() + 1);
    fecha.setDate(fecha.getDate() - 1);
    
    const fechaFin = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    
    return { inicio: fechaInicio, fin: fechaFin };
}

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
}