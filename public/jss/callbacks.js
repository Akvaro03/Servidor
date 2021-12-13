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
        .catch(err => { res.status(500).send(err); });
};

const arduino = async(req, res) => {
    // await historial.deleteMany({})

    var ubicacion = "Configure su ubicacion";
    var nombre = "Crear cuenta";
    var dataTemp;
    var dataHumi;
    var dataTempMax;
    var dataFeels;

    let date = await new Date();
    let hours = date.getHours();
    let day = date.getDate();
    let minutes = date.getMinutes()
    let second = date.getSeconds();

    var prueba = 1;
    console.log(second)
    console.log(second)
    console.log(second)

    console.log(second)
    console.log(second)
    console.log(second)
    console.log(second)
    console.log(second)
    console.log(second)
    console.log(second)
    console.log(second)
    console.log(second)
    console.log(second)

    //buscar los datos en base a la hora
    // let datoAhora = await historial.find({ second: second, minutes: minutes, hours:hours, day:day})
    //     .then(user => { return user[0] })
var datoIntento = 0;

function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
  
    return true;
  }
  

        while (datoIntento == 0) {
            datoAhora = await historial.find({ second: second, minutes: minutes, hours:hours, day:day})
                .then(user => { return user[0] })
            second --;
            if (second < 0) {
                second = 60
            }
            let estaLleno = isObjEmpty(datoAhora)    
            if (estaLleno === false) {
                break
            } 
            console.log(datoAhora)
        }
        dataTemp = datoAhora.temp[0]; //obtener temperatura
        // console.log(dataTemp)
    
        dataHumi = datoAhora.temp[1]; //obtener humedad
        // console.log(dataHumi)
    
        var PresionAtmosferica  = datoAhora.temp[2]; //obtener Presion<   
        dataPres = Math.trunc(PresionAtmosferica)
        // console.log(dataPres)
    
        dataArray  = datoAhora.temp[3]; //obtener Array
        // console.log(dataArray)
    
        var velocidadDelViento = datoAhora.temp[4]; //obtener Velocidad
        dataVelo = Math.trunc(velocidadDelViento)
        // console.log(dataVelo)
    
        dataLiqui = datoAhora.temp[5]; //obtener Liquido
        console.log(dataLiqui)
        if (dataLiqui < 0) {
            dataLiqui = 0;
        }
        // console.log(dataLiqui)
    

        // .then(user => { return user }) //obtener los datos

    if (req.session.nombre != undefined) {
        nombre = req.session.nombre;
    }
    if (req.session.isAuth != undefined) {
        const user = await User.find({ username: nombre })
            .then(user => { return user[0] })
        if (user.ubicacion) {
            console.log(user.ubicacion)
            ubicacion = user.ubicacion;
        }
    }

    console.log('temp es ' +  dataTemp)
    console.log('humedad es ' +  dataHumi)
    console.log('Presion es ' +  dataPres)
    console.log('Array es ' +  dataArray)
    console.log('Velocidad es ' +  dataVelo)
    console.log('Liquido es ' +  dataLiqui)

    let direccion = "norte";
    
    if (dataArray == "E") {
        dataArray = "este"
    } else if (dataArray == "N"){
        dataArray = "Norte"
    } else if (dataArray == "W") {
        dataArray = "Oeste"
    } else if (dataArray == "S"){
        dataArray = "Sur";
    } else if (dataArray == "NE"){
        dataArray = "Noreste";
    } else if (dataArray == "NW"){   
        dataArray = "noroeste";
    } else if (dataArray == "SE"){
        dataArray = "sureste";
    } else if (dataArray == "SW"){
        dataArray = "suroeste";
    }
    await res.render("arduino.ejs", { time: dataTemp,humedad: dataHumi, direccion: dataArray, presion: dataPres, array: dataArray, velocidad: dataVelo, liquido: dataLiqui, ubicacion: ubicacion, nombre: nombre, hours: date.getHours(), minutes: date.getMinutes(),  sensacion: dataFeels, tempMax: "15" })
};

