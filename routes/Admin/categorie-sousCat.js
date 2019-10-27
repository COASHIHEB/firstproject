var express = require('express');
var bodyParser = require('body-parser');
var app = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/categorie-sousCat', (request, response) => {
    let select = require("../../models/Admin/categorie");
    select.selectategorie((resp) => {
        categorie = resp;
        response.render('pages/Admin/categorie-sousCat/categorie-sousCat', { categorie: categorie });
    })
})


app.post('/addCategorie', (request, response) => {
    let addCategorie = require("../../models/Admin/categorie");
    addCategorie.addCategorie(request.body, (resp) => {
        response.json(resp);
    })
})



app.post('/deletSousCat', (request, response) => {
    let deletSousCat = require("../../models/Admin/categorie");
    deletSousCat.deletSousCat(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/deleteCategorie', (request, response) => {
    let deleteCategorie = require("../../models/Admin/categorie");
    deleteCategorie.deleteCategorie(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/ModifierSousCat', (request, response) => {
    let ModifierSousCat = require("../../models/Admin/categorie");
    ModifierSousCat.ModifierSousCat(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/ModifierCat', (request, response) => {
    let ModifierCat = require("../../models/Admin/categorie");
    ModifierCat.ModifierCat(request.body, (resp) => {
        response.json(resp);
    })
})



app.post('/addSousCat', (request, response) => {
    let addSousCat = require("../../models/Admin/categorie");
    addSousCat.addSousCat(request.body, (resp) => {
        response.json(resp);
    })
})


module.exports = app
