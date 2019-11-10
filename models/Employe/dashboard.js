var connexion = require('../../config/db');


class dashboard {

    constructor(row) {
        this.row = row;
    }

    static selectCommande(inputs, CallBack) {
        var idEmp = inputs;
        connexion.query("SELECT idEmp from employe where utilisateur_idUtil = ? ", [idEmp], (err, rows) => {
            if (err) throw err;
            else {
                idEmp = rows[0].idEmp;
                console.log(idEmp)
                connexion.query("SELECT commande.idCommande, utilisateur.nom, utilisateur.prenom, utilisateur.numTel, utilisateur.idUtil, commande.adress, offre.nom AS nomOffre, offre.dure AS duree from commandeenattente , commande , commandeoffre , offre , adherent ,utilisateur where commandeenattente.idEmp = ? and commande.idCommande = commandeenattente.idCommande and commande.idCommande = commandeoffre.Commande_idCommande and commandeoffre.Offre_idOffre = offre.idOffre and commande.adherent_idadh = adherent.idadh and adherent.utilisateur_idUtil = utilisateur.idUtil ", [idEmp], (err, rows) => {
                    if (err) throw err;
                    else {
                        let notificationMap = {};
                        let commandes = [];
                        rows.forEach(function (row) {
                            let commande = notificationMap[row.idCommande];
                            if (!commande) {
                                commande = {
                                    idCommande: row.idCommande,
                                    nom: row.nom,
                                    prenom: row.prenom,
                                    numTel: row.numTel,
                                    adresse: row.adress,
                                    nomOffre: [],
                                };
                                notificationMap[row.idCommande] = commande;
                                commandes.push(commande);
                            }
                            commande.nomOffre.push({
                                nomOffre: row.nomOffre,
                                duree: row.duree,
                            });
                        });
                        CallBack(commandes);
                    }

                });
            }

        });



    }

}



module.exports = dashboard;