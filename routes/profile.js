var express = require('express');
var app = express.Router();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(require("../middlewares/flash"));


/**** Redirect l'utilisateur no connecter  vert la page login ****/
const redirectLogin = (request, response, next) => {
    if (!request.session.userType) {
        response.redirect('/login');
    } else {
        if (request.session.userType === "Administrateur") {
            next();
        } else if (request.session.userType === "employe") {
            response.redirect('/home');
        } else {
            response.redirect('/');
        }
    }
}


/* lien vers page profil */
app.get('/profile', redirectLogin, (request, response) => {
    response.render('pages/Admin/profile/profile', {});
});



/*  */
app.get('/getUtilisateur', redirectLogin, (request, response) => {
    request.session.userId = 11
    require('../models/Admin/profile').getUtilisateur(request.session.userId, (resp) => {
        response.json(resp);
    })
})




app.post('/updatePictureProfile', redirectLogin, function (req, res) {
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



app.post('/updateUtilisateur', redirectLogin, (request, response) => {
    require('../models/Admin/profile').updateUtilisateur({
        userId: request.session.userId,
        user: request.body
    }, (resp) => {
        response.json(resp);
    })
})

app.post('/updatePassword', redirectLogin, (request, response) => {
    require('../models/Admin/profile').updatePassword({
        userId: request.session.userId,
        user: request.body
    }, (resp) => {
        response.json(resp);
    })
})



module.exports = app