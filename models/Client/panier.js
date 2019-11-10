var connexion = require('../../config/db');
let devis = require('../../config/devis');

var moment = require('../../config/moment').moment;
var dateTime = require('../../config/moment').dateTime;

class panier {

    //la methode pour afficher les commandes non validé
    static selectPanier(input, CallBack) {
        connexion.query("SELECT * FROM adherent WHERE utilisateur_idUtil=?", [input], (err, client) => {
            connexion.query("SELECT commande.*, offre.*,commandeoffre.id, photo.nom as image FROM commande LEFT JOIN commandeoffre ON commande.idCommande=commandeoffre.Commande_idCommande LEFT JOIN offre ON offre.idOffre=commandeoffre.Offre_idOffre LEFT JOIN photo ON offre.idOffre = photo.Offre_idOffre WHERE commande.statut = 'non valide' AND commande.adherent_idadh=? GROUP BY commandeoffre.id", [client[0].idadh], (err, commandes) => {

                if (err) {
                    CallBack("error");
                } else {
                    CallBack({ commandes, devis });
                }
            });
        });
    }


    static getNumberOfItem(input, CallBack) {
        connexion.query("select count(*) from offre", [client[0].idadh], (err, rows) => {
            if (err) {
                CallBack("error");
            } else {
                CallBack(rows);
            }
        });
    }

    //la methode pour ajouter un offre pour une commande
    static addOffre(inputs, CallBack) {
        connexion.query("SELECT * FROM adherent WHERE utilisateur_idUtil=?", [inputs.idUser], (err, client) => {
            connexion.query("SELECT * FROM commande WHERE commande.statut = 'non valide' AND commande.adherent_idadh=?", [client[0].idadh], (err, commande) => {
                if (err) {
                    CallBack("error");
                } else {
                    if (commande.length > 0) {
                        connexion.query("INSERT INTO commandeoffre (Commande_idCommande , Offre_idOffre) VALUES (?,?)", [commande[0].idCommande, inputs.idOffre], (err, offre) => {

                            /*connexion.query("INSERT INTO feedBack (Commande_idCommande , Offre_idOffre) VALUES (?,?)",[commande[0].idCommande, inputs.idOffre],(err,offre)=>{*/
                            if (err) {
                                CallBack('error');
                            } else {
                                connexion.query("UPDATE commande SET  prixTotal = ? WHERE (idCommande = ?)", [(parseFloat(commande[0].prixTotal) + parseFloat(inputs.prix)), commande[0].idCommande], (err, update) => {
                                    if (err) {
                                        CallBack('error');
                                    } else {
                                        CallBack('done');
                                    }
                                });
                            }
                            //});
                        });
                    } else {
                        connexion.query("INSERT INTO commande (dateCommande , prixTotal , statut , adherent_idadh) VALUES (?,?,?,?)", [dateTime, parseFloat(inputs.prix), 'non valide', client[0].idadh], (err, commande) => {
                            if (err) {
                                CallBack('error');
                            } else {
                                connexion.query("INSERT INTO commandeoffre (Commande_idCommande , Offre_idOffre) VALUES (?,?)", [commande.insertId, inputs.idOffre], (err, offre) => {
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
            });
        });
    }

    //la methode pour ajouter un offre pour une commande
    static deleteOffre(inputs, CallBack) {
        connexion.query("DELETE FROM commandeoffre WHERE id= ?", [inputs.id], (err, deleted) => {
            if (err) {
                CallBack('error');
            } else {
                if ((inputs.prixTotal - inputs.prix) > 0) {
                    connexion.query("UPDATE commande SET  prixTotal = ? WHERE (idCommande = ?)", [(inputs.prixTotal - inputs.prix), inputs.idCmd], (err, update) => {
                        if (err) {
                            CallBack('error');
                        } else {
                            CallBack('done');
                        }
                    });
                } else {
                    connexion.query("DELETE FROM commande WHERE (idCommande = ?)", [inputs.idCmd], (err, update) => {
                        if (err) {
                            CallBack('error');
                        } else {
                            CallBack('done');
                        }
                    });
                }
            }
        });
    }


}



module.exports = panier;