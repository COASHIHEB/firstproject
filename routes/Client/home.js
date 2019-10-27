var express = require('express');
var app = express();
var router = express.Router();


/**** Redirect l'admin no connecter  vert la page login ****/
const redirectLogin = (request, response, next) => {
    if (!request.session.userType) {
        response.redirect('/login');
    } else {
        if (request.session.userType === "Administrateur") {
            return response.redirect('/dashboard-admin');
        } else if (request.session.userType === "Employe") {
            return response.redirect('/dashboard-client');
        } else {
            return response.render('pages/Client/index', {});
        }
    }
}



/* lien vert la pages index générale du site */
router.get('/', (request, response) => {
    require("../../models/Client/produit").selectProduits((resp) => {
        require("../../models/Client/image").selectAllImages((res) => {
            require("../../models/Admin/configuration").getSlides((slides) => {
                response.render('pages/Client/index',
                    {
                        produits: resp.produits,
                        devis: resp.devis,
                        images: res,
                        slides: slides,
                        statut: request.session.userType,
                        name: request.session.userName,
                    });
            });
        });
    });
});



module.exports = router













// var express = require('express');
// var app = express();
// var router = express.Router();

// /* lien vert la pages index générale du site */
// // router.get('/', (request, response) => {
// //     require("../../models/Client/produit").selectProduits((resp) => {
// //         require("../../models/Client/image").selectAllImages((res) => {
// //             require("../../models/Admin/configuration").getSlides((slides) => {
// //                 response.render('pages/Client/index', { produits: resp, images: res, slides: slides });
// //             });
// //         });
// //     });
// // });

// router.get('/', (request, response) => {
//     require("../../models/Client/produit").selectProduits((produits) => {
//         require("../../models/Client/image").selectAllImages((images) => {
//             require("../../models/Admin/configuration").getSlides((slides) => {
//                 response.render('pages/Client/index',
//                     {
//                         produits: produits.produits,
//                         devis: produits.devis,
//                         images: images,
//                         slides: slides,
//                         statut: request.session.userType,
//                         name: request.session.userName
//                     });
//             })
//         });
//     });
// });

// /* lien pour recuperie les categories et les sous categories*/
// router.post('/selecteCategories', (request, response) => {
//     require("../../models/Client/categorie").selectCategories((resp) => {
//         require("../../models/Client/produit").selectAllProduit((res) => {
//             response.json({ categories: resp, produits: res });
//         });
//     });
// });


// /* lien pour la page des produits*/
// router.get('/articles', (request, response) => {
//     require("../../models/Client/produit").selectAllProduit((resp) => {
//         require("../../models/Client/image").selectAllImages((res) => {
//             response.render('pages/Client/produits', { produits: resp, images: res });
//         });
//     });
// });


// /* lien pour afficher le détaille d'un produit*/
// router.get('/produit', (request, response) => {
//     if (typeof request.query.code === 'undefined') {
//         response.render('pages/Error/error404', {});
//     } else {
//         require("../../models/Client/produit").selectProduit(request.query.code, (resp) => {
//             require("../../models/Client/image").selectImages(request.query.code, (res) => {
//                 require("../../models/Client/produit").selectProduitsParCategorie({ code: resp.idCat, id: request.query.code }, (rsp) => {
//                     response.render('pages/Client/product', { produit: resp, images: res, produits: rsp });
//                 });
//             });
//         });
//     }
// });




// module.exports = router