var express = require('express');
var app = express.Router();

/**** Redirect l'utilisateur no connecter  vert la page login ****/
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

/* lien vers page achat */
app.get('/achat',redirectLogin, (request, response) => {
    response.render('pages/Admin/achat/achat', {});
})

/* Ajouter supprimé modifier et selectionner achat */
app.get('/allAchat',redirectLogin, (request, response) => {
    require('../models/Admin/achat').allAchat((resp) => {
        response.json(resp);
    })
})

app.get('/recentAchat',redirectLogin, (request, response) => {
    require('../models/Admin/achat').recentAchat((resp) => {
        response.json(resp);
    })
})



app.post('/addAchat', (request, response) => {
    require("../models/Admin/achat").addAchat(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/deleteAchat', (request, response) => {
    require("../models/Admin/achat").deleteAchat(request.body, (resp) => {
        response.json(resp);
    })
})



app.post('/updateAchat', (request, response) => {
    require("../models/Admin/achat").updateAchat(request.body, (resp) => {
        response.json(resp);
    })
})

/* Fin Ajouter supprimé modifier et selectionner stock/produit */
module.exports = app
/* Fin Ajouter supprimé modifier et selectionner stock/produit */