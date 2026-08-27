function destruirGrafico(canvas) {
    if (Chart.getChart(canvas)) {
        Chart.getChart(canvas).destroy();
    }
}//fin function destruirGrafico

function crearGrafico(canvas, tipoDeGrafico, tituloDelGrafico, etiquetas, datosNumericos, colores, coloresDeBordesDeBarras, colorTextoDeBarra, colorDatosEjeX) {
// Verifica si ya existe un gráfico en el canvas y lo destruye
destruirGrafico(canvas);
// Registrar el plugin ChartDataLabels
Chart.register(ChartDataLabels);
const configuracionDeDatosDeGrafico = {
    labels: etiquetas,
    datasets: [
        {   label: tituloDelGrafico,
            data: datosNumericos,
            backgroundColor: colores,
            borderColor: coloresDeBordesDeBarras,
            borderWidth: 2,
            hoverOffset: 4,
            borderRadius: 5,
            maxBarThickness: 40
        }/*,
        {   label: tituloDelGrafico,
            data: datosNumericos,
            backgroundColor: colores,
            borderColor: coloresDeBordesDeBarras,
            hoverOffset: 4,
            borderRadius: 5,
            maxBarThickness: 40
        }*/
    ]
};

// Plugin para fondo del área del gráfico
const plugin = {
    id: 'customChartAreaBackgroundColor',
    beforeDraw: (chart) => {
        const { ctx, chartArea: { left, top, width, height } } = chart;
        ctx.save();
        ctx.fillStyle = '#004d80'; // Color de fondo del gráfico
        ctx.fillRect(left, top, width, height);
        ctx.restore();
    }
};

new Chart(canvas, {
    type: tipoDeGrafico,
    data: configuracionDeDatosDeGrafico,
    options: {
        // 👇 ANIMACIÓN CORRECTA PARA BARRAS
            animation: {
                duration: 1000,
                easing: 'easeInOutCubic'
            },
            animations: {
                y: {
                    from: 0,
                    delay: (context) => context.dataIndex * 120
                }
            },
        plugins: {
            title: {
                display: true,
                text: tituloDelGrafico,
                color: '#66ff66',
                font: {
                    size: 18
                }
            },
            datalabels: {  // Configuración de etiquetas sobre las barras
                anchor: "end", // Ubicar las etiquetas en la parte superior de la barra
                align: "top",  // Alineación superior
                formatter: function(value) { return value; }, // Mostrar el valor de cada barra
                font: {
                    weight: "bold",
                    size: 14
                },
                color: colorTextoDeBarra//"#66ff66" // Color del texto de los números
            }
        },
        scales: {
            x: {
                ticks: {
                color: colorDatosEjeX//'#66ff66' // Color de los labels del eje X
                }
            },
            y: {
                beginAtZero: true,
                grace: '10%',
                ticks: {
                    color: '#66ff66' // Color de los labels del eje Y
                }
            }
        }
    },
    plugins: [plugin, ChartDataLabels] // Se mantiene el plugin de fondo
});

}


function almacenarDatosDeIngresoParaGraficar(datosDeIngreso, matrizOrigenDeIngresos, ingresosActuales, matrizSaldosActuales){

    const colorIngreso = '#66ff66';
    const colorSaldo = '#ff6666';
    
    let datosAGraficar = {  origen: [],
                            datosNumericos: [],
                            datosDeSaldo: [],
                            colorDeBarra: [],
                            colorDeBordeDeBarra: [],
                            colorTextoDeBarra: [],
                            colorDatosEjeX: [] }

    for (let i = 0; i < datosDeIngreso.cantidadDeResultados; i++) {
        datosAGraficar.origen.push('Ingreso ' + matrizOrigenDeIngresos[i]);
        datosAGraficar.datosNumericos.push(ingresosActuales[i]);
        datosAGraficar.colorDeBarra.push(colorIngreso);
        datosAGraficar.colorTextoDeBarra.push(colorIngreso);
        datosAGraficar.colorDatosEjeX.push(colorIngreso);
        datosAGraficar.colorDeBordeDeBarra.push('#004d00');

        datosAGraficar.origen.push('Saldo ' + matrizOrigenDeIngresos[i]);
        datosAGraficar.datosNumericos.push(matrizSaldosActuales[i]);
        datosAGraficar.colorDeBarra.push(colorSaldo);
        datosAGraficar.colorTextoDeBarra.push(colorSaldo);
        datosAGraficar.colorDatosEjeX.push(colorSaldo);
        datosAGraficar.colorDeBordeDeBarra.push('#660000');
    }

    return datosAGraficar;

}//fin almacenarDatosParaGraficar


