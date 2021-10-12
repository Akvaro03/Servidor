const Datos = require(`./datos`);
const historial = require(`./historial`);


async function dividirCadenaTemp(cadenaADividir,separador) {
    let primero = [];

    let arrayDeCadenas = cadenaADividir.split(separador);
    for (let i = 0; i < arrayDeCadenas.length; i++) {
        primero.push(arrayDeCadenas[i])
    }
    return primero;
}    

async function dividirCadenaHum(cadenaADividir,separador) {
    let primero = [];

    let arrayDeCadenas = cadenaADividir.split(separador);
    for (let i = 0; i < arrayDeCadenas.length; i++) {
        primero.push(arrayDeCadenas[i])
    }
    return primero;
}    


module.exports = {
    "dividirCadenaHum": dividirCadenaHum,
    "dividirCadenaTemp": dividirCadenaTemp
}
