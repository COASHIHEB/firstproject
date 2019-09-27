var express = require('express');
var app = express();
var router = express.Router();


/**** Redirect l'admin no connecter  vert la page login ****/
const redirectLogin = (request, response) => {
    console.log(request.sessionID)

    if (!request.session.userType) {
        response.redirect('/login');
    } else {
        if (request.session.userType === "Administrateur") {
            return response.render('pages/Admin/index', {});
        } else if (request.session.userType === "Employe") {
            return response.render('pages/Employee/index', {});
        } else {
            return response.render('pages/Client/index', {});
        }
    }
}


/* lien vert la pages idex d'admenistrateur */
router.get('/home', redirectLogin, (request, response) => {
    response.render('pages/Admin/index', {});
});

/* lien vert la pages index générale du site */
router.get('/', (request, response) => {
    require("../models/clients/produit").selectProduit((resp) => {
        require("../models/clients/image").selectImages((res) => {
           response.render('pages/Client/index', {produits : resp, images: res});
        });
    });
});

/* lien pour la page des produits*/
router.get('/articles', (request, response) => {
    require("../models/clients/produit").selectAllProduit((resp) => {
        require("../models/clients/image").selectImages((res) => {
            response.render('pages/Client/produits', {produits : resp, images: res});
        });
    });
});

/* lien pour recuperie les categories et les sous categories*/
router.post('/selecteCategories', (request, response) => {
    require("../models/clients/categorie").selectCategories((resp) => {
        require("../models/clients/produit").selectAllProduit((res) => {
            response.json({categories : resp , produits : res});
        });
    });
});









module.exports = router