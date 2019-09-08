var express = require('express');
var app = express.Router();


/* lien vers page profil */
app.get('/profile', (request, response) => {
    response.render('pages/Admin/profile/profile', {});
});


module.exports = app