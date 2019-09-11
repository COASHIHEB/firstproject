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


/* lien vers page du liste des clients */
app.get('/client', redirectLogin, (request, response) => {
    require("../models/Admin/adherent").selectAdherent((resp) => {
        response.render('pages/Admin/adherent/adherent', {
            respo: resp,
       });
    });
});


/* Lien pour supprimer un clients*/
app.post('/deleteAdh', (request, response) => {
    require("../models/Admin/adherent").deleteAdherent(request.body, (resp) => {
        response.json(resp);
    });
});




module.exports = app