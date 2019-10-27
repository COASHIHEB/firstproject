var express = require('express');
var bodyParser = require('body-parser');
var app = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/commande', (request, response) => {
    let select = require("../../models/Admin/commande");
    select.selectCommande((resp) => {
        commande = resp;
        select.selectCommandeNonfaite((resp) => {
            commandeNonFaite = resp;
            response.render('pages/Admin/commande/commande', { commande: commande, commandeNonFaite: commandeNonFaite });
        })
    })
})


// app.post('/selectCommande', (request, response) => { 
//     let selectCommande = require("../models/Admin/commande");
//     selectCommande.selectCommande( (resp) => {
//         response.json(resp);
//     })
// })

// app.post('/addCategorie', (request, response) => { 
//     let addCategorie = require("../models/Admin/categorie");
//     addCategorie.addCategorie(request.body, (resp) => {
//         response.json(resp);
//     })
// })


module.exports = app
