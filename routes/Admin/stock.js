var express = require('express');
var app = express.Router();


/**** Redirect l'admin no connecter  vert la page login ****/
const redirectLogin = (request, response, next) => {
    if (!request.session.userType) {
        response.redirect('/login');
    } else {
        if (request.session.userType === "Administrateur") {
            next();
        } else if (request.session.userType === "Employe") {
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
    require('../../models/Admin/stock').allStock((resp) => {
        response.json(resp);
    })
})

app.get('/stockBientotExpire', redirectLogin, (request, response) => {
    require('../../models/Admin/stock').stockBientotExpire((resp) => {
        response.json(resp);
    })
})

app.get('/stockMinimum', redirectLogin, (request, response) => {
    require('../../models/Admin/stock').stockMinimum((resp) => {
        response.json(resp);
    })
})

app.post('/deleteStock', (request, response) => {
    require("../../models/Admin/stock").deleteStock(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/updateStock', (request, response) => {
    require("../../models/Admin/stock").updateStock(request.body, (resp) => {
        response.json(resp);
    })
})
module.exports = app
/* Fin Ajouter supprimé modifier et selectionner stock/produit */