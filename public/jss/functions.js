const Datos = require(`./datos`);
const historial = require(`./historial`);

var primero = [];
async function dividirCadena(cadenaADividir,separador, dato) {

    let arrayDeCadenas = cadenaADividir.split(separador);
    for (let i = 0; i < arrayDeCadenas.length; i++) {
        primero.push(arrayDeCadenas[i])
    }
    // console.log(primero)       
    let hola = primero
    // console.log(hola)

    let date = new Date();
    let hours = date.getHours();
    let day = date.getDate();
    let minutes = date.getMinutes();
    
    console.log(dato)
    let Historial = await new historial({ temp: primero, day, hours, minutes});
    await Historial.save();

}    


module.exports = {
    "dividirCadena": dividirCadena
}
