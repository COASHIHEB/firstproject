var express = require('express');
var router = express.Router();
var http = require("./../serveur.js").http;
var io = require("socket.io").listen(http);
var server1 = require("socket.io-client")('http://localhost:8100');
var server2 = require("socket.io").listen(8100);

/****  secket traitement *****/
// var io = require("socket.io")(http);
io.sockets.on("connection", function (socket) {
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
        server1.emit("message", data);
    });
});

// Server 1
server1.on("connect", function () {
    server1.on('message', function (data) {
        console.log("###################################################")
        console.log("Server 1 : get message from server 2: " + data)
    });
});

// Server 2
server2.sockets.on("connection", function (socket) {
    socket.on("message", function (data) {
        console.log("###################################################")
        console.log("Server 2 : get message from server 1: " + data)
        console.log("###################################################")
        console.log("server 2 : send message ")
        server2.emit("message", data);
    });
});

module.exports = router