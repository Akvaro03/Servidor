process.traceDeprecation = true;
const express = require('express');
const path = require(`path`);
const bcrypt = require(`bcrypt`)
const mongoose = require(`mongoose`)
const app = express();
const bodyParser = require(`body-parser`);
const uri = `mongodb+srv://alvaro:Wx6QdkklUQ5Bgtad@cluster0.v3juy.mongodb.net/usuarios`
mongoose.set('useFindAndModify', false);

const User = require(`./public/jss/user`);

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
app.get('/urlparam', (req, res) => {


    const { temp, humedad, viento } = req.query;


    const datos = new Datos({ temp, humedad, viento });

    datos.save(err => {
        if (err) {
            res.status(500).send(`ERRROR AL REGISTRAR ${err}`);
        } else {
            res.status(200).send(`Se logro`);
        }
    })
});

app.get('/cuenta', (req, res) => {
    res.sendFile(`${__dirname}/public/sesiones.html`);
})

app.listen(port, () => {
    console.log('servidor a su servicio en el puerto', port)
})