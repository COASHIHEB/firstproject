var connexion = require('../../config/db');
var moment = require('../../config/moment');

class messenger{
        /******  Methode pour afficher les contacts ******/
    static selectContacts(input,CallBack){
        connexion.query("SELECT * FROM utilisateur WHERE (statut='Administrateur' OR statut='employe') AND idUtil <> ?",[input], (err, contacts)=>{
         
            if(err){
                CallBack('error');
            }else{
                CallBack(contacts);
            }
        });
    }

    
        /******  Methode pour afficher la liste des messages pour un contact ******/
    static selectMessages(inputs,CallBack){
        connexion.query("UPDATE tchat SET statut='lu' WHERE (idRecepteur =?) ",[inputs.idRcp], (err, statut)=>{
            if(err){
                CallBack('error');
            }else{
                connexion.query("SELECT * FROM tchat WHERE (idEmeteur=? AND idRecepteur=?) OR (idEmeteur=? AND idRecepteur=?) ORDER BY idtchat ASC",[inputs.idEm, inputs.idRcp, inputs.idRcp, inputs.idEm], (err, msg)=>{       
                    if(err){
                        CallBack('error');
                    }else{
                        connexion.query("SELECT * FROM utilisateur WHERE idUtil=?",[inputs.idEm], (err, user)=>{
                            if(err){
                                CallBack('error');
                            }else{
                                CallBack({messages: msg , name: user[0].nom+" "+user[0].prenom});
                            }
                        });
                    }
                });
            }
        });
    }

    
        /******  Methode pour ajouter un messages pour un contact ******/
    static addMessage(inputs,CallBack){
        connexion.query("INSERT INTO tchat (texte, date, idEmeteur, idRecepteur) VALUES (?, ?, ?, ?)",[inputs.msg, new Date(), inputs.idEm, inputs.idRcp], (err, msg)=>{       
            if(err){
                CallBack('error');
            }else{
                CallBack('done');
            }
        });
    }

    
       /******  Methode pour les notification ******/
    static notification(CallBack){
    }


}

module.exports = messenger;