var express = require("express");
var app = express();
var router = express.Router();

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

/**** Redirect l'utilisateur no connecter  vert la page login ****/
const redirectLogin = (request, response, next) => {
    if (!request.session.userType) {
        response.redirect("/login");
    } else {
        if (request.session.userType === "Administrateur") {
            next();
        } else if (request.session.userType === "Employe") {
            response.redirect("/dashboard-employe");
        } else {
            response.redirect("/");
        }
    }
};

/* lien vert la pages idex d'admenistrateur */
router.get("/mails", redirectLogin, (request, response) => {
    require("../../models/Admin/mail").getMails(resp => {
        response.render("pages/Admin/mail/mail", { mails: resp });
    });
});


router.post("/deleteMail", redirectLogin, (request, response) => {
    require('../../models/Admin/mail').deleteMail(request.body, (resp) => {
        if (resp == "done") {
            response.json('done');
        } else {
            response.json('error');
        }
    });
});


router.get("/read-mail", redirectLogin, (request, response) => {
    require('../../models/Admin/mail').readMail(request.query.id, (resp) => {
        response.render("pages/Admin/mail/readMail", { mail: resp });
    });
});

router.post("/sendMail", redirectLogin, (request, response) => {
    transporter.sendMail({
        from: 'leilaguerrab82@gmail.com',
        to: 'anasmebarki1996@outlook.fr',
        subject: request.body.sujet,
        text: request.body.text,

    }, function (error, info) {
        if (error) {
            response.json('error');
        } else {
            response.json('done');
        }
    });
});


router.post("/sendMailLocal", (request, response) => {
    require('../../models/Admin/mail').sendMailLocal({ data: request.body, idClient: 11 }, (resp) => {
        if (resp == "done") {
            response.json('done');
        } else {
            response.json('error');
        }
    });
});


module.exports = router;
