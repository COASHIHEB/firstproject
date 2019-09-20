var connexion = require('../../config/db');
var moment = require('../../config/moment');

class messenger{
        /******  Methode pour afficher les contacts ******/
    static selectContacts(input,CallBack){
        connexion.query("SELECT * FROM utilisateur WHERE (statut='Administrateur' OR statut='Employe') AND idUtil <> ?",[input], (err, contacts)=>{
         
            if(err){
                CallBack('error');
            }else{
                CallBack(contacts);
            }
        });
    }

    
        /******  Methode pour afficher la liste des messages pour un contact ******/
    static selectMessages(inputs,CallBack){
        connexion.query("SELECT * FROM tchat WHERE (idEmeteur=? AND idRecepteur=?) OR (idEmeteur=? AND idRecepteur=?) ORDER BY idtchat ASC",[inputs.idEm, inputs.idRcp, inputs.idRcp, inputs.idEm], (err, msg)=>{
            if(err){
                CallBack('error');
            }else{
                connexion.query("SELECT * FROM utilisateur WHERE idUtil=?",[inputs.idEm], (err, user)=>{     
                    if(err){
                        CallBack('error');
                    }else{
                        connexion.query("UPDATE tchat SET statut='lu' WHERE (idRecepteur =? AND idEmeteur =?) ",[inputs.idRcp, inputs.idEm], (err, statut)=>{
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
        connexion.query("INSERT INTO tchat (message, date, idEmeteur, idRecepteur) VALUES (?, ?, ?, ?)",[inputs.msg, new Date(), inputs.idEm, inputs.idRcp], (err, msg)=>{       
            if(err){
                CallBack('error');
            }else{
                require("../../models/user").selecteUsreConnected(inputs.idEm,(user) => {
                    if(err){
                        CallBack('error');
                    }else{
                        CallBack(user);
                    }
                });
            }
        });
    }

    
       /******  Methode pour les notification ******/
    static notification(input,CallBack){
        connexion.query("SELECT *, count(*) as nbr FROM utilisateur JOIN tchat ON utilisateur.idUtil = tchat.idEmeteur WHERE idRecepteur= ? AND tchat.statut ='non lu' GROUP BY tchat.idEmeteur",[input], (err, msg)=>{
            if(err){
                CallBack('error');
            }else{
                CallBack(msg);
            }
        });
    }

    
       /******  Methode pour fais vu tous les notifivations ******/
    static viewAll(input,CallBack){
        connexion.query("UPDATE tchat SET statut='lu' WHERE (idRecepteur =?) ",[input], (err, statut)=>{
            if(err){
                CallBack('error');
            }else{
                CallBack('done');
            }
        });
    }


}

module.exports = messenger;