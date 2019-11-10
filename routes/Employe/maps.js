var express = require("express");
var router = express.Router();

var server2 = require('./../socket.js').server2;
var io = require('./../socket.js').io;

router.post("/changeLocation", (request, response) => {


    require("../../models/Employe/maps.js").changeLocation({
        longitude: request.body.longitude,
        latitude: request.body.latitude,
        id: request.session.userId,

    }, (resp) => {
        if (resp == 'done') {
            console.log("4# changer la location route done")
            server2.emit("getEmployeConnected", request.body.from);
            response.json(resp);
        }
    });

});





router.get("/getLastCommandeEmploye", (request, response) => {
    require("../../models/Employe/maps.js").getLastCommandeEmploye({
        id: request.session.userId
    }, (resp) => {
        console.log(resp)
        response.json(resp);
    });

});

router.post("/verifyIdEmploye", (request, response) => {
    require("../../models/Employe/maps.js").verifyIdEmploye({
        idCommande: request.body.idCommande,
        id: request.session.userId,
    }, (resp) => {
        response.json(resp);
    });

});


router.post("/recupererLesEmployesQuiOntRefuseCetteCommande", (request, response) => {
    require("../../models/Employe/maps.js").recupererLesEmployesQuiOntRefuseCetteCommande({
        idCommande: request.body.idCommande,
    }, (resp) => {
        console.log("recupererLesEmployesQuiOntRefuseCetteCommande")
        console.log(resp)
        response.json(resp);
    });

});


router.post("/verifyIdCommande", (request, response) => {
    require("../../models/Employe/maps.js").verifyIdCommande({
        idCommande: request.body.idCommande,
        id: request.session.userId,
    }, (resp) => {
        response.json(resp);
    });

});


router.post("/getAdresseCommande", (request, response) => {
    require("../../models/Employe/maps.js").getAdresseCommande({
        idCommande: request.body.idCommande,
    }, (resp) => {
        response.json(resp);
    });

});

router.post("/accepterUneNouvelleCommande", (request, response) => {
    // quand il click sur accepter une nouvelle commande on met l'update sur la table commande
    // on doit envoyer idCommande , idEmp , 
    require("../../models/Employe/maps.js").accepterUneNouvelleCommande({
        idCommande: request.body.idCommande,
        idUtil: request.session.userId,
        dateArrive: request.body.dateArrive
    }, (resp) => {
        console.log(resp)
        if (resp.statut = "done") {
            // envoyé la confirmation au client

            io.emit("sendConfiramtionToClient" + resp.idClient, request.body.idCommande);
            console.log("sendConfiramtionToClient" + resp.idClient)
            // io.emit("getLocation", "employe");
            response.json({ statut: resp.statut, idUtil: request.session.userId });
        }
    });
});


router.post("/refuserUneCommande", (request, response) => {
    require("../../models/Employe/maps.js").refuserUneCommande({
        idCommande: request.body.idCommande,
        idUtil: request.session.userId,
    }, (resp) => {
        if (resp = "done") {
            // on doit retransmettre la commande à un autre client
            io.emit("getLocation", "employeRefuseUneCommande" + request.session.userId);
            response.json(resp);
        }
    });

});

router.post("/recupererToutesLesCommandesEnAttentesDeCetEmploye", (request, response) => {
    require("../../models/Employe/maps.js").recupererToutesLesCommandesEnAttentesDeCetEmploye(request.session.userId, (resp) => {
        if (resp.statut = "done") {
            io.emit("getLocation", "employeRefuseUneCommande" + request.session.userId);
        }
        response.json(resp);
    });
});


router.get("/getIdUtil", (request, response) => {
    console.log(request.session.userId)
    response.json(request.session.userId);
});


router.post("/commandeAnnule", (request, response) => {
    let commande = require("../../models/Employe/commandeHier");
    commande.commandeAnnule({
        idUser: request.session.userId,
        idCommande: request.body.idCommande,
        description: request.body.description,
        par: request.session.userType
    }, (resp) => {
        response.json(resp);
    })
});



router.post("/clientAccepteSaCommande", (request, response) => {
    let commande = require("../../models/client/commande");
    commande.clientAccepteSaCommande({
        idCommande: request.body.idCommande,
    }, (resp) => {
        response.json(resp);
    })
});







module.exports = router;