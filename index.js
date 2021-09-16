process.traceDeprecation = true;
const express = require('express');
const path = require(`path`);
const bcrypt = require(`bcrypt`)
const mongoose = require(`mongoose`)
const app = express();
const bodyParser = require(`body-parser`);
const uri = `mongodb+srv://alvaro:Wx6QdkklUQ5Bgtad@cluster0.v3juy.mongodb.net/usuarios`
mongoose.set('useFindAndModify', false);
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
    useCreateIndex: true,
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

app.get('/urlparam', async(req, res) => {

    const { temp, hum, pres, bru, ane, vmax } = req.query;
    res.status(200).send("Funciono");
    if (temp ) {
        if(hum && pres && bru && ane && vmax) {
            await Datos.deleteMany({});

            const datos = await new Datos({ temp, hum, pres, bru, ane, vmax });
            console.log(24)

            let date = new Date();
            let hours = date.getHours();
            let day = date.getDate();
            let minutes = date.getMinutes();
            const Historial = await new historial({ temp, hum, pres, bru, ane, vmax, day, hours, minutes });

            await datos.save();  
            await Historial.save();              
        }
    }
});


app.get('/hola', async(req, res) => {
    res.send("Funciono");
});

app.post('/post', async function(req, res) {
    res.send('POST request to the homepage')
    const { a, b } = req.body;
    const z = req.body.a;
    const y = req.body.b;
    console.log({ a, b })
    console.log({ y, z })
    const datos = await new Datos({ a, b });
    await datos.save();
    res.status(200).send(a);

    // try {
    //     res.status(200);
    //     if (a != undefined || b != undefined) {
    //         const datos = await new Datos({ a, b });
    //         await datos.save();
    //     }
    // } catch (e) {
    //     throw new Error(`Error guardando datos: ${e}`)
    // }
})

app.get('/cuenta', (req, res) => {
    res.sendFile(`${__dirname}/public/sesiones.html`);
})

app.listen(port, () => {
    console.log('servidor a su servicio en el puerto', port)
})