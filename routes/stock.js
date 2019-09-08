var express = require('express');
var app = express.Router();


/* lien vers page stock */
app.get('/stock', (request, response) => {
    response.render('pages/admin/stock/stock', {});
})


/* Ajouter supprimé modifier et selectionner stock/produit */

app.get('/allStock', (request, response) => {
    let Stock = require('../models/Admin/stock')
    Stock.allStock((resp) => {
        response.json(resp);
    })
})

app.get('/stockBientotExpire', (request, response) => {
    let Stock = require('../models/Admin/stock')
    Stock.stockBientotExpire((resp) => {
        response.json(resp);
    })
})

app.get('/stockMinimum', (request, response) => {
    let Stock = require('../models/Admin/stock')
    Stock.stockMinimum((resp) => {
        response.json(resp);
    })
})

app.post('/deleteStock', (request, response) => {
    let Stock = require("../models/Admin/stock");
    Stock.deleteStock(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/updateStock', (request, response) => {
    let Stock = require("../models/Admin/stock");
    Stock.updateStock(request.body, (resp) => {
        response.json(resp);
    })
})
module.exports = app
/* Fin Ajouter supprimé modifier et selectionner stock/produit */