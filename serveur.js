/**
 * Created by IHEB on 27/01/2018.
 */
var express = require('express');
var app = express(); //une déclaration et inistialisation du mosule Express
var bodyParser = require('body-parser');
var session = require('express-session');



/** Moteur de Tamplate **/

app.set('view engine', 'ejs'); //déclarer une viex AngularJS

/** MidellWare **/

//app.use('/assets',express.static("public")) //pour protéger les fichier public
app.use(express.static("public"));

//partie bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
//fin partie bodyParser

//Partie Session
app.use(session({
    secret: "retgerghr",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));
//Création d'un nouveau Midleware
app.use(require("./middlewares/flash"));
//Fin Partie session  !cookie: {secure: false} false car on utilise pas le protocole https


/** Nos Routes **/


app.use(require('./routes/stock.js'))

app.use(require('./routes/achat.js'))

app.use( require('./routes/employe.js'))

app.use(require('./routes/profile.js'))

app.use(require('./routes/auth.js'))

app.use(require('./routes/adherent.js'))

app.use(require('./routes/categorie-sousCat.js'))


/** Fin Nos Routes **/

app.listen(8083);
