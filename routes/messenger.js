var express = require('express');
var app = express.Router();


/*****   lien pour afficher les contactes  *****/
app.post('/contacts', (request, response) => {
    require("../models/messenger/messenger").selectContacts(request.session.userId ,(resp) => {
        response.json({contacts : resp, userId : request.session.userId});
    });
});

/*****   lien pour afficher les messages d'un contacts  *****/
app.post('/messages', (request, response) => {
    require("../models/messenger/messenger").selectMessages({idEm : request.body.id , idRcp : request.session.userId },(resp) => {
        response.json({messages : resp.messages, contactName: resp.name});
    });
});

/*****   lien pour ajouter un nouveau message  *****/
app.post('/message', (request, response) => {
    require("../models/messenger/messenger").addMessage({idEm : request.session.userId , idRcp : request.body.id, msg : request.body.msg},(resp) => {
        response.json(resp);
    });
});



module.exports = app

