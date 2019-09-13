var express = require('express');
var app = express.Router();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(require("../middlewares/flash"));







app.post('/updatePictureProfile', function (req, res) {
    if (req.files) {
        // The name of the input field (i.e. "pictureFile") is used to retrieve the uploaded file
        let image = req.files.post_file;
        let nameImage = image.name.split(".");
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = dd + '-' + mm + '-' + yyyy;
        nameImage = nameImage[0] + "_" + today + "." + nameImage[1]


        image.mv("public/images/profilePicture/" + nameImage, function (err) {
            if (err)
                res.json("error");
            else {
                let Profile = require('../models/Admin/profile')
                req.session.userId = 11;
                Profile.updateProfilePicture({
                    userId: req.session.userId,
                    nameImage: nameImage
                }, (response) => {
                    res.json(response);
                })
            }
        });
    } else {
        res.json('null');
    }
});


/* lien vers page profil */
app.get('/profile', (request, response) => {
    response.render('pages/Admin/profile/profile', {});
});



/*  */
app.get('/getUtilisateur', (request, response) => {
    request.session.userId = 11;
    let Profile = require('../models/Admin/profile')
    Profile.getUtilisateur(request.session.userId, (resp) => {
        response.json(resp);
    })
})

app.post('/updateUtilisateur', (request, response) => {
    request.session.userId = 11;
    let Profile = require('../models/Admin/profile')
    Profile.updateUtilisateur({
        userId: request.session.userId,
        user: request.body
    }, (resp) => {
        response.json(resp);
    })
})

app.post('/updatePassword', (request, response) => {
    request.session.userId = 11;
    let Profile = require('../models/Admin/profile')
    Profile.updatePassword({
        userId: request.session.userId,
        user: request.body
    }, (resp) => {
        response.json(resp);
    })
})



module.exports = app