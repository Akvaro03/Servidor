//express
const express = require('express');
const app = express();
//router
const router = express.Router();
//axios
const axios = require('axios');
//schemma user
const User = require(`./user`);
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
        res.redirect(`/cuenta`)
    }
};

const opciones = async(req, res) => {
    console.log("opciones ip= " + req.session.ip);
    res.render("opciones.ejs", {})
}

const authenticate = async(req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(async function(user) {
            if (!user) {
                res.status(500).send(`EL USUARIO NO EXISTE`)
            } else {

                user.isCorrectPassord(password, async function(err, result) {
                    if (err) {
                        res.status(500).send(`ERRROR AL AUTENTIFICAR`);
                    } else if (result) {


                        const user = await User.find({ username: username })
                            .then(user => { return user[0] })
                        console.log("autentificacion ip=" + user._id);
                        req.session.ip = user._id;
                        console.log("autentificacion ip=" + req.session.ip);

                        req.session.isAuth = true;
                        req.session.nombre = username;
                        console.log("autentificacion nombre=" + req.session.nombre);
                        res.redirect(`/`);
                    } else {
                        res.status(500).send(`USUARIO Y/O CONTRASEÑA INCORRECTA`);
                    }
                })
            }
        })
        .catch(error => { res.status(500).send(`ERRROR AL REGISTRAR`); });
}

const cerrarSesion = async(req, res) => {
    try {
        req.session.destroy()
        res.redirect(`/cuenta`);
    } catch (error) {
        console.log(error)
    }
}

const register = async(req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });

    user.save()
        .then(function(user) {
            req.session.ip = user._id;
            console.log("register id= " + user._id);
            req.session.nombre = username;
            console.log("register username= " + username);
            req.session.isAuth = true;
            res.status(200).redirect(301, `/opciones`);
        })
        .catch(err => { res.status(500).send(`ERRROR AL REGISTRAR EN EL USERNAME O CONTRASEÑA`); });


}

const arduino = async(req, res) => {
    var nombre = "Crear cuenta";
    const response = await axios.get(`192.168.0.31`)
        .catch(error => { return new Error(error) });
    const dataTemp = response.temperature;
    const dataHumi = response.Humidity;
    const dataTempMax = "cualquier numero";
    const dataFeels = "cualquier numero";

    var ubicacion = "none";
    if (req.session.nombre) {
        nombre = req.session.nombre;
    }
    if (req.session.isAuth) {
        const user = await User.find({ username: nombre })
            .then(user => { return user[0] })
        ubicacion = user.ubicacion;
        console.log(ubicacion)
    }
    if (ubicacion == "none") {
        ubicacion = "Configure su ubicacion"
    }


    let date = new Date()
    let direccion = "norte";
    res.render("index.ejs", { time: dataTemp, ubicacion: ubicacion, nombre: nombre, hours: date.getHours(), minutes: date.getMinutes(), humedad: dataHumi, direccion: direccion, sensacion: dataFeels, tempMax: dataTempMax })
    console.log(req.session.ip);
}

const inicio = async(req, res) => {
    var nombre = "Crear cuenta";
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=jasjsajasj&units=metric&appid=5a402f7379a9896b68f900a88b9c683a`)
        .then(response => response.data)
        .then(data => { return data.main })
        .catch(error => { return new Error(error) });
    const dataTemp = response.temp;
    const dataHumi = response.humidity;
    const dataTempMax = response.temp_max;
    const dataFeels = response.feels_like;

    var ubicacion = "none";
    if (req.session.nombre) {
        nombre = req.session.nombre;
    }
    if (req.session.isAuth) {
        const user = await User.find({ username: nombre })
            .then(user => { return user[0] })
        ubicacion = user.ubicacion;
        console.log(ubicacion)
    }
    if (ubicacion == "none") {
        ubicacion = "Configure su ubicacion"
    }

    let date = new Date()
    let direccion = "norte";
    res.render("index.ejs", { time: dataTemp, ubicacion: ubicacion, nombre: nombre, hours: date.getHours(), minutes: date.getMinutes(), humedad: dataHumi, direccion: direccion, sensacion: dataFeels, tempMax: dataTempMax })
    console.log(req.session.ip);
}

const configuracion = async(req, res) => {
    const id = req.session.ip;
    console.log("configuracion ip= " + req.session.ip);

    User.findOneAndUpdate({ _id: id }, req.body, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log(`Se logro`);
        }
    })

    res.redirect(`/`)
}

const ubicacion = async(req, res) => {
    const { ubicacion } = req.body;
    console.log(ubicacion);
    res.redirect(`/?ubicacion=${ubicacion}`)
}

module.exports = {
    opciones: opciones,
    autenticacion: authenticate,
    cerrarSesion: cerrarSesion,
    register: register,
    arduino: arduino,
    inicio: inicio,
    configuracion: configuracion,
    ubicacion: ubicacion
};