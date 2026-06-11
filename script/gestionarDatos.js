/*const datos = { devolverResultado
                nombreDeUnidad:'Guerrero Jaguar',
                tipo: 'infanteria',
                civilizacion: 'Aztecas',
                costoDeAlimento: 60,
                costoDeMadera: 0,
                costoDeOro: 30,
                puntosDeVida: 50,
                ataqueCuerpoACuerpo: 10,
                armaduraCuerpoACuerpo: 1,
                armaduraAntiProyectil: 1,
                velocidad: 1,
                lineaDeVision: 3
}//fin datos*/

const datos = { 'seccion':'buscarDatosPorNombreDeCivilizacion',
                'id_civilizacion': 2
}//fin datos

solicitarDatosConParametros(datos)
    .then(respuesta=>{ console.log(respuesta)});

/*solicitarDatosSinParametros()
 .then(respuesta=>{console.log( JSON.parse(respuesta))});*/
