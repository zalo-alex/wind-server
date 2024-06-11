const warning = document.getElementById("warning").querySelector(".content")

const delta = location.search.replace("?", "") || "2h"
var data = {}

async function setupLastData() {
    const lastData = (await (await fetch(`/api/wind/last`)).json()).data
    const windDir = lastData[3]
    const windSpeed = lastData[4]

    document.getElementById("lastDir").textContent = `${windDir}°`
    document.getElementById("lastSpeed").textContent = `${windSpeed} nds`
    document.getElementById("date").textContent = getDate(lastData[1]).toLocaleString()
}

function average(data) {
    return data.reduce((a, b) => a + b, 0) / data.length
}

async function getDatas(label) {

    if (data.length == 0) {
        showWarning(`No "${label}" data`)
        return []
    }

    var index = {
        "Direction du vent": 3,
        "Vitesse du vent": 4
    }[label]

    var datas = []
    var average = 0
    var averageLength = 0
    var startDate = data[0][1]

    for (let i = 0; i < data.length; i++) {
        if (data[i][1] - startDate > 300) {
            datas.push({
                x: getDate(data[i - 1][1]).toJSON(),
                y: average / averageLength
            })

            average = data[i][index]
            averageLength = 1
            startDate = data[i][1]
        }
        average += data[i][index]
        averageLength++
    }

    if (averageLength > 0) {
        datas.push({
            x: getDate(data[data.length - 1][1]).toJSON(),
            y: average / averageLength
        })
    }

    return datas
}

async function setupChart() {

    data = await (await fetch(`/api/wind/${delta}`)).json();

    var speed = await getDatas("Vitesse du vent")
    var dir = await getDatas("Direction du vent")

    const ctx = document.getElementById('myChart');

    let hoverElt = document.createElement('IMG');
    hoverElt.src = "/static/assets/chart-cursor.png";
    hoverElt.alt = 'img';

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Direction du vent',
                data: dir.map((d) => {
                    if (d.y < 180) {
                        d.y += 360
                    }
                    return d
                }),
                borderColor: '#289dc5',
                tension: 0.4,
                yAxisID: 'dir',
                pointStyle: hoverElt,
                pointRadius: 0,
                pointHoverRadius: 2000,
                hoverBorderColor: "#333333",
            },
            {
                label: 'Vitesse du vent',
                data: speed,
                borderColor: '#eea73a',
                tension: 0.4,
                yAxisID: 'speed',
                pointStyle: hoverElt,
                pointRadius: 0,
                pointHoverRadius: 2000,
                hoverBorderColor: "#333333",
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    yAlign: 'center',
                    caretPadding: 25,
                    callbacks: {
                        label: function (tooltipItem) {
                            let value = parseInt(tooltipItem.formattedValue);
                            if (value < 0) {
                                value = value + 360
                            }
                            return tooltipItem.dataset.label + " : " + (tooltipItem.dataset.label.indexOf('V') === 0 ? (value.toString() + ' nds') : ((value % 360).toString() + '°'));
                        }
                    }
                }
            },
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
                    }
                },
                dir: {
                    type: 'linear',
                    position: 'right',
                    grid: {
                        display: true,
                        drawBorder: true,
                        drawOnChartArea: false,
                    },
                    scaleLabel: {
                        display: true,
                    },
                    max: 540,
                    min: 180,
                    ticks: {
                        includeBounds: false,
                        stepSize: 10,
                        callback: (a) => {
                            return a < 0 ? (360 + Math.round(a)) : (Math.round(a) % 360);
                        }
                    }
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
            },
            transitions: {
                active: {
                    animation: {
                        duration: 0
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            radius: 0,
        }
    });
}

function getDate(timestamp) {
    return new Date(timestamp * 1000);
}

function showWarning(text) {
    if (warning.textContent.length == 0) {
        document.getElementById("warning").style.display = "flex"
        warning.textContent = text
    } else {
        warning.textContent += ", " + text
    }
}

setupLastData()
setupChart()