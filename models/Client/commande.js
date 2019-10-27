var connexion = require('../../config/db');
var moment = require('../../config/moment').dateTime;
let devis = require('../../config/devis');

class commande {

    //la methode pour afficher les commandes non validé
    static selectCommande(input, CallBack) {
        connexion.query("SELECT * FROM adherent WHERE utilisateur_idUtil=?", [input], (err, client) => {
            connexion.query("SELECT commande.*, offre.*,commandeoffre.id, photo.nom as image FROM commande LEFT JOIN commandeoffre ON commande.idCommande=commandeoffre.Commande_idCommande LEFT JOIN offre ON offre.idOffre=commandeoffre.Offre_idOffre LEFT JOIN photo ON offre.idOffre = photo.Offre_idOffre WHERE commande.statut = 'non valide' AND commande.adherent_idadh=? GROUP BY commandeoffre.id", [client[0].idadh], (err, commande) => {

                if (err) {
                    CallBack("error");
                } else {
                    CallBack({ commande, devis });
                }
            });
        });
    }

    //la methode pour lancer une commande
    static lancerCommande(inputs, CallBack) {
        if (inputs.adress != 'vide' && inputs.numero != 'vide') {
            connexion.query("UPDATE commande SET  statut = 'valide', dateCommande=?, adress = ?, numero =? WHERE (idCommande = ?)", [moment, inputs.adress, inputs.numero, inputs.idCommande], (err, commande) => {
                if (err) {
                    CallBack("error");
                } else {
                    CallBack({ done: "done", adress: inputs.adress });
                }
            });
        } else {
            connexion.query("SELECT * FROM utilisateur WHERE idUtil =? ", [inputs.idUser], (err, user) => {
                if (err) {
                    CallBack("error");
                } else {
                    if (inputs.adress == 'vide') { inputs.adress = user[0].adresse; }
                    if (inputs.numero == 'vide') { inputs.numero = user[0].numTel; }
                    connexion.query("UPDATE commande SET  statut = 'valide', dateCommande=?, adress = ?, numero =? WHERE (idCommande = ?)", [moment, inputs.adress, inputs.numero, inputs.idCommande], (err, commande) => {
                        if (err) {
                            CallBack("error");
                        } else {
                            CallBack({ done: "done", adress: inputs.adress });
                        }
                    });
                }
            });
        }
    }


    //la methode pour supprimer une commande
    static deleteCommande(input, CallBack) {
        connexion.query("DELETE FROM commandeoffre WHERE Commande_idCommande= ?", [input], (err, deleted) => {
            if (err) {
                CallBack('error');
            } else {
                connexion.query("DELETE FROM commande WHERE (idCommande = ?)", [input], (err, update) => {
                    if (err) {
                        CallBack('error');
                    } else {
                        CallBack('done');
                    }
                });
            }
        });
    }


}



module.exports = commande;