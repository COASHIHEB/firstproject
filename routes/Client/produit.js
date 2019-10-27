var express = require('express');
var app = express();
var router = express.Router();


/* lien pour la page des produits*/
router.get('/articles', (request, response) => {
    require("../../models/Client/produit").selectAllProduit((resp) => {
        require("../../models/Client/image").selectAllImages((res) => {
            response.render('pages/Client/produits/produits', {produits : resp.produits, devis : resp.devis, images: res});
        });
    });
});


/* lien pour afficher le détaille d'un produit*/
router.get('/produit', (request, response) => {
    if(typeof request.query.code === 'undefined'){
        response.render('pages/Error/error404', {});
    }else{
        require("../../models/Client/produit").selectProduit(request.query.code,(resp) => {
            require("../../models/Client/image").selectImages(request.query.code,(res) => {
                require("../../models/Client/produit").selectProduitsParCategorie({code : resp.idCat, id : request.query.code},(rsp) => {
                  response.render('pages/Client/produit/product', {produit : resp.produit, devis : resp.devis, images: res, produits:rsp.produits});
                });
            });
        });
    }
});

/* lien pour recuperie les categories et les sous categories*/
router.post('/selecteCategories', (request, response) => {
    require("../../models/Client/categorie").selectCategories((resp) => {
        require("../../models/Client/produit").selectAllProduit((res) => {
            response.json({categories : resp , produits : res.produits, devis : res.devis});
        });
    });
});


module.exports = router