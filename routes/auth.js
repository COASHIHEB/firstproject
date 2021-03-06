var express = require('express');
var app = express();
var router = express.Router();
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');

/**** création sur fichier serveur le transporteur qui sera capable d'envoyer notre email ****/
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leilaguerrab82@gmail.com',
        pass: 'Guerrab22'
    }
});

transporter.use('compile', hbs({
    viewEngine: 'express-handlebars',
    viewPath: './mail/'
}))







/**** Redirect l'admin connecté  vert la page index ****/
const redirectHome = (request, response, next) => {
    if (request.session.userId) {
        if (request.session.userType === "Administrateur") {
            return response.render('pages/Admin/dashboardAdmin', {});
        } else if (request.session.userType === "Employe") {
            return response.render('pages/Employe/dashboardEmploye', {});
        } else {
            return response.render('pages/index', {});
        }
    } else {
        next();
    }
}


/*Lien vert la page d'authentification "Login" */
router.get('/login', redirectHome, (request, response) => {
    /** accéder à la page login */
    response.render('pages/authentification/login', {});
});

/*Lien vert la page d'authentification "Register" */
router.get('/register', redirectHome, (request, response) => {
    response.render('pages/Client/register/register', {});
});





/*login*/
router.post('/login', (request, response) => {
    require("../models/login").login(request.body, (resp) => {
        if (resp != "error") {
            const { userId } = request.session;
            const { userType } = request.session;
            const { userName } = request.session;
            request.session.userId = resp.id;
            request.session.userType = resp.statut;
            request.session.userName = resp.name.toUpperCase();
        }
        response.json(resp);
    });
});
/* fin login*/


/* mot de passe oublier*/
router.post('/password', (request, response) => {
    require("../models/login").password(request.body.email, (resp) => {
        if (resp !== "error" && resp !== "nonModifier" && resp !== "NonValide") {
            /** si le compte bien enregistré */
            transporter.sendMail({
                from: 'leilaguerrab82@gmail.com',
                to: request.body.email,
                subject: 'Nouveau mot de passe',
                text: "Votre nouveau mo de passe est  : " + resp,
            }, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        response.json(resp);
    });
});
/* fin mot de passe oublier*/


/**  validé le compte d'utilisateur client */
router.get('/validerEmail', redirectHome, (request, response) => {
    require("../models/Client/register").valider(request.query.code, (resp) => {
        if (resp === 'error') {
            response.render('pages/Error/error404', {});
        } else {
            response.redirect('login');
        }
    });
});
/** fin validé le compte d'utilisateur client */


/*enregistré un client*/
router.post('/register', (request, response) => {
    require("../models/Client/register").register(request.body, (resp) => {
        if (resp !== "error" && resp !== "exist" && resp !== "notInsert") {
            /** si le compte bien enregistré */
            // transporter.sendMail({
            //     from: 'leilaguerrab82@gmail.com',
            //     to: request.body.email,
            //     subject: "Valiez votre compte s'il vous plait",
            //     template: 'register',
            //     context: {
            //         nom: request.body.nom + " " + request.body.prenom,
            //         code: resp.code,
            //         id: resp.id
            //     }

            // }, function (error, info) {
            //     if (error) {
            //         console.log(error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });
        }
        response.json(resp);
    });
});
/*fin enregistré un client*/



/* logout pour l'admin*/
router.get('/logout', (request, response) => {
    if (request.session.userId) {
        require("../models/user").disconnectUsre(request.session.userId, (resp) => {
            if (resp === "error") {
                return response.redirect('/home')
            } else {
                request.session.destroy(err => {
                    if (err) {
                        return response.redirect('/home')
                    }
                    response.clearCookie("SESS_NAME")
                    response.redirect('/login')
                });
            }
        });
    }
    response.redirect('/login')
});
/*fin logout pour l'admin*/





module.exports = router