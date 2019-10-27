var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;
var bodyparser = require('body-parser');


class client {

    constructor(row) {
        this.row = row;
    }


    static selectClientCF(CallBack) {
        connexion.query("SELECT adherent.idadh,utilisateur.nom,utilisateur.prenom,utilisateur.email,utilisateur.numTel,utilisateur.adresse,adherent.point,adherent.code,count(idCommande) AS nbrCommande FROM utilisateur, adherent, commande WHERE utilisateur.idUtil = adherent.utilisateur_idUtil AND commande.adherent_idadh = adherent.idadh AND commande.statut = ? GROUP BY adherent.idadh ORDER BY adherent.idadh DESC ", ["faite"], (err, rows) => {
            if (err) throw err;
            else {
                let clients = [];
                rows.forEach(function (row) {
                    let client = {
                        idadh: row.idadh,
                        nom: row.nom,
                        prenom: row.prenom,
                        email: row.email,
                        numTel: row.numTel,
                        point: row.point,
                        code: row.code,
                        nbrCommande: row.nbrCommande,
                    };
                    clients.push(client);
                });
                CallBack(clients);
            }
        })
    }





    static selectClientCNF(CallBack) {
        connexion.query("SELECT adherent.idadh,utilisateur.nom,utilisateur.prenom,utilisateur.email,utilisateur.numTel,utilisateur.adresse,adherent.point,adherent.code,count(idCommande) AS nbrCommande FROM utilisateur, adherent, commande WHERE utilisateur.idUtil = adherent.utilisateur_idUtil AND commande.adherent_idadh = adherent.idadh AND commande.statut = ? GROUP BY adherent.idadh ORDER BY adherent.idadh DESC ", ["non faite"], (err, rows) => {
            if (err) throw err;
            else {
                let clients = [];
                rows.forEach(function (row) {
                    let client = {
                        idadh: row.idadh,
                        nom: row.nom,
                        prenom: row.prenom,
                        email: row.email,
                        numTel: row.numTel,
                        point: row.point,
                        code: row.code,
                        nbrCommande: row.nbrCommande,
                    };
                    clients.push(client);
                });
                CallBack(clients);
            }
        })
    }



    static selectClient(CallBack) {
        connexion.query("SELECT adherent.idadh,utilisateur.nom,utilisateur.prenom,utilisateur.email,utilisateur.numTel,utilisateur.adresse,adherent.point,adherent.code,count(idCommande) AS nbrCommande FROM utilisateur, adherent, commande WHERE utilisateur.idUtil = adherent.utilisateur_idUtil AND commande.adherent_idadh = adherent.idadh  GROUP BY adherent.idadh ORDER BY adherent.idadh DESC ", [], (err, rows) => {
            if (err) throw err;
            else {
                let clients = [];
                rows.forEach(function (row) {
                    let client = {
                        idadh: row.idadh,
                        nom: row.nom,
                        prenom: row.prenom,
                        email: row.email,
                        numTel: row.numTel,
                        point: row.point,
                        code: row.code,
                        nbrCommande: row.nbrCommande,
                    };
                    clients.push(client);
                });
                CallBack(clients);
            }
        })
    }


}


module.exports = client;