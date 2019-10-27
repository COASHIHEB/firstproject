var express = require('express');
var bodyParser = require('body-parser');
var app = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/valise', (request, response) => {
    let select = require("../../models/Admin/valise");
    select.selectProd((resp) => {
        produit = resp;
        select.selectValise((resp) => {
            valise = resp;
            response.render('pages/Admin/valise/valise', { produit: produit, valise: valise });
        })
    })
})


app.post('/addValise', (request, response) => {
    let addValise = require("../../models/Admin/valise");
    addValise.addValise(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/deletProduit', (request, response) => {
    let deletProduit = require("../../models/Admin/valise");
    deletProduit.deletProduit(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/ajoutQte', (request, response) => {
    let ajoutQte = require("../../models/Admin/valise");
    ajoutQte.ajoutQte(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/afficheProd', (request, response) => {
    let afficheProd = require("../../models/Admin/valise");
    afficheProd.afficheProd(request.body, (resp) => {
        response.json(resp);
    })
})


module.exports = app
