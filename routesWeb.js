//express
const express = require('express');
const app = express();

const cors = require('cors')
app.use(cors())


const jwt = require('jsonwebtoken');

//router
const fs = require('fs');
const router = express.Router();
const path = require('path');
const bodyParser = require(`body-parser`);
const compression = require('compression');
app.use(compression());

//mongo url
const uri = `mongodb+srv://alvaro:Wx6QdkklUQ5Bgtad@cluster0.v3juy.mongodb.net/usuarios`;
//express sessions
const session = require(`express-session`);
const MongoDBSession = require(`connect-mongodb-session`)(session);
const callback = require(`./public/jss/callbacks`);
const store = new MongoDBSession({
    uri: uri,
    collection: `mySession`,
});
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
        res.redirect(`/cuenta`)
    }
};
const isAuth22 = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.send({
            ok: false,
            message: 'Toket inválido'
        })
    }
    console.log("hola")

    jwt.verify(token, "contraseña", function(err, token) {
        if (err) {
            return res.send({
                ok: false,
                message: 'Toket inválido',
                token: "token"
            });
        } else {
            console.log(token);
            console.log("hola")
            next();
        }
    });
};

//motor vista
app.set(`view engine`, `ejs`);
app.set(`views`, __dirname + `/views`)
app.use(express.static('./public'))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support enc

router.get(`/`, async(req, res) => {
    callback.inicio(req, res);
});

router.get(`/arduino`, async(req, res) => {
    callback.arduino(req, res);
});

router.post('/register', async function(req, res) {
    await callback.register(req, res);
})

router.get('/cerrarSesion', async function(req, res) {
    callback.cerrarSesion(req, res);
});

router.post('/authenticate', (req, res) => {
    callback.autenticacion(req, res);
})

router.get('/opciones', isAuth22, (req, res) => {
    callback.opciones(req, res);
});

router.post('/configuracion', (req, res) => {
    callback.configuracion(req, res);
});
router.post('/ubicacion', (req, res) => {
    callback.ubicacion(req, res);
});

router.post('/contact', (req, res) => {
    callback.contact(req, res);
});

module.exports = router;