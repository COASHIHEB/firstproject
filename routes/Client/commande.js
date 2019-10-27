var express = require('express');
var app = express();
var router = express.Router();

var io = require("./../socket.js").io;
var server1 = require("./../socket.js").server1;
var server2 = require("./../socket.js").server2;






/**** Redirect l'admin no connecter  vert la page login ****/
const redirectCommandeLogin = (request, response, next) => {
    if (request.session.userType) {
        if (request.session.userType !== "client") {
            response.render('pages/client/Error/error', {});
        } else {
            next();
        }
    } else {
        response.redirect('/login');
    }
}

/* lien vert la pages commande d'un client */
router.get('/lancerCommande', redirectCommandeLogin, (request, responses) => {
    require("../../models/Client/commande").selectCommande(request.session.userId, (commande) => {
        responses.render('pages/client/commande/commande', { commande: commande.commande, devis: commande.devis });
    });
});



/* lien pour lancer la commande */
router.post('/lancerCommande', (request, response) => {
    require("../../models/Client/commande").lancerCommande(
        {
            idUser: request.session.userId,
            idCommande: request.body.idCommande,
            numero: request.body.numero,
            adress: request.body.adress
        }, (commande) => {
            if (commande.done = "done") {
                console.log("2# lancer commander")
                io.emit("getLocation", "client");
                response.json(
                    {
                        done: commande.done,
                        adress: commande.adress,
                        idUser: request.session.userid,
                        idCommande: request.body.idCommande
                    });
            }
        });
});









module.exports = router