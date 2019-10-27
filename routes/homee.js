var express = require('express');
var app = express();
var router = express.Router();


// const redirectLogin = (request, response) => {
//     if (!request.session.userType) {
//         response.redirect('/login');
//     } else {
//         if (request.session.userType === "Administrateur") {
//             return response.redirect('/dashboard-admin');
//         } else if (request.session.userType === "Employe") {
//             return response.redirect('/dashboard-employe');
//         } else {
//             return response.render('pages/Client/index', {});
//         }
//     }
// }




// /* lien vert la pages index générale du site */
// router.get('/', (request, response) => {
//     require("../models/Client/produit").selectProduits((resp) => {
//         require("../models/Client/image").selectAllImages((res) => {
//             response.render('pages/Client/index', { produits: resp, images: res });
//         });
//     });
// });



/* lien vert la pages index générale du site */
router.get('/', (request, response) => {
    require("../models/Client/produit").selectProduits((resp) => {
        require("../models/Client/image").selectAllImages((res) => {
            response.render('pages/Client/index', { produits: resp, images: res });
        });
    });
});


/* lien pour la page des produits*/
router.get('/articles', (request, response) => {
    require("../models/Client/produit").selectAllProduit((resp) => {
        require("../models/Client/image").selectAllImages((res) => {
            response.render('pages/Client/produits', { produits: resp, images: res });
        });
    });
});


/* lien pour afficher le détaille d'un produit*/
router.get('/produit', (request, response) => {
    if (typeof request.query.code === 'undefined') {
        response.render('pages/Error/error404', {});
    } else {
        require("../models/Client/produit").selectProduit(request.query.code, (resp) => {
            require("../models/Client/image").selectImages(request.query.code, (res) => {
                require("../models/Client/produit").selectProduitsParCategorie({ code: resp.idCat, id: request.query.code }, (rsp) => {
                    response.render('pages/Client/product', { produit: resp, images: res, produits: rsp });
                });
            });
        });
    }
});

/* lien pour recuperie les categories et les sous categories*/
router.post('/selecteCategories', (request, response) => {
    require("../../models/Client/categorie").selectCategories((resp) => {
        require("../../models/Client/produit").selectAllProduit((res) => {
            response.json({ categories: resp, produits: res });
        });
    });
});









module.exports = router