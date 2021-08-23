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
app.use(cors())

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

const Datos = require(`./public/jss/datos`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, `public`)));
//Rutas web
app.use(express.static('./public'))


app.use('/', require('./routesWeb'));
app.get('/urlparam', async(req, res) => {
    const { a, b } = req.query;
    res.status(200).send("Funciono");
    const datos = await new Datos({ a, b });
    await datos.save();
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
    res.status(200).send("Funciono");

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