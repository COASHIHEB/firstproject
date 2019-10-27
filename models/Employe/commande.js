var connexion = require('../../config/db');


class commande {

    constructor(row) {
        this.row = row;
    }

    static selectCommande(inputs, CallBack) {
        var idEmp = inputs.idEmp;
        var statut = inputs.statut;
        connexion.query("SELECT commande.idCommande as idCommande,commande.dateCommande as dateCommande,commande.prixTotal as prixTotal,commande.statut as statut,offre.nom as nomOffre,utilisateur.nom as nomAdherent,utilisateur.prenom as prenomAdherent,utilisateur.email as emailAdherent,utilisateur.numTel as numTelAdherent,utilisateur.adresse as adresseAdherent, etoile FROM  commande LEFT JOIN commandeoffre ON commande.idCommande=commandeoffre.Commande_idCommande LEFT JOIN offre ON commandeoffre.Offre_idOffre = offre.idOffre Left join adherent ON commande.adherent_idadh = adherent.idadh LEFT JOIN utilisateur ON utilisateur.idUtil = adherent.utilisateur_idUtil LEFT JOIN feedbak ON feedbak.commandeoffre_id = commandeoffre.id where commande.statut=? and commande.Employe_idEmp=?", [statut, idEmp], (err, rows) => {
            if (err) throw err;
            else {
                let notificationMap = {};
                let commandes = [];
                rows.forEach(function (row) {
                    let commande = notificationMap[row.idCommande];
                    if (!commande) {
                        commande = {
                            idCommande: row.idCommande,
                            dateCommande: row.dateCommande,
                            prixTotal: row.prixTotal,
                            statut: row.statut,
                            nomAdherent: row.nomAdherent,
                            prenomAdherent: row.prenomAdherent,
                            emailAdherent: row.emailAdherent,
                            numTelAdherent: row.numTelAdherent,
                            adresseAdherent: row.adresseAdherent,
                            nomOffre: [],
                            etoile: [],
                        };
                        notificationMap[row.idCommande] = commande;
                        commandes.push(commande);
                    }
                    commande.nomOffre.push({
                        nomOffre: row.nomOffre,
                    });
                    commande.etoile.push({
                        etoile: row.etoile,
                    });
                });
                CallBack(commandes);
            }

        });

    }

}



module.exports = commande;