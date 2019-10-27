var express = require('express');
var app = express()


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

app.get('/offre', redirectLogin, (request, response) => {
    let select = require("../../models/Admin/offre");
    offre.selectCategorie((resp) => {
        categorieSelect = resp;
        offre.selecsousCategorie((resp) => {
            sousCat = resp;
            offre.selectProduit((respo) => {
                produit = respo;
                offre.selectOffre((resp) => {
                    offre = resp;
                    offre.selectOffreRec((resp) => {
                        offreRec = resp;
                        offre.selectSousCatOffre((resp) => {
                            sousCateg = resp;
                            response.render('pages/Admin/offre/offre', { categorie: categorieSelect, produit: produit, sousCat: sousCat, offreRec: offreRec, offre: offre, sousCateg: sousCateg });
                        })
                    })
                })
            })
        })
    })
})


app.post('/addOffre', redirectLogin, (request, response) => {
    if (request.files) {
        let album = [];
        let error = 0;
        let image;
        let images = request.files.post_file;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var sec = today.getTime()
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '-' + mm + '-' + yyyy + '-' + sec;
        let nameImage;
        if (images.length) {
            for (let i = 0; i < images.length; i++) {
                nameImage = images[i].name.split(".");
                album[i] = nameImage[0] + "_" + today + "." + nameImage[1];
                image = request.files.post_file[i];
                image.mv("public/images/offre/" + album[i], function (err) {
                    if (err) error = 1;
                });
            }
        }
        else if (typeof images.length == "undefined") {
            nameImage = images.name.split(".");
            album[0] = nameImage[0] + "_" + today + "." + nameImage[1];
            image = request.files.post_file;
            image.mv("public/images/offre/" + album[0], function (err) {
                if (err) error = 1;
            });

        }
        if (error) response.json("error");
        else {
            let Offre = require('../../models/Admin/offre')
            Offre.addOffre({
                data: request.body,
                nameImages: album
            }, (res) => {
                response.json(res);
            })
        }
    } else {
        response.json("null");
    }
})


app.post('/selectSousCat', redirectLogin, (request, response) => {
    let selectSousCat = require("../../models/Admin/offre");
    selectSousCat.selectSousCat(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/selectSousCatModif', redirectLogin, (request, response) => {
    let selectSousCatModif = require("../../models/Admin/offre");
    selectSousCatModif.selectSousCatModif(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/selectOffre', redirectLogin, (request, response) => {
    let selectOffre = require("../../models/Admin/offre");
    selectOffre.selectOffre((resp) => {
        response.json(resp);
    })
})



app.post('/SelectPhoto', redirectLogin, (request, response) => {
    let SelectPhoto = require("../../models/Admin/offre");
    SelectPhoto.SelectPhoto(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/deleteOffre', redirectLogin, (request, response) => {
    let deleteOffre = require("../../models/Admin/offre");
    deleteOffre.deleteOffre(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/modifierOffre', redirectLogin, (request, response) => {
    let modifierOffre = require("../../models/Admin/offre");
    modifierOffre.modifierOffre(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/supprimerPhoto', redirectLogin, (request, response) => {
    let supprimerPhoto = require("../../models/Admin/offre");
    supprimerPhoto.supprimerPhoto(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/deletProduitOffre', redirectLogin, (request, response) => {
    let deletProduitOffre = require("../../models/Admin/offre");
    deletProduitOffre.deletProduitOffre(request.body, (resp) => {
        response.json(resp);
    })
})




app.post('/addPhoto', redirectLogin, (request, response) => {
    if (request.files) {
        let album = [];
        let error = 0;
        let image;
        let images = request.files.post_file;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var sec = today.getTime()
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '-' + mm + '-' + yyyy + '-' + sec;
        let nameImage;


        if (images.length) {
            for (let i = 0; i < images.length; i++) {
                nameImage = images[i].name.split(".");
                album[i] = nameImage[0] + "_" + today + "." + nameImage[1];
                image = request.files.post_file[i];
                image.mv("public/images/offre/" + album[i], function (err) {
                    if (err) error = 1;
                });
            }
        }
        else if (typeof images.length == "undefined") {
            nameImage = images.name.split(".");
            album[0] = nameImage[0] + "_" + today + "." + nameImage[1];
            image = request.files.post_file;
            image.mv("public/images/offre/" + album[0], function (err) {
                if (err) error = 1;
            });

        }
        if (error) response.json("error");
        else {
            let Offre = require('../../models/Admin/offre')
            Offre.addPhoto({
                data: request.body,
                nameImages: album
            }, (res) => {
                response.json(res);
            })
        }
    }
    else {
        response.json("null");
    }
})


module.exports = app