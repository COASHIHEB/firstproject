var express = require('express');
var app = express.Router();


/**** recuperie la bibeo nodemailer ****/
var nodemailer = require('nodemailer');
/**** création sur fichier serveur le transporteur qui sera capable d'envoyer notre email ****/
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'leilaguerrab82@gmail.com',
        pass: 'Guerrab22'
    }
});

/**** Redirect l'admin no connecter  vert la page login ****/
const redirectLogin = (request, response) => {
    if (!request.session.userType) {
        response.redirect('/login');
    } else {
        if (request.session.userType === "Administrateur") {
            return response.render('pages/Admin/index', {});
        } else if (request.session.userType === "employe") {
            return response.render('pages/Employee/index', {});
        } else {
            return response.render('pages/index', {});
        }
    }
}

/**** Redirect l'admin connecté  vert la page index ****/
const redirectHome = (request, response, next) => {
    if (request.session.userId) {
        if (request.session.userType === "Administrateur") {
            return response.render('pages/Admin/index', {});
        } else if (request.session.userType === "employe") {
            return response.render('pages/Employee/index', {});
        } else {
            return response.render('pages/index', {});
        }
    } else {
        next();
    }
}



/* lien vert la pages idex d'admenistrateur */
app.get('/home', redirectLogin, (request, response) => {
    response.render('pages/Admin/index', {});
});

/* lien vert la pages index pour client */
app.get('/', redirectLogin, (request, response) => {
    response.render('pages/index', {});
});


/*Lien vert la page d'authentification "Login" */
app.get('/login', redirectHome, (request, response) => {
    /** accéder à la page login */
    response.render('pages/authentification/login', {});
});

/*Lien vert la page d'authentification "Register" */
app.get('/register', redirectHome, (request, response) => {
    response.render('pages/clients/register/register', {});
});





/*login*/
app.post('/login', (request, response) => {
    require("../models/login").login(request.body, (resp) => {
        if (resp != "error") {
            const { userId} = request.session;
            const {userType } = request.session;
            request.session.userId = resp.id;
            request.session.userType = resp.statut;
        }
        response.json(resp);
    });
});
/* fin login*/


/* mot de passe oublier*/
app.post('/password', (request, response) => {
    require("../models/login").password(request.body.email, (resp) => {
        if (resp !== "error" && resp !== "nonModifier" && resp !== "NonValide") {
            /** si le compte bien enregistré */
            console.log(resp);
            transporter.sendMail({
                from: 'leilaguerrab82@gmail.com',
                to: request.body.email,
                subject: 'Nouveau mot de passe',
                text: "Votre nouveau mo de passe est  : " + resp
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
app.get('/validerEmail', redirectHome, (request, response) => {
    require("../models/clients/register").valider(request.query.code, (resp) => {
        if (resp === 'error') {
            response.render('pages/Error/error404', {});
        } else {
            response.redirect('login');
        }
    });
});
/** fin validé le compte d'utilisateur client */


/*enregistré un client*/
app.post('/register', (request, response) => {
    require("../models/clients/register").register(request.body, (resp) => {
        if (resp !== "error" && resp !== "exist" && resp !== "notInsert") {
            /** si le compte bien enregistré */
            transporter.sendMail({
                from: 'leilaguerrab82@gmail.com',
                to: request.body.email,
                subject: 'Nouveau mot de passe',
                html: "Cliqué ici pour valider votre compte : <b> <a href='http://localhost:8083/validerEmail?code=w15sm6148670wru" + resp.code + "f75sm9674503wmf" + resp.id + "l62sm12414351wml'> Cliqué ici </a> </b>"
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
/*fin enregistré un client*/



/* logout pour l'admin*/
app.get('/logout', (request, response) => {
    require("../models/user").disconnectUsre(request.session.userId, (resp) => {
        if(resp === "error"){
            return response.redirect('/home')
        }else{
            request.session.destroy(err => {
                if (err) {
                    return response.redirect('/home')
                }
            response.redirect('/login')
           });
        }
    });
});
/*fin logout pour l'admin*/





module.exports = app