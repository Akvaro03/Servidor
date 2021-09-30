const Datos = require(`./datos`);
const historial = require(`./historial`);

var primero = [];
async function dividirCadena(cadenaADividir,separador) {
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
    // const Historial = await new historial({ temp, hum, pres, bru, ane, vmax, day, hours, minutes });


    Historial = await new historial({ temp: primero, day, hours, minutes});
    const datos = await new Datos({temp: primero});

    await Historial.save();
    await datos.save();  

}    


module.exports = {
    "dividirCadena": dividirCadena
}
