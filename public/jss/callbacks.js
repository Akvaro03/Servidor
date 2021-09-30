//express
const express = require('express');
const app = express();
const bodyParser = require(`body-parser`);


const functions = require("./functions")

const fs = require('fs');
//router
const router = express.Router();
//axios
const axios = require('axios');
//schemma 
const User = require(`./user`);
const Datos = require(`./datos`);
const historial = require(`./historial`);

// mail
const nodemailer = require('nodemailer');
//mongo url
const uri = `mongodb+srv://alvaro:Wx6QdkklUQ5Bgtad@cluster0.v3juy.mongodb.net/usuarios`;
//express sessions
const session = require(`express-session`)
const MongoDBSession = require(`connect-mongodb-session`)(session);
const mongoose = require(`mongoose`);

const connection = require('./mongo.js');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support enc
const jwt = require('jsonwebtoken');

const store = new MongoDBSession({
    uri: uri,
    collection: `mySession`,
})

function mayusculaPrimera(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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
        res.send({
            ok: false,
            message: 'Toket inválido'
        })
    }

    jwt.verify(token, "contraseña", function(err, token) {
        if (err) {
            return res.send({
                ok: false,
                message: 'Toket inválido',
                token: "token"
            });
        } else {
            console.log(token);
            next();
        }
    });
};

const opciones = async(req, res) => {
    res.render("opciones.ejs", {})
};

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
                        req.session.ip = user._id;

                        req.session.isAuth = true;
                        req.session.nombre = username;

                        var u = {
                            ip: user._id,
                            username: username
                        }

                        let token = jwt.sign(u, "contraseña", {
                            expiresIn: 60 * 60 * 24 // expires in 24 hours
                        });
                        res.redirect(`/`);
                    } else {
                        res.status(500).send(`USUARIO Y/O CONTRASEÑA INCORRECTA`);
                    }
                })
            }
        })
        .catch(error => { res.status(500).send(`ERRROR AL REGISTRAR`); });
};

const cerrarSesion = async(req, res) => {
    try {
        req.session.destroy()
        res.redirect(`/cuenta`);
    } catch (error) {
        console.log(error)
    }
};

const register = async(req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });

    user.save()
        .then(await
            function(user) {
                req.session.ip = user._id;
                req.session.nombre = username;
                req.session.isAuth = true;
                res.status(200).redirect(301, `/opciones`);
            })
        .catch(err => { res.status(500).send(`ERRROR AL REGISTRAR EN EL USERNAME O CONTRASEÑA`); });
};

const arduino = async(req, res) => {
    let { ubicacion, frase, temp } = req.query;
    var nombre = "Crear cuenta";
    var dataTemp;
    var dataHumi;
    var dataTempMax;
    var dataFeels;

    let date = await new Date();
    let hours = date.getHours();
    let day = date.getDate();
    let minutes = date.getMinutes()


    if (temp) {
        functions.dividirCadena(temp,"/")
    }

    const datoAhora = await historial.find({ minutes: minutes, hours:hours, day:day})
        .then(user => { return user[0] })
        .then(user => { return user.temp })
        for (let index = 0; index < datoAhora.length; index++) {
            console.log(datoAhora[index]);
            
        }
        console.log(datoAhora[0]);

    if (datoAhora != undefined) {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${ubicacion}&units=metric&appid=5a402f7379a9896b68f900a88b9c683a`)
            .then(response => response.data)
            .then(data => { return data.main })
            .catch(error => { return new Error(error) });
        dataTemp = datoAhora.temp;
        dataHumi = datoAhora.hum;
        dataTempMax = response.temp_max;
        dataFeels = response.feels_like;
    } else if (datoAhora) {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=rosario&units=metric&appid=5a402f7379a9896b68f900a88b9c683a`)
            .then(response => response.data)
            .then(data => { return data.main })
            .catch(error => { return new Error(error) });
            dataTemp = datoAhora.temp;
            dataHumi = datoAhora.hum;
            dataTempMax = response.temp_max;
        dataFeels = response.feels_like;
        ubicacion = "rosario";
    }


    if (req.session.nombre != undefined) {
        nombre = req.session.nombre;
    }
    if (req.session.isAuth != undefined) {
        const user = await User.find({ username: nombre })
            .then(user => { return user[0] })
        ubicacion = user.ubicacion;
    }

    console.log('temp es ' +  dataTemp)
    console.log('humd es ' +  dataHumi)
    
    let direccion = "norte";
    await res.render("index.ejs", { time: dataTemp, ubicacion: ubicacion, nombre: nombre, hours: date.getHours(), minutes: date.getMinutes(), humedad: dataHumi, direccion: direccion, sensacion: dataFeels, tempMax: 15 })
};

const inicio = async(req, res) => {
    const { a, b } = req.query;
    const datos = await new Datos({ a, b });
    await datos.save();

    let { ubicacion } = req.query;
    var nombre = "Crear cuenta";
    var dataTemp;
    var dataHumi;
    var dataTempMax;
    var dataFeels;

    if (ubicacion != undefined) {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${ubicacion}&units=metric&appid=5a402f7379a9896b68f900a88b9c683a`)
            .then(response => response.data)
            .then(data => { return data.main })
            .catch(error => { return new Error(error) });
        dataTemp = response.temp;
        dataHumi = response.humidity;
        dataTempMax = response.temp_max;
        dataFeels = response.feels_like;
    } else {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=rosario&units=metric&appid=5a402f7379a9896b68f900a88b9c683a`)
            .then(response => response.data)
            .then(data => { return data.main })
            .catch(error => { return new Error(error) });
        dataTemp = response.temp;
        dataHumi = response.humidity;
        dataTempMax = response.temp_max;
        dataFeels = response.feels_like;
        ubicacion = "rosario";
    }


    if (req.session.nombre != undefined) {
        nombre = req.session.nombre;
    }
    if (req.session.isAuth != undefined) {
        const user = await User.find({ username: nombre })
            .then(user => { return user[0] })
        ubicacion = user.ubicacion;
    }


    let date = new Date()
    let direccion = "norte";
    await res.render("index.ejs", { time: dataTemp, ubicacion: ubicacion, nombre: nombre, hours: date.getHours(), minutes: date.getMinutes(), humedad: dataHumi, direccion: direccion, sensacion: dataFeels, tempMax: dataTempMax })
};

const configuracion = async(req, res) => {
    const id = req.session.ip;

    User.findOneAndUpdate({ _id: id }, req.body, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log(`Se logro`);
        }
    })

    res.redirect(`/`)
};

const ubicacion = async(req, res) => {
    const { ubicacion } = req.body;
    res.redirect(`/?ubicacion=${ubicacion}&elegida=yes`)
};

const contact = async(req, res) => {
    const { email, asunto, message } = req.body;



    transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        ignoreTLS: false,
        secure: false,
        auth: {
            user: 'alvaroballarini2010@gmail.com',
            pass: '141003@Ba'
        }
    });
    const mailOptions = {
        from: 'alvaroballarini2010@gmail.com',
        to: 'alvaroballarini2010@hotmail.com',
        subject: `${email} - ${asunto}`,
        text: message
    };
    const product = [{
        id: 1
    }]
    res.json(product)
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {} else {
            res.status(200);
            console.log('Email enviado: ' + info.response);
            res.send('Datos guardados con éxito');
        }
    });
};

module.exports = {
    opciones: opciones,
    // get: get,
    autenticacion: authenticate,
    cerrarSesion: cerrarSesion,
    register: register,
    arduino: arduino,
    inicio: inicio,
    configuracion: configuracion,
    ubicacion: ubicacion,
    contact: contact
};