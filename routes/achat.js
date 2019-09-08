var express = require('express');
var app = express.Router();


/* lien vers page achat */
app.get('/achat', (request, response) => {
    response.render('pages/Admin/achat/achat', {});
})

/* Ajouter supprimé modifier et selectionner achat */
app.get('/allAchat', (request, response) => {
    let Achat = require('../models/Admin/achat')
    Achat.allAchat((resp) => {
        response.json(resp);
    })
})

app.get('/recentAchat', (request, response) => {
    let Achat = require('../models/Admin/achat')
    Achat.recentAchat((resp) => {
        response.json(resp);
    })
})



app.post('/addAchat', (request, response) => {
    let Achat = require("../models/Admin/achat");
    Achat.addAchat(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/deleteAchat', (request, response) => {
    let Achat = require("../models/Admin/achat");
    Achat.deleteAchat(request.body, (resp) => {
        response.json(resp);
    })
})



app.post('/updateAchat', (request, response) => {
    let Achat = require("../models/Admin/achat");
    Achat.updateAchat(request.body, (resp) => {
        response.json(resp);
    })
})

/* Fin Ajouter supprimé modifier et selectionner stock/produit */
module.exports = app
/* Fin Ajouter supprimé modifier et selectionner stock/produit */