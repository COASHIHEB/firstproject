var connexion = require('../../config/db');
var moment = require('../../config/moment');

class adherent{
        /******  Methode pour afficher les clients ******/
    static selectAdherent(CallBack){
        connexion.query("SELECT * FROM utilisateur, adherent WHERE utilisateur.idUtil = adherent.utilisateur_idUtil ",[], (err, clients)=>{
            if (err) {
                CallBack('error'); 
            }else{
                require("./commande").selectCommande((commandes) => {
                    for (let index = 0; index < clients.length; index++) {
                        clients[index].date = moment(clients[index].date).format('YYYY-MM-DD'); 
                        let commande =[];
                        for (let i = 0; i < commandes.length; i++) {
                            if(clients[index].idadh === commandes[i].adherent_idadh){
                                commande.push(commandes[i]);
                            }
                        }
                        clients[index].nbrComd = commande.length; 
                        clients[index].commandes = commande;
                    }
                    CallBack(clients);
                });
            }
        });
    }

  
        /******  Methode pour supprimer un client ******/
    static deleteAdherent(inputs,CallBack){
        require("./commande").deleteClientCommande(inputs.idAdh,(rep) => {
            if(rep === 'error') {
                CallBack('error');
            }else { 
                console.log(inputs.idUtil);
                connexion.query("DELETE FROM adherent WHERE utilisateur_idUtil=?",[inputs.idUtil], (err, result)=>{
                    if(err) {
                        CallBack('error');
                    }else { 
                        connexion.query("DELETE FROM utilisateur WHERE idUtil=?",[inputs.idUtil], (err, result)=>{
                            CallBack('done');
                        });
                    }
                });
            }
        });
    }

}

module.exports = adherent;