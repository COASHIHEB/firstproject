var express = require('express');
var bodyParser = require('body-parser');
var app = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/categorie-sousCat', (request, response) => {
    response.render('pages/Admin/categorie-sousCat/categorie-sousCat', {});
})


app.post('/addCategorie', (request, response) => { 
    let addCategorie = require("../models/Admin/categorie");
    addCategorie.addCategorie(request.body, (resp) => {
        response.json(resp);
    })
})

module.exports = app
