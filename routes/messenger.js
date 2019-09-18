var express = require('express');
var app = express.Router();


/*****   lien pour afficher les contactes et les notificatons *****/
app.post('/contacts', (request, response) => {
    console.log(request.body)
    /*****   lien pour afficher les contactes *****/
    require("../models/messenger/messenger").selectContacts(request.session.userId, (contact) => {
        console.log(contact)

        /*****   lien pour afficher les notificatons *****/
        require("../models/messenger/messenger").notification(request.session.userId, (notf) => {
            console.log(notf)

            response.json({ contacts: contact, notifications: notf, userId: request.session.userId });
        });
    });
});

/*****   lien pour afficher les messages d'un contacts  *****/
app.post('/messages', (request, response) => {
    require("../models/messenger/messenger").selectMessages({ idEm: request.body.id, idRcp: request.session.userId }, (resp) => {
        /*****   lien pour afficher les notificatons *****/
        require("../models/messenger/messenger").notification(request.session.userId, (notf) => {
            response.json({ messages: resp.messages, notifications: notf, contactName: resp.name, userId: request.session.userId });
        });
    });
});

/*****   lien pour ajouter un nouveau message  *****/
app.post('/message', (request, response) => {
    require("../models/messenger/messenger").addMessage({ idEm: request.session.userId, idRcp: request.body.id, msg: request.body.msg }, (resp) => {
        response.json(resp);
    });
});

/*****   lien pour fait vu tous les message non lu  *****/
app.post('/viewAll', (request, response) => {
    require("../models/messenger/messenger").viewAll(request.session.userId, (resp) => {
        response.json({ msg: resp, userId: request.session.userId });
    });
});



module.exports = app

