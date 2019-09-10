var express = require('express');
var app = express.Router();



/* lien vers page du liste des clients */
app.get('/client', (request, response) => {
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

/* Lien pour modifier un clients*/
app.post('/updateAdh', (request, response) => {
   require("../models/Admin/adherent").updateAdherent(request.body, (resp) => {
        response.json(resp);
    });
});


module.exports = app