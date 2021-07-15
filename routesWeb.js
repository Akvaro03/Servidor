//express
const express = require('express');
const app = express();
//router
const router = express.Router();
//axios
const axios = require('axios');
//schemma user
const User = require(`./public/jss/user`);
const path = require('path');
//mongo url
const uri = `mongodb+srv://alvaro:Wx6QdkklUQ5Bgtad@cluster0.v3juy.mongodb.net/usuarios`
    //express sessions
const session = require(`express-session`)
const MongoDBSession = require(`connect-mongodb-session`)(session);
const store = new MongoDBSession({
    uri: uri,
    collection: `mySession`,
})
router.use(session({
    key: `klimarios`,
    secret: `key`,
    resave: false,
    saveUninitialized: false,
    store: store,
}))
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect(`http://localhost:3000/cuenta`)
    }
};
//motor vista
app.set(`view engine`, `ejs`);
app.set(`views`, __dirname + `/views`)
app.use(express.static('./public'))

router.get(`/`, isAuth, async(req, res) => {
        const nombre = req.session.nombre;
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=rosario&units=metric&appid=5a402f7379a9896b68f900a88b9c683a`)
            .then(response => response.data)
            .then(data => { return data.main })
            .catch(error => { return new Error(error) });
        const dataTemp = response.temp;
        const dataHumi = response.humidity;
        const dataTempMax = response.temp_max;
        const dataFeels = response.feels_like;

        let date = new Date()
        let direccion = "norte";
        res.render("index.ejs", { time: dataTemp, nombre: nombre, hours: date.getHours(), minutes: date.getMinutes(), humedad: dataHumi, direccion: direccion, sensacion: dataFeels, tempMax: dataTempMax })
    }



);

router.post('/register', async function(req, res) {
    const { username, password } = req.body;
    const user = new User({ username, password });

    user.save(err => {
        if (err) {
            res.status(500).send(`ERRROR AL REGISTRAR ${err}`);
        } else {
            res.status(200).redirect(301, `http://localhost:3000/cuenta`);
        }
    })
});

const Cerrar = (req, res) => {
    req.session.isAuth = false;

};

router.get('/cerrarSesion', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`http://localhost:3000/cuenta`);
        }
    });
});

router.post('/authenticate', function(req, res) {
    const { username, password } = req.body;

    User.findOne({ username }, (err, user) => {
        if (err) {
            res.status(500).send(`ERRROR AL REGISTRAR`);
        } else if (!user) {
            res.status(500).send(`EL USUARIO NO EXISTE`)
        } else {
            user.isCorrectPassord(password, function(err, result) {
                if (err) {
                    res.status(500).send(`ERRROR AL AUTENTIFICAR`);
                } else if (result) {
                    req.session.isAuth = true;
                    req.session.nombre = username;
                    console.log(req.session.nombre);
                    res.redirect(`http://localhost:3000/`);
                } else {
                    res.status(500).send(`USUARIO Y/O CONTRASEÑA INCORRECTA`);
                }
            })
        }
    })
})

module.exports = router;