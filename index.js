process.traceDeprecation = true;
const express = require('express');
const path = require(`path`);
const bcrypt = require(`bcrypt`)
const mongoose = require(`mongoose`)
const app = express();
const bodyParser = require(`body-parser`);
const uri = `mongodb+srv://alvaro:Wx6QdkklUQ5Bgtad@cluster0.v3juy.mongodb.net/usuarios`
const compression = require('compression');
app.use(compression());

const User = require(`./public/jss/user`);
const cors = require('cors')
app.use(cors({
    origin: '*',
    method: ['POST', 'DELETE', 'PUT', 'GET'],
    credentials: false
}))

const port = process.env.PORT || 3000;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connect(uri, (err) => {
    if (err) {
        throw err;
    } else {
        console.log(`conneccion existosa a ${uri}`)
    }
})


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, `public`)));
//Rutas web
app.use(express.static('./public'))

app.use('/', require('./routesWeb'));


const Datos = require(`./public/jss/datos`);
const historial = require(`./public/jss/historial`);
const functions = require("./public/jss/functions")

app.get('/urlparam', async(req, res) => {

    let { temp,hum} = req.query;
    res.status(200).send("Funciono");
    if (temp && hum) {
        await historial.deleteMany({});
        var temperatura = await functions.dividirCadena(temp,"/")
        var humedad = await functions.dividirCadena(hum,"/")
        console.log("temperatura es")
        console.log(temperatura)
        console.log("humedad es ")
        console.log(humedad)

        let date = new Date();
        let hours = date.getHours();
        let day = date.getDate();
        let minutes = date.getMinutes();
        
        let Historial = await new historial({ temp: temperatura, day, hours, minutes, hum: humedad, day, hours, minutes});
        await Historial.save();
    } else{
        if (temp) {
            let temperatura = await functions.dividirCadena(temp,"/")
            console.log("temperatura es")
            console.log(temperatura)
            
            let date = new Date();
            let hours = date.getHours();
            let day = date.getDate();
            let minutes = date.getMinutes();  
            let Historial = await new historial({ temp: temperatura, day, hours, minutes});
            await Historial.save();      
        }
        if (hum) {
            let humedad = await functions.dividirCadena(hum,"/")
            console.log("humedad es ")
            console.log(humedad)

            let date = new Date();
            let hours = date.getHours();
            let day = date.getDate();
            let minutes = date.getMinutes();  

            let Historial = await new historial({ hum: humedad, day, hours, minutes});
            await Historial.save();      
        }

    }
    // if (hum) {
    //     // await historial.deleteMany({});
    //     await functions.dividirCadenaHum(hum,"/")
    // }

});


app.get('/hola', async(req, res) => {
    res.send("Funciono");
});

app.post('/post', async function(req, res) {
    const { a, b } = req.body;
    console.log({ a, b })
    const datos = await new Datos({ a, b });
    await datos.save();
    res.status(200).send({a,b, c:"viva jesu loco"});

})

app.get('/cuenta', (req, res) => {
    res.sendFile(`${__dirname}/public/sesiones.html`);
})

app.listen(port, () => {
    console.log('servidor a su servicio en el puerto', port)
})