//express
const express = require('express');
const app = express();
//router
const router = express.Router();
const path = require('path');
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
//motor vista
app.set(`view engine`, `ejs`);
app.set(`views`, __dirname + `/views`)
app.use(express.static('./public'))

router.get(`/`, async(req, res) => {
    callback.inicio(req, res);
});

router.get(`/arduino`, async(req, res) => {
    callback.arduino(req, res);
});

router.post('/register', async function(req, res) {
    callback.register(req, res);
})

router.get('/cerrarSesion', async function(req, res) {
    callback.cerrarSesion(req, res);
});

router.post('/authenticate', (req, res) => {
    callback.autenticacion(req, res);
})

router.get('/opciones', isAuth, (req, res) => {
    callback.opciones(req, res);
});

router.post('/configuracion', (req, res) => {
    callback.configuracion(req, res);
});
router.post('/ubicacion', (req, res) => {
    callback.ubicacion(req, res);
});

module.exports = router;