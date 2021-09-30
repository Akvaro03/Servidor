function dividirCadena(cadenaADividir,separador) {
    var arrayDeCadenas = cadenaADividir.split(separador);
    for (let i = 0; i < arrayDeCadenas.length; i++) {
        primero = arrayDeCadenas[i]
        console.log(primero)            
    }
}


module.exports = {
    "dividirCadena": dividirCadena
}
