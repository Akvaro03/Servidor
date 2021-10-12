const Datos = require(`./datos`);
const historial = require(`./historial`);


async function dividirCadena(cadenaADividir,separador) {
    let primero = [];

    let arrayDeCadenas = cadenaADividir.split(separador);
    for (let i = 0; i < arrayDeCadenas.length; i++) {
        primero.push(arrayDeCadenas[i])
    }
    return primero;
}    

module.exports = {
    "dividirCadena": dividirCadena
}
