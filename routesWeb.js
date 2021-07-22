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


    const user = await User.find({ username: nombre })
        .then(user => { return user[0] })
    let ubicacion = user.ubicacion;
    if (ubicacion == "none") {
        ubicacion = "configure su ubicacion"
    }
    console.log(ubicacion)

    let date = new Date()
    let direccion = "norte";
    res.render("index.ejs", { time: dataTemp, ubicacion: ubicacion, nombre: nombre, hours: date.getHours(), minutes: date.getMinutes(), humedad: dataHumi, direccion: direccion, sensacion: dataFeels, tempMax: dataTempMax })
    console.log(req.session.ip);
});

router.post('/register', async function(req, res) {
    const { username, password } = req.body;
    const user = new User({ username, password });

    user.save()
        .then(function(user) {
            req.session.ip = user._id;
            console.log("register id= " + user._id);
            req.session.nombre = username;
            console.log("register username= " + username);
            req.session.isAuth = true;
            res.status(200).redirect(301, `http://localhost:3000/opciones`);
        })
        .catch(error => { res.status(500).send(`ERRROR AL REGISTRAR EN EL USERNAME O CONTRASEÑA`); });

})

router.get('/cerrarSesion', async function(req, res) {
    try {
        await req.session.destroy()
        res.redirect(`http://localhost:3000/cuenta`);
    } catch (error) {
        console.log(error)
    }
});

router.post('/authenticate', async function(req, res) {
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
                        res.redirect(`http://localhost:3000/`);
                    } else {
                        res.status(500).send(`USUARIO Y/O CONTRASEÑA INCORRECTA`);
                    }
                })
            }
        })
        .catch(error => { res.status(500).send(`ERRROR AL REGISTRAR`); });


    // User.findOne({ username }, async function(err, user) {
    //     if (err) {
    //         res.status(500).send(`ERRROR AL REGISTRAR`);
    //     } else if (!user) {
    //         res.status(500).send(`EL USUARIO NO EXISTE`)
    //     } else {
    //         user.isCorrectPassord(password, async function(err, result) {
    //             if (err) {
    //                 res.status(500).send(`ERRROR AL AUTENTIFICAR`);
    //             } else if (result) {

    //                 let user = await User.find({ username: username });
    //                 let primero = user[0]
    //                 console.log(primero._id);
    //                 req.session.ip = primero._id;
    //                 console.log(req.session.ip);

    //                 req.session.isAuth = true;
    //                 req.session.nombre = username;
    //                 console.log(req.session.nombre);
    //                 res.redirect(`http://localhost:3000/`);
    //             } else {
    //                 res.status(500).send(`USUARIO Y/O CONTRASEÑA INCORRECTA`);
    //             }
    //         })
    //     }
    // })
})

router.get('/opciones', async(req, res) => {
    console.log("opciones ip= " + req.session.ip);
    res.render("opciones.ejs", {})
});


router.post('/configuracion', (req, res) => {
    const id = req.session.ip;
    console.log("configuracion ip= " + req.session.ip);

    User.findOneAndUpdate({ _id: id }, req.body, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log(`Se logro`);
        }
    });
    res.redirect(`http://localhost:3000/`)

});



module.exports = router;