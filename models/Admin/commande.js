var connexion = require('../../config/db');
var moment = require('../../config/moment');

class commande{

    /***** methode pour affiché les commandes *****/
    static selectCommande(CallBack){
        connexion.query("SELECT commande.* FROM adherent, commande WHERE adherent.idadh = commande.adherent_idadh ",[], (err, commandes)=>{
            if (err) {
                CallBack('error'); 
            }else{
                for (let index = 0; index < commandes.length; index++) {
                    commandes[index].dateCommande = moment(commandes[index].dateCommande).format('YYYY-MM-DD'); 
                }
                CallBack(commandes);
            }
        });
    }

    /***** methode pour supprimer les commandes d'un clients *****/
    static deleteClientCommande(input,CallBack){
        connexion.query("DELETE FROM commande WHERE adherent_idadh=?",[input], (err, result)=>{
            if (err) {
                CallBack('error'); 
            }else{
                CallBack('donne');
            }
        });
    }

}

module.exports = commande;