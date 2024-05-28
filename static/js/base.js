// const data = [
//     [
//         4,
//         1715333484,
//         "$IIMWV,226.0,R,000.0,N,A *0B",
//         "IIMWV",
//         226,
//         0,
//         null,
//         "A "
//     ],
//     [
//         5,
//         1715333528,
//         "$IIMWV,226.0,R,000.0,N,A *0B",
//         "IIMWV",
//         226,
//         0,
//         null,
//         "A "
//     ],
//     [
//         6,
//         1715333695,
//         "$IIMWV,226.0,R,000.0,N,A *0B",
//         "IIMWV",
//         226,
//         0,
//         null,
//         "A "
//     ]
// ]

const delta = location.search.replace("?", "") || "2h"
var data = {}

async function getDatas(label) {

    var index = {
        "Direction du vent": 3,
        "Vitesse du vent": 4
    }[label]

    var datas = []

    for (let i = 0; i < data.length; i++) {
        datas.push(formatToData(data[i], index))
    }

    return datas
}

async function setupChart() {
    
    data = await (await fetch(`/wind/${delta}`)).json();

    var speed = await getDatas("Vitesse du vent")
    var dir = await getDatas("Direction du vent")

    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Direction du vent',
                data: dir,
                fill: true,
                borderColor: '#289dc5',
                tension: 0.1,
                yAxisID: 'dir'
            },
            {
                label: 'Vitesse du vent',
                data: speed,
                fill: true,
                borderColor: '#eea73a',
                tension: 0.1,
                yAxisID: 'speed'
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        tooltipFormat: 'HH:mm',
                        displayFormats: {
                            millisecond: 'HH:mm:ss.SSS',
                            second: 'HH:mm:ss',
                            minute: 'HH:mm',
                            hour: 'HH'
                        }
                    },
                    dir: {
                        type: 'linear',
                        position: 'right',
                        grid: {
                            display: true,
                            drawBorder: true,
                            drawOnChartArea: true,
                        },
                        min: 0,
                        max: 360
                    },
                    speed: {
                        type: 'linear',
                        position: 'left',
                        grid: {
                            display: true,
                            drawBorder: true,
                            drawOnChartArea: true,
                        },
                        min: 0,
                        max: 40
                    }
                }
            }
        }
    });
}

function getDate(timestamp) {
    return new Date(timestamp * 1000);
}

function formatToData(row, i) {
    return {
        x: getDate(row[1]).toJSON(),
        y: row[i]
    }
}

setupChart()