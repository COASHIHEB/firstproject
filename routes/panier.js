var express = require('express');
var app = express.Router();


/*****   verefier s'il est connecter *****/
app.post('/panier', (request, response) => {
    if (request.session.userId) {
        require("../models/Client/panier").selectPanier(request.session.userId, (resp) => {
            response.json(resp);
        });
    } else {
        response.json("notConnected");
    }
});

/*****   lien pour ajouter un offre sur une commande *****/
app.post('/addItem', (request, response) => {
    if (request.session.userId) {
        require("../models/Client/panier").addOffre({ idOffre: request.body.id, prix: request.body.prix, idUser: request.session.userId }, (resp) => {
            response.json(resp);
        });
    } else {
        response.json("notConnected");
    }
});

/*****   lien pour supprimer un offre sur la commande *****/
app.post('/deleteItem', (request, response) => {
    if (request.session.userId) {
        require("../models/Client/panier").deleteOffre(request.body, (resp) => {
            response.json(resp);
        });
    } else {
        response.json("notConnected");
    }
});



module.exports = app
