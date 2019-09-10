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
        console.log(inputs);
        connexion.query("DELETE FROM adherent WHERE utilisateur_idUtil=?",[inputs.idUtil], (err, result)=>{
            if(err) {
                CallBack('error');
            }else { 
                if(inputs.statut === "client"){
                    connexion.query("DELETE FROM utilisateur WHERE idUtil=?",[inputs.idUtil], (err, result)=>{
                        if(err){
                            CallBack('error');
                        }else{
                          CallBack('done');
                        }
                    });
                }else{
                    CallBack('done');
                }
            }
        });
    }

  
        /******  Methode pour modifier un client ******/
    static updateAdherent(inputs,CallBack){
        connexion.query("UPDATE utilisateur SET  statut=? WHERE idUtil = ?",[inputs.statut, inputs.id], (err, result)=>{
            if(err) {
                CallBack('error');
            }else { 
                connexion.query("UPDATE adherent SET point=? WHERE utilisateur_idUtil = ?",[parseFloat(inputs.points), inputs.id], (err, reslt)=>{
                    if(err){
                        CallBack('error');
                    }else{
                        if(inputs.statut === "client"){
                            require("./employe").selectEmployer(inputs.id,(emp) => {
                                if(emp === 'exist'){
                                    require("./employe").deleteEmployer(inputs.id,(emp) => {
                                        if(emp === "done"){
                                            CallBack('done');
                                        }else{
                                            CallBack('error');
                                        }
                                    });
                                }else{
                                    CallBack('error');
                                }
                            });
                        }else if(inputs.statut === "employe"){
                            require("./employe").selectEmployer(inputs.id,(emp) => {
                                console.log(emp);
                                if(emp === 'done'){
                                    require("./employe").addEmployer(inputs.id,(emp) => {
                                        console.log(emp);
                                        if(emp === "done"){
                                            CallBack('done');
                                        }else{
                                            CallBack('error');
                                        }
                                    });
                                }else{
                                    CallBack('done');
                                }
                            });
                        }else{
                            CallBack('done');
                        }
                    }
                });
            }
        });
            
    }

}

module.exports = adherent;