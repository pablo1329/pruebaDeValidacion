function destruirGrafico(canvas) {
    if (Chart.getChart(canvas)) {
        Chart.getChart(canvas).destroy();
    }
}//fin function destruirGrafico

function crearGrafico(idGrafico, tipoDeGrafico, tituloDelGrafico, etiquetas, datosNumericos, colores, coloresDeBordesDeBarras, colorTextoDeBarra, colorDatosEjeX) {

const canvas = document.getElementById(idGrafico);

// Verifica si ya existe un gráfico en el canvas y lo destruye
destruirGrafico(canvas);
// Registrar el plugin ChartDataLabels
Chart.register(ChartDataLabels);
const configuracionDeDatosDeGrafico = {
    labels: etiquetas,
    datasets: [
        {    label: tituloDelGrafico,
            data: datosNumericos,
            backgroundColor: colores,
            borderColor: coloresDeBordesDeBarras,
            borderWidth: 2,
            hoverOffset: 4,
            borderRadius: 5,
            maxBarThickness: 40
        }
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
            datalabels: {  
                anchor: "end", 
                align: "top",  
                formatter: function(value) { return value; }, 
                font: {
                    weight: "bold",
                    size: 14
                },
                color: colorTextoDeBarra 
            }
        },
        scales: {
            x: {
                ticks: {
                color: colorDatosEjeX 
                }
            },
            y: {
                beginAtZero: true,
                grace: '10%',
                ticks: {
                    color: '#66ff66' 
                }
            }
        }
    },
    plugins: [plugin, ChartDataLabels] 
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


function almacenarDatosDeGastoParaGraficar(idCategoria, categoria, importeTotal){

    const coloresDeCategoriasDeGasto = ['#66ff66', '#6699ff', '#b3ff66', '#c266ff', '#d9b38c', '#ff6666', '#ffa366', '#b3b3b3', '#66d9ff', '#b3b3b3'];

    const coloresDeBordeDeCategoriasDeGasto = ['#ff6666', '#002266', '#336600', '#3d0066', '#4d3319', '#660000', '#662900', '#333333', '#004d66', '#333333'];

    let datosDeGastoAGraficar = {categoriaDeGasto: [],  
                                 importeTotal: [],  
                                 colores: [],  
                                 coloresDeBorde: [] };

    let cantidadDeDatos = idCategoria.length;

    for (let i = 0; i < cantidadDeDatos; i++) {
            
        datosDeGastoAGraficar.categoriaDeGasto.push(categoria[i]);
        datosDeGastoAGraficar.importeTotal.push(importeTotal[i]);
        datosDeGastoAGraficar.colores.push(coloresDeCategoriasDeGasto[idCategoria[i]]);
        datosDeGastoAGraficar.coloresDeBorde.push(coloresDeBordeDeCategoriasDeGasto[idCategoria[i]]);

    }//fin bucle for

    return datosDeGastoAGraficar;

}//fin function almacenarDatosDeGastoParaGraficar