const inicio = async(req, res) => {
    const { a, b } = req.query;
    const datos = await new Datos({ a, b });
    await datos.save();

    let { ubicacion } = req.query;
    console.log(ubicacion)
    var nombre = "Crear cuenta";
    var dataTemp;
    var dataHumi;
    var dataTempMax;
    var dataFeels;

    if (ubicacion) {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${ubicacion}&units=metric&appid=5a402f7379a9896b68f900a88b9c683a`)
            .then(response => response.data)
            .then(data => { return data.main })
            .catch(error => { return new Error(error) });
        dataTemp = response.temp;
        dataHumi = response.humidity;
        dataTempMax = response.temp_max;
        dataFeels = response.feels_like;
        console.log(ubicacion)
    } else {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=rosario&units=metric&appid=5a402f7379a9896b68f900a88b9c683a`)
            .then(response => response.data)
            .then(data => { return data.main })
            .catch(error => { return new Error(error) });
        dataTemp = response.temp;
        dataHumi = response.humidity;
        dataTempMax = response.temp_max;
        dataFeels = response.feels_like;
        ubicacion = "Rosario";
    }


    if (req.session.nombre != undefined) {
        nombre = req.session.nombre;
    }
    if (req.session.isAuth != undefined) {
        const user = await User.find({ username: nombre })
            .then(user => { return user[0] })
        // ubicacion = user.ubicacion;
    }

    console.log(ubicacion)

    let date = new Date()
    let direccion = "norte";
    await res.render("index.ejs", { time: dataTemp, ubicacion: ubicacion, nombre: nombre, hours: date.getHours(), minutes: date.getMinutes(), humedad: dataHumi, direccion: direccion, sensacion: dataFeels, tempMax: dataTempMax })
};

const recibirDatos = async(req, res) => {
    let { temp,hum} = req.query;
    if (temp && hum) {
        // await historial.deleteMany({});
        var temperatura = await functions.dividirCadena(temp,"/")
        var humedad = await functions.dividirCadena(hum,"/")
        console.log("temperatura es")
        console.log(temperatura)
        console.log("humedad es ")
        console.log(humedad)
        res.status(200).send(temp + hum);

        let date = new Date();
        let hours = date.getHours();
        let day = date.getDate();
        let minutes = date.getMinutes();
        let second = date.getSeconds();
        console.log(second)
        let Historial = await new historial({ temp: temperatura, day, hours, minutes,second, hum: humedad, day, hours, minutes});
        await Historial.save();
    } else{
        if (temp) {
            let temperatura = await functions.dividirCadena(temp,"/")
            console.log("temperatura es")
            console.log(temperatura)    
            res.status(200).send(`Los datos son             "${temp}""`);

            let date = new Date();
            let hours = date.getHours();
            let day = date.getDate();
            let minutes = date.getMinutes();  
            let second = date.getSeconds();
            console.log(second)

            let Historial = await new historial({ temp: temperatura, day, hours, minutes,second});
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

}

const configuracion = async(req, res) => {
    
    const id = req.session.ip;

    req.session.idAr = req.body.idAr;

    const update = {
        ubicacion: req.body.ubicacion,
        idAr: req.body.idAr 
    };

    User.findOneAndUpdate({ _id: id }, update, function(err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect(`/`)
        }
    })

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
            pass: 'alvaro ballarini google'
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

const contactPagina = async(req, res) => {
    const client = new SMTPClient({
        user: 'alvaroballarini2010@gmail.com',
        password: 'alvaro ballarini google',
        host: 'smtp.your-email.com',
        ssl: true,
    });
    const message = {
        text: 'i hope this works',
        from: 'alvaroballarini2010@gmail.com',
        to: 'alvaroballarini2010@hotmail.com',
        subject: 'probando',
    };

    client.send(message, function (err, message) {
        console.log(err || message);
    });
    
    // you can continue to send more messages with successive calls to 'client.send',
    // they will be queued on the same smtp connection
    
    // or instead of using the built-in client you can create an instance of 'smtp.SMTPConnection'
    

























//     const { email, asunto, mensaje } = req.body;
// async function main() {

//     let testAccount = await nodemailer.createTestAccount();

//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: testAccount.user, // generated ethereal user
//       pass: testAccount.pass, // generated ethereal password
//     },
//   });

//   // send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   console.log("Message sent: %s", info.messageId);
//   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//   // Preview only available when sending through an Ethereal account
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
// }
// main().catch(console.error);
};

const ubicacion = async(req, res) => {
    const { ubicacion } = req.body;
    res.redirect(`/?ubicacion=${ubicacion}&elegida=yes`)
};
module.exports = {
    contactPagina: contactPagina,
    opciones: opciones,
    // get: get,
    autenticacion: authenticate,
    cerrarSesion: cerrarSesion,
    register: register,
    arduino: arduino,
    inicio: inicio,
    configuracion: configuracion,
    ubicacion: ubicacion,
    contact: contact,
    recibirDatos: recibirDatos
};