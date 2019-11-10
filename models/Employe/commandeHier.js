var connexion = require('../../config/db');
var dateTime = require('../../config/moment').dateTime;



class commande {

    constructor(row) {
        this.row = row;
    }

    static selectCommande(CallBack) {
        connexion.query("SELECT commande.idCommande as idCommande,commande.dateCommande as dateCommande,commande.prixTotal as prixTotal,commande.statut as statut,offre.nom as nomOffre,utilisateur.nom as nomAdherent,utilisateur.prenom as prenomAdherent,utilisateur.email as emailAdherent,utilisateur.numTel as numTelAdherent,utilisateur.adresse as adresseAdherent FROM  commande LEFT JOIN commandeoffre ON commande.idCommande=commandeoffre.Commande_idCommande LEFT JOIN offre ON commandeoffre.Offre_idOffre = offre.idOffre Left join adherent ON commande.adherent_idadh = adherent.idadh LEFT JOIN utilisateur ON utilisateur.idUtil = adherent.utilisateur_idUtil where commande.statut='valide'", [], (err, rows) => {
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
                });
                CallBack(commandes);
            }

        });

    }


    static commandeAnnule(inputs, CallBack) {
        connexion.query(" insert into commandeAnnule (idCommande , description , idUser , par , dateAnnule) values ( ? , ? ,?,?,?)", [inputs.idCommande, inputs.description, inputs.idUser, inputs.par, dateTime], (err) => {
            if (err) {
                throw err;
                CallBack("error");
            }
            else {
                connexion.query("update commande set statut = 'annule' where idCommande = ?", [inputs.idCommande], (err) => {
                    if (err) {
                        throw err;
                        CallBack("error");
                    }
                    else {
                        CallBack("done");
                    }
                });
            }
        });
    }
}



module.exports = commande;