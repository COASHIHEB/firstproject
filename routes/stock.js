var express = require('express');
var app = express.Router();


/**** Redirect l'admin no connecter  vert la page login ****/
const redirectLogin = (request, response, next) => {
    if (!request.session.userType) {
        response.redirect('/login');
    } else {
        if (request.session.userType === "Administrateur") {
            next();
        } else if (request.session.userType === "employe") {
            response.redirect('/home');
        } else {
            response.redirect('/');
        }
    }
}

/* lien vers page stock */
app.get('/stock', redirectLogin, (request, response) => {
    response.render('pages/admin/stock/stock', {});
})


/* Ajouter supprimé modifier et selectionner stock/produit */

app.get('/allStock', redirectLogin, (request, response) => {
    let Stock = require('../models/Admin/stock')
    Stock.allStock((resp) => {
        response.json(resp);
    })
})

app.get('/stockBientotExpire', redirectLogin, (request, response) => {
    let Stock = require('../models/Admin/stock')
    Stock.stockBientotExpire((resp) => {
        response.json(resp);
    })
})

app.get('/stockMinimum', redirectLogin,(request, response) => {
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