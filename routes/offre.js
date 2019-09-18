var express = require('express');
var bodyParser = require('body-parser');
var app = express.Router()
const fileUpload = require('express-fileupload');
app.use(fileUpload());



app.get('/offre', (request, response) => {
    let select = require("../models/Admin/offre");
    select.selectCategorie((resp)=>{
        categorieSelect = resp;
        select.selecsousCategorie((resp)=>{
            sousCat = resp;
            select.selectProduit((respo)=>{
                produit = respo;
                select.selectOffre((resp)=>{
                    offre = resp;
                    select.selectOffreRec((resp)=>{
                        offreRec = resp;
                        response.render('pages/Admin/offre/offre', {categorie: categorieSelect, produit:produit, sousCat:sousCat, offreRec:offreRec, offre: offre});
                    })
                })
            })
        })
    })
})


app.post('/addOffre', (request, response) => { 
    let album = [];
    let error = 0;
    let image;
    let images = request.files.post_file;
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var sec =today.getTime()
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '-' + mm + '-' + yyyy+'-'+sec;
    let nameImage ;
    if(images.length)
    {
        for(let i=0; i< images.length; i++){
            nameImage = images[i].name.split(".");
            album[i] = nameImage[0] + "_" + today + "." + nameImage[1];
            image = request.files.post_file[i];
            image.mv("public/images/offre/" +album[i], function (err) {
                if (err) error =1;
            });
        }
    }
    else if(typeof images.length == "undefined" )
    {
        nameImage = images.name.split(".");
        album[0]=nameImage[0] + "_" + today + "." + nameImage[1];
        image = request.files.post_file;
        image.mv("public/images/offre/" +album[0], function (err) {
            if (err) error =1;
        });
        
    }
    if(error) response.json("error");
    else {
        let Offre = require('../models/Admin/offre')
        Offre.addOffre({
            data: request.body,
            nameImages: album
        }, (res) => {
            response.json(res);
        })
    }
})


app.post('/selectSousCat', (request, response) => { 
    let selectSousCat = require("../models/Admin/offre");
    selectSousCat.selectSousCat(request.body, (resp) => {
        response.json(resp);
    })
})

app.post('/selectSousCatModif', (request, response) => { 
let selectSousCatModif = require("../models/Admin/offre");
selectSousCatModif.selectSousCatModif(request.body, (resp) => {
    response.json(resp);
})
})


app.post('/selectOffre', (request, response) => { 
    let selectOffre = require("../models/Admin/offre");
    selectOffre.selectOffre( (resp) => {
        response.json(resp);
    })
})



app.post('/SelectPhoto', (request, response) => { 
    let SelectPhoto = require("../models/Admin/offre");
    SelectPhoto.SelectPhoto(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/deleteOffre', (request, response) => { 
    let deleteOffre = require("../models/Admin/offre");
    deleteOffre.deleteOffre(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/modifierOffre', (request, response) => { 
    let modifierOffre = require("../models/Admin/offre");
    modifierOffre.modifierOffre(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/supprimerPhoto', (request, response) => { 
    let supprimerPhoto = require("../models/Admin/offre");
    supprimerPhoto.supprimerPhoto(request.body, (resp) => {
        response.json(resp);
    })
})


app.post('/deletProduitOffre', (request, response) => { 
    let deletProduitOffre = require("../models/Admin/offre");
    deletProduitOffre.deletProduitOffre(request.body, (resp) => {
        response.json(resp);
    })
})




app.post('/addPhoto', (request, response) => { 
    let album = [];
    let error = 0;
    let image;
    let images = request.files.post_file;
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var sec =today.getTime()
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '-' + mm + '-' + yyyy+'-'+sec;
        let nameImage ;


        if(images.length)
        {
            for(let i=0; i< images.length; i++){
                nameImage = images[i].name.split(".");
                album[i] = nameImage[0] + "_" + today + "." + nameImage[1];
                image = request.files.post_file[i];
                image.mv("public/images/offre/" +album[i], function (err) {
                    if (err) error =1;
                });
            }
        }
        else if(typeof images.length == "undefined" )
        {
            nameImage = images.name.split(".");
            album[0]=nameImage[0] + "_" + today + "." + nameImage[1];
            image = request.files.post_file;
            image.mv("public/images/offre/" +album[0], function (err) {
                if (err) error =1;
            });
            
        }
    if(error) response.json("error");
    else {
        let Offre = require('../models/Admin/offre')
        Offre.addPhoto({
            data: request.body,
            nameImages: album
        }, (res) => {
            response.json(res);
        })
    }
})


module.exports = app