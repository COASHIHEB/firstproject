var express = require('express');
var router = express.Router();
var http = require("./../serveur.js").http;
var io = require("socket.io").listen(http);
var server1 = require("socket.io-client")('http://192.168.1.55:8100');
var server2 = require("socket.io").listen(8100);

var connected = false;
/****  secket traitement *****/
// var io = require("socket.io")(http);
io.sockets.on("connection", function (socket) {
    connected = true;
    console.log(connected)


    socket.on("username", function (id) {
        socket.userid = id;
        io.emit("is_online", socket.userid);
    });

    socket.on("disconnect", function () {
        io.emit("is_not_online", socket.userid);
    });

    socket.on('notification', function (message, id, user, image) {
        io.emit('notification', message, id, user);
        io.emit('chat_message', message, user.idUtil, image);
    });


    socket.on("message", function (data) {
        console.log("###################################################")
        console.log("get message from client : " + data);
        console.log("###################################################")
        console.log("server 1 : send message ")
        // io.emit('makeAlert');
        server1.emit("message", data);
    });

    socket.on("envoyerLesEmployeProche", function (data) {
        // on recupere les employé les plus proches et on insert idCommande au premiers proche employé
        // on insert a la table commandeEnAttente les champs idCommande , idEmp , dateArrive
        require("../models/Employe/maps").ajouterUneCommandeEnAttente({
            idCommande: data[0].idCommande,
            idEmp: data[0].idEmp,
            dateArrive: data[0].dateArrive,
        }, (resp) => {
            // si la commande a été bien envoyé l'employé le plus proche => donc on envoie a l'employé pour recuperer la nouvelle commande qui est en attente
            if (resp = "done") {
                io.emit('notifieEmployeNouvelleCommandeEstInserer', data);
            }
        });
    });


    socket.on("demandeAnnuleParEmploye", function (data) {

    });

    // envoyer la nouvelle commande en attente a l'employé precis  
    socket.on("demandeAccepteParEmploye", function (data) {
        require("../models/Employe/maps").accepterUneNouvelleCommande(data[0], (resp) => {
            // quand l'employé accpete la commande en attente
        });
    });
});


// Server 1
server1.on("connect", function () {

    server1.on('getEmployeConnected', function (from) {
        console.log("5# getEmploye connected socket server 2")
        require("../models/Employe/maps").getEmployeConnected((resp) => {
            // resp contient idUser , long , latitu
            console.log("6# server 2 : sendLocation to client ")
            io.emit("sendLocation", resp, from);
        });

    });
});

// Server 2
server2.sockets.on("connection", function (socket) {
    console.log("server 2")

});

module.exports = { router, io, server1, server2 } 