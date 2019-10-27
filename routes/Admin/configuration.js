var express = require('express');
var app = express();
var router = express.Router();

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


router.get('/configuration', redirectLogin, (request, response) => {
    require("../../models/Admin/configuration").getSlides((slides) => {
        require("../../models/Admin/configuration").getOffre((offres) => {
            response.render('pages/Admin/Configuration/configuration', { slides: slides, offres: offres });
        })
    })
})



router.post('/addNewSlide', redirectLogin, (request, response) => {
    if (request.files) {
        let album = [];
        let error = 0;
        let image = request.files.post_file;
        let nameImage = image.name.split(".");

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
        nameImage = nameImage[0].replace(/\s/g, '') + "_" + today + "." + nameImage[1];

        image.mv("public/images/slides/" + nameImage, function (err) {
            if (err) request.json("error");
            else {
                let configuration = require("../../models/Admin/configuration");
                configuration.addNewSlide(
                    {
                        data: request.body,
                        namePicture: nameImage
                    },
                    (res) => {
                        response.json(res);
                    }
                );
            }
        });
    } else {
        response.json("null");
    }
})

router.post('/deleteSlide', redirectLogin, (request, response) => {
    let configuration = require("../../models/Admin/configuration");
    configuration.deleteSlide(request.body, (resp) => {
        response.json(resp);
    })
})


router.post('/updateSlide', redirectLogin, (request, response) => {
    let configuration = require("../../models/Admin/configuration");
    configuration.updateSlide(request.body, (resp) => {
        response.json(resp);
    })
})



module.exports = router