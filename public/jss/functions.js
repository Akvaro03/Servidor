function dividirCadena(cadenaADividir,separador) {
    let arrayDeCadenas = cadenaADividir.split(separador);
    for (let i = 0; i < arrayDeCadenas.length; i++) {
        primero = arrayDeCadenas[i]
        console.log(primero)            
    }
}    


module.exports = {
    "dividirCadena": dividirCadena
}
