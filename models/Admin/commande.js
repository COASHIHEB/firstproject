var connexion = require('../../config/db');
var moment = require('../../config/moment').moment;
var bodyparser = require('body-parser');


class commande {

    constructor(row) {
        this.row = row;
    }


    static selectCommande(CallBack) {

        connexion.query("SELECT utilisateur.nom AS nom, utilisateur.prenom AS prenom, commande.dateCommande AS date, commande.prixTotal AS prix,  commande.idCommande AS idCammande,  offre.nom AS nomOffre, feedbak.etoile AS etoile FROM  commande LEFT JOIN commandeoffre ON commande.idCommande=commandeoffre.Commande_idCommande LEFT JOIN offre ON commandeoffre.Offre_idOffre = offre.idOffre LEFT JOIN feedbak ON feedbak.commandeoffre_id= commandeoffre.id LEFT JOIN employe ON feedbak.Employe_idEmp = employe.idEmp LEFT JOIN utilisateur ON utilisateur.idUtil = employe.utilisateur_idUtil WHERE commande.statut = ? ORDER BY commande.idCommande DESC", ["faite"], funcEND);
        function funcEND(err1, rows, fields) {
            if (err1) throw err1;
            else {
                let notificationMap = {};
                let notifications = [];
                rows.forEach(function (row) {
                    let notificationContents = notificationMap[row.idCammande];
                    if (!notificationContents) {
                        notificationContents = {
                            idCammande: row.idCammande,
                            nom: row.nom,
                            prenom: row.prenom,
                            prix: row.prix,
                            date: moment(row.date).format('YYYY-MM-DD'),
                            nomOffre: [],
                            etoile: [],
                        };
                        notificationMap[row.idCammande] = notificationContents;
                        notifications.push(notificationContents);
                    }
                    notificationContents.nomOffre.push({
                        nomOffre: row.nomOffre,
                    });
                    notificationContents.etoile.push({
                        etoile: row.etoile,
                    });
                });
                CallBack(notifications);
            }
        }
    }



    static selectCommandeNonfaite(CallBack) {

        connexion.query("SELECT utilisateur.nom AS nom, utilisateur.prenom AS prenom, commande.dateCommande AS date, commande.prixTotal AS prix,  commande.idCommande AS idCammande,  offre.nom AS nomOffre FROM  commande LEFT JOIN commandeoffre ON commande.idCommande=commandeoffre.Commande_idCommande LEFT JOIN offre ON commandeoffre.Offre_idOffre = offre.idOffre  LEFT JOIN employe ON commande.Employe_idEmp = employe.idEmp LEFT JOIN utilisateur ON utilisateur.idUtil = employe.utilisateur_idUtil WHERE commande.statut = ? ORDER BY commande.idCommande DESC", ["non faite"], funcEND);
        function funcEND(err1, rows, fields) {
            if (err1) throw err1;
            else {
                let notificationMap = {};
                let notifications = [];
                rows.forEach(function (row) {
                    let notificationContents = notificationMap[row.idCammande];
                    if (!notificationContents) {
                        notificationContents = {
                            idCammande: row.idCammande,
                            nom: row.nom,
                            prenom: row.prenom,
                            prix: row.prix,
                            date: moment(row.date).format('YYYY-MM-DD'),
                            nomOffre: [],
                        };

                        notificationMap[row.idCammande] = notificationContents;
                        notifications.push(notificationContents);

                    }
                    notificationContents.nomOffre.push({
                        nomOffre: row.nomOffre,
                    });

                });
                CallBack(notifications);
            }
        }
    }


}


module.exports = commande;