var express = require("express");
var router = express.Router();

var server2 = require('./../socket.js').server2;

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

router.post("/verifyIdEmploye", (request, response) => {
    require("../../models/Employe/maps.js").verifyIdEmploye({
        idCommande: request.body.idCommande,
        id: request.session.userId,
    }, (resp) => {
        response.json(resp);
    });

});


router.post("/verifyIdClient", (request, response) => {
    require("../../models/Employe/maps.js").verifyIdClient({
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
    }, (resp) => {
        if (resp = "done") {
            //envoyé la confirmation au client 
            io.emit("sendConfiramtionToClient", request.body.idCommande);
            io.emit("getLocation", "employe");
            response.json({ statut: resp, idUtil: request.session.userId });
        }
    });

});


router.post("/refuserUneCommande", (request, response) => {
    // quand il click sur accepter une nouvelle commande on met l'update sur la table commande
    // on doit envoyer idCommande , idEmp , 
    require("../../models/Employe/maps.js").refuserUneCommande({
        idCommande: request.body.idCommande,
    }, (resp) => {
        if (resp = "done") {
            io.emit("getLocation", "employe");
            response.json(resp);
        }
    });

});








module.exports = router;