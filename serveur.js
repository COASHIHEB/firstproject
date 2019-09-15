/**
 * Created by IHEB on 27/01/2018.
 */
var express = require('express');
var app = express(); //une déclaration et inistialisation du mosule Express
var bodyParser = require('body-parser');
var session = require('express-session');

/***  declaraion des sockets pour les messages ****/
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

/****  secket traitement *****/
io.sockets.on('connection', function(socket) {

    socket.on('username', function(id) {
        console.log('connected');
        socket.userid = id ;
        console.log(socket.userid);
        io.emit('is_online', socket.userid);
    });

    socket.on('disconnect', function() {
        io.emit('is_not_online', socket.userid);
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});


/** Nos Routes **/


app.use(require('./routes/stock.js'))

app.use(require('./routes/achat.js'))

app.use( require('./routes/employe.js'))

app.use(require('./routes/profile.js'))

app.use(require('./routes/auth.js'))

app.use(require('./routes/adherent.js'))

app.use(require('./routes/categorie-sousCat.js'))

app.use(require('./routes/messenger.js'))

/** Fin Nos Routes **/



const serve = http.listen(8083);
