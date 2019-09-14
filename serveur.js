/**
 * Created by IHEB on 27/01/2018.
 */
var express = require('express');
var app = express(); //une déclaration et inistialisation du mosule Express
var bodyParser = require('body-parser');
var session = require('express-session');

/***  declaraion des sockets pour les messages ****/
const http = require('http').Server(app);
const io = require('socket.io')(http);

/****  secket traitement *****/
io.sockets.on('connection', function(socket) {
    socket.on('username', function() {
        socket.username = "session.userType";
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});



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

const stock = require('./routes/stock.js')
app.use(stock)


const achat = require('./routes/achat.js')
app.use(achat)


const employe = require('./routes/employe.js')
app.use(employe)


const profile = require('./routes/profile.js')
app.use(profile)


const auth = require('./routes/auth.js')
app.use(auth)

app.use(require('./routes/adherent.js'))

const categorie = require('./routes/categorie-sousCat.js')
app.use(categorie)

/** Fin Nos Routes **/

//app.listen(8083);
const server = http.listen(8083, function() {
    console.log('listening on *:8080');
